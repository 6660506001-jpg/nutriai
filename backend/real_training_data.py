"""ดึงตัวอย่างเทรนจาก MySQL — ใช้มื้ออาหาร + ค่าทางร่างกาย ไม่ใช้ username / รหัสผ่าน / รูป."""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import numpy as np

from db_config import get_db_settings

FEATURE_ROW_NAMES = [
    "calories",
    "protein",
    "carbs",
    "fat",
    "remaining_cal",
    "remaining_protein",
    "remaining_carbs",
    "remaining_fat",
    "age",
    "weight_kg",
    "height_cm",
    "tdee",
    "gender",
]


def _load_env_file() -> None:
    path = Path(__file__).with_name(".env")
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ[key.strip()] = value.strip().strip('"').strip("'")


def _num(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _parse_payload(raw: Any) -> dict[str, Any]:
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, (bytes, bytearray)):
        raw = raw.decode("utf-8", errors="ignore")
    if isinstance(raw, str) and raw.strip():
        try:
            data = json.loads(raw)
            return data if isinstance(data, dict) else {}
        except json.JSONDecodeError:
            return {}
    return {}


def _encode_gender(value: Any) -> float:
    text = str(value or "").strip().lower()
    if text in ("male", "m", "ชาย", "1"):
        return 1.0
    return 0.0


def _item_cal(item: dict[str, Any]) -> float:
    return _num(item.get("calories") or item.get("cal") or item.get("kcal"))


def _foods_from_meals(meals: Any) -> list[dict[str, Any]]:
    foods: list[dict[str, Any]] = []
    if isinstance(meals, dict):
        lists = meals.values()
    elif isinstance(meals, list):
        lists = [meals]
    else:
        return foods
    for group in lists:
        for item in group or []:
            if not isinstance(item, dict):
                continue
            if str(item.get("itemType") or "").lower() == "activity":
                continue
            cal = _item_cal(item)
            if cal <= 0:
                continue
            foods.append({
                "calories": cal,
                "protein": _num(item.get("protein")),
                "carbs": _num(item.get("carbs")),
                "fat": _num(item.get("fat")),
            })
    return foods


def _activity_cals(activities: Any) -> float:
    total = 0.0
    for item in activities or []:
        if isinstance(item, dict):
            total += _item_cal(item)
    return total


def _day_rows(profile: dict[str, float], foods: list[dict[str, Any]], activity_cals: float) -> list[list[float]]:
    tdee = profile["tdee"]
    daily_p = (tdee * 0.30) / 4
    daily_c = (tdee * 0.40) / 4
    daily_f = (tdee * 0.30) / 9
    eaten_cals = 0.0
    eaten_p = 0.0
    eaten_c = 0.0
    eaten_f = 0.0
    rows: list[list[float]] = []
    for food in foods:
        remaining_cal = tdee - (eaten_cals - activity_cals)
        remaining_p = daily_p - eaten_p
        remaining_c = daily_c - eaten_c
        remaining_f = daily_f - eaten_f
        rows.append([
            food["calories"],
            food["protein"],
            food["carbs"],
            food["fat"],
            remaining_cal,
            remaining_p,
            remaining_c,
            remaining_f,
            profile["age"],
            profile["weight"],
            profile["height"],
            tdee,
            profile["gender"],
        ])
        eaten_cals += food["calories"]
        eaten_p += food["protein"]
        eaten_c += food["carbs"]
        eaten_f += food["fat"]
    return rows


def _table_names(cursor) -> set[str]:
    cursor.execute("SHOW TABLES")
    names: set[str] = set()
    for record in cursor.fetchall():
        names.add(str(next(iter(record.values()))).lower())
    return names


def _profile_from_user(record: dict[str, Any], extra: dict[str, Any] | None = None) -> dict[str, float] | None:
    extra = extra or {}
    age = _num(record.get("age") or extra.get("age"))
    weight = _num(record.get("weight") or extra.get("weight"))
    height = _num(record.get("height") or extra.get("height"))
    tdee = _num(record.get("tdee") or extra.get("tdee") or record.get("bmr") or extra.get("bmr"))
    if age <= 0 or weight <= 0 or height <= 0 or tdee <= 0:
        return None
    return {
        "age": age,
        "weight": weight,
        "height": height,
        "tdee": tdee,
        "gender": _encode_gender(record.get("gender") or extra.get("gender")),
    }


def _rows_from_sync_payloads(records: list[dict[str, Any]]) -> tuple[list[list[float]], int]:
    rows: list[list[float]] = []
    users_with_meals = 0
    for record in records:
        payload = _parse_payload(record.get("payload"))
        user_obj = payload.get("user") if isinstance(payload.get("user"), dict) else {}
        profile = _profile_from_user(record, user_obj)
        if not profile:
            continue
        before = len(rows)
        rows.extend(_day_rows(profile, _foods_from_meals(payload.get("dailyMeals")), _activity_cals(payload.get("activities"))))
        for day in payload.get("historyData") or []:
            if not isinstance(day, dict):
                continue
            foods = _foods_from_meals(day.get("meals") or day.get("dailyMeals"))
            act = _activity_cals(day.get("activities"))
            rows.extend(_day_rows(profile, foods, act))
        if len(rows) > before:
            users_with_meals += 1
    return rows, users_with_meals


def _column_names(cursor, table: str) -> set[str]:
    cursor.execute(f"SHOW COLUMNS FROM `{table}`")
    return {str(row["Field"]).lower() for row in cursor.fetchall()}


def _rows_from_meal_logs(cursor, tables: set[str]) -> tuple[list[list[float]], int, int]:
    food_join = ""
    if "food_items" in tables:
        food_join = """
          LEFT JOIN food_items fi ON fi.food_id = m.food_id
        """
        cal_expr = "COALESCE(fi.calories, 0)"
        p_expr = "COALESCE(fi.protein, 0)"
        c_expr = "COALESCE(fi.carbs, 0)"
        f_expr = "COALESCE(fi.fat, 0)"
    elif "foods" in tables:
        food_join = """
          LEFT JOIN foods fo ON fo.food_id = m.food_id
        """
        cal_expr = "COALESCE(fo.calories, 0)"
        p_expr = "COALESCE(fo.protein, 0)"
        c_expr = "COALESCE(fo.carbs, 0)"
        f_expr = "COALESCE(fo.fat, 0)"
    else:
        return [], 0, 0

    user_cols = _column_names(cursor, "users")
    uid_col = "user_id" if "user_id" in user_cols else "id"
    cursor.execute(
        f"""
        SELECT
          u.gender, u.age, u.weight, u.height, u.tdee, u.bmr,
          u.{uid_col} AS uid,
          DATE(m.log_date) AS log_day,
          COALESCE(m.serving_size, 1) AS serving_size,
          {cal_expr} AS calories,
          {p_expr} AS protein,
          {c_expr} AS carbs,
          {f_expr} AS fat
        FROM users u
        JOIN meal_logs m ON m.user_id = u.{uid_col}
        {food_join}
        ORDER BY uid, log_day, m.log_date
        """
    )
    meals = cursor.fetchall()
    acts_by_user_day: dict[tuple[Any, str], float] = {}
    if "activity_logs" in tables:
        cursor.execute(
            """
            SELECT user_id, DATE(log_date) AS log_day, SUM(calories_burned) AS burned
            FROM activity_logs
            GROUP BY user_id, DATE(log_date)
            """
        )
        for rec in cursor.fetchall():
            acts_by_user_day[(rec["user_id"], str(rec["log_day"]))] = _num(rec.get("burned"))

    grouped: dict[tuple[Any, str], dict[str, Any]] = {}
    for rec in meals:
        key = (rec["uid"], str(rec["log_day"]))
        bucket = grouped.setdefault(key, {"profile_src": rec, "foods": []})
        serving = max(_num(rec.get("serving_size"), 1.0), 0.0) or 1.0
        cal = _num(rec.get("calories")) * serving
        if cal <= 0:
            continue
        bucket["foods"].append({
            "calories": cal,
            "protein": _num(rec.get("protein")) * serving,
            "carbs": _num(rec.get("carbs")) * serving,
            "fat": _num(rec.get("fat")) * serving,
        })

    rows: list[list[float]] = []
    users_with_meals: set[Any] = set()
    for (uid, day), bucket in grouped.items():
        profile = _profile_from_user(bucket["profile_src"])
        if not profile or not bucket["foods"]:
            continue
        act = acts_by_user_day.get((uid, day), 0.0)
        rows.extend(_day_rows(profile, bucket["foods"], act))
        users_with_meals.add(uid)
    return rows, len(users_with_meals), len(meals)


def fetch_mysql_feature_rows() -> tuple[np.ndarray, dict[str, Any]]:
    """คืน X จากมื้อจริง — ไม่ใส่ชื่อบัญชี/รหัสผ่าน/รูป."""
    _load_env_file()
    from db_config import _env, _is_private_railway_host, _running_on_railway, _settings_from_mysql_url

    raw_url = _env("MYSQL_URL", "MYSQL_PUBLIC_URL", "DATABASE_URL")
    parsed_url = _settings_from_mysql_url(raw_url)
    if (
        parsed_url
        and _is_private_railway_host(parsed_url["host"])
        and not _running_on_railway()
        and not _settings_from_mysql_url(_env("MYSQL_PUBLIC_URL"))
    ):
        raise RuntimeError(
            "MYSQL_URL ชี้ไป mysql.railway.internal ซึ่งใช้ได้เฉพาะใน Railway "
            "จากเครื่องนี้ให้คัดลอก MYSQL_PUBLIC_URL (โฮสต์มักเป็น xxx.proxy.rlwy.net) "
            "แล้วใส่ใน backend/.env เป็น MYSQL_PUBLIC_URL=mysql://..."
        )

    settings = get_db_settings()
    import mysql.connector

    try:
        conn = mysql.connector.connect(
            host=settings["host"],
            port=settings["port"],
            user=settings["user"],
            password=settings["password"],
            database=settings["database"],
        )
    except Exception as exc:
        err = str(exc)
        if "getaddrinfo" in err or "11001" in err or "Name or service not known" in err:
            raise RuntimeError(
                f"หาโฮสต์ MySQL ไม่เจอ: {settings['host']}\n"
                "ถ้าเป็น Railway ต้องใช้ MYSQL_PUBLIC_URL ไม่ใช่ MYSQL_URL แบบ .railway.internal"
            ) from exc
        raise
    cursor = conn.cursor(dictionary=True)
    try:
        tables = _table_names(cursor)
        rows: list[list[float]] = []
        profiles: list[dict[str, float]] = []
        users_scanned = 0
        users_with_meals = 0
        path = "none"
        if "users" in tables:
            cursor.execute("SELECT gender, age, weight, height, tdee, bmr FROM users")
            for record in cursor.fetchall():
                profile = _profile_from_user(record)
                if profile:
                    profiles.append(profile)
            users_scanned = len(profiles)
        if "user_sync_data" in tables:
            cursor.execute(
                """
                SELECT
                  u.gender, u.age, u.weight, u.height, u.tdee, u.bmr,
                  s.payload
                FROM users u
                LEFT JOIN user_sync_data s ON s.username = u.username
                """
            )
            rows, users_with_meals = _rows_from_sync_payloads(cursor.fetchall())
            path = "user_sync_data"
        if not rows and "meal_logs" in tables:
            rows, users_with_meals, _ = _rows_from_meal_logs(cursor, tables)
            path = "meal_logs"
    finally:
        cursor.close()
        conn.close()

    meta = {
        "source": "mysql",
        "path": path,
        "host": settings["host"],
        "database": settings["database"],
        "usersScanned": users_scanned,
        "usersWithMeals": users_with_meals,
        "nRows": len(rows),
        "profiles": profiles,
        "tables": sorted(tables),
    }
    if not rows:
        return np.empty((0, 13), dtype=float), meta
    return np.asarray(rows, dtype=float), meta


def _api_base_url() -> str:
    _load_env_file()
    from db_config import _env

    url = _env("API_BASE_URL", "REACT_APP_API_BASE_URL")
    if url:
        return url.rstrip("/")
    frontend_env = Path(__file__).resolve().parent.parent / "frontend" / ".env"
    if frontend_env.exists():
        for raw in frontend_env.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if line.startswith("REACT_APP_API_BASE_URL="):
                return line.split("=", 1)[1].strip().strip('"').strip("'").rstrip("/")
    return "https://nutriai-production-2fad.up.railway.app"


def fetch_api_feature_rows() -> tuple[np.ndarray, np.ndarray, dict[str, Any]]:
    from urllib.error import HTTPError, URLError
    from urllib.request import Request, urlopen

    base = _api_base_url()
    url = f"{base}/api/ml/training-rows"
    request = Request(url, headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=60) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        raise RuntimeError(
            f"ดึงมื้อจริงจาก API ไม่ได้ ({url} → HTTP {exc.code}) "
            "ต้อง deploy backend ที่มี /api/ml/training-rows ขึ้น Railway ก่อน"
        ) from exc
    except URLError as exc:
        raise RuntimeError(f"เชื่อม API ไม่ได้: {base}") from exc

    rows = payload.get("X") or []
    labels = payload.get("y") or []
    meta = {
        "source": "api-mysql-meals",
        "api": base,
        "host": payload.get("host"),
        "database": payload.get("database"),
        "path": payload.get("path"),
        "usersScanned": payload.get("usersScanned"),
        "usersWithMeals": payload.get("usersWithMeals"),
        "nRows": len(rows),
    }
    if not rows:
        return np.empty((0, 13), dtype=float), np.array([], dtype=int), meta
    return np.asarray(rows, dtype=float), np.asarray(labels, dtype=int), meta


def meals_around_profiles(profiles: list[dict[str, float]], n_samples: int = 4200, seed: int = 42):
    """สุ่มมื้อตามสูตรเดิม แต่ยึดอายุ/น้ำหนัก/ส่วนสูง/เพศ/TDEE จากผู้ใช้ใน MySQL."""
    from ml_engine import label_suitable

    rng = np.random.default_rng(seed)
    n_users = len(profiles)
    idx = rng.integers(0, n_users, size=n_samples)
    age = np.array([profiles[i]["age"] for i in idx], dtype=float)
    weight = np.array([profiles[i]["weight"] for i in idx], dtype=float)
    height = np.array([profiles[i]["height"] for i in idx], dtype=float)
    tdee = np.array([profiles[i]["tdee"] for i in idx], dtype=float)
    gender = np.array([profiles[i]["gender"] for i in idx], dtype=float)

    eaten_frac = rng.uniform(0.0, 1.18, size=n_samples)
    remaining_cal = tdee * (1.0 - eaten_frac)
    daily_p = (tdee * 0.30) / 4
    daily_c = (tdee * 0.40) / 4
    daily_f = (tdee * 0.30) / 9
    remaining_protein = daily_p * (1.0 - eaten_frac) + rng.normal(0, 4, size=n_samples)
    remaining_carbs = daily_c * (1.0 - eaten_frac) + rng.normal(0, 8, size=n_samples)
    remaining_fat = daily_f * (1.0 - eaten_frac) + rng.normal(0, 3, size=n_samples)

    calories = rng.integers(80, 780, size=n_samples).astype(float)
    protein = np.clip(calories * rng.uniform(0.02, 0.13, size=n_samples) / 4, 2, 58)
    carbs = np.clip(calories * rng.uniform(0.16, 0.64, size=n_samples) / 4, 4, 125)
    fat = np.clip(calories * rng.uniform(0.10, 0.50, size=n_samples) / 9, 2, 52)

    X = np.column_stack([
        calories, protein, carbs, fat,
        remaining_cal, remaining_protein, remaining_carbs, remaining_fat,
        age, weight, height, tdee, gender,
    ])
    y = np.array([label_suitable(*row) for row in X], dtype=int)
    return X, y


def label_feature_rows(X: np.ndarray) -> np.ndarray:
    import inspect
    from ml_engine import label_suitable

    n = len(inspect.signature(label_suitable).parameters)
    if len(X) == 0:
        return np.array([], dtype=int)
    return np.array([int(label_suitable(*row[:n])) for row in X], dtype=int)


def load_training_xy(source: str = "synthetic"):
    from ml_engine import generate_training_set, label_suitable

    source = (source or "synthetic").strip().lower()
    if source in ("synthetic", "fake", ""):
        X, y = generate_training_set()
        return X, y, {"source": "synthetic", "nRows": len(X)}

    X_real, meta = fetch_mysql_feature_rows()
    y_real = label_feature_rows(X_real)

    if source in ("mysql-only", "real-only"):
        if len(X_real):
            meta["source"] = "mysql-only"
            return X_real, y_real, meta
        X_api, y_api, api_meta = fetch_api_feature_rows()
        if len(X_api):
            return X_api, y_api, api_meta
        raise RuntimeError(
            "ยังไม่มีมื้อจริงทั้งใน MySQL เครื่องนี้และบน API "
            f"(local {meta.get('database')} @ {meta.get('host')}, "
            f"api usersWithMeals={api_meta.get('usersWithMeals')} nRows={api_meta.get('nRows')})"
        )

    X_syn, y_syn = generate_training_set()
    if len(X_real) == 0:
        meta["source"] = "synthetic-fallback"
        return X_syn, y_syn, meta
    X = np.vstack([X_real, X_syn])
    y = np.concatenate([y_real, y_syn])
    meta["source"] = "mysql+synthetic"
    meta["nSynthetic"] = len(X_syn)
    return X, y, meta
