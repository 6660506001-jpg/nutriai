from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import mysql.connector
from mysql.connector import Error
import os
from db_config import get_cors_origins, get_db_settings
from food_estimator import estimate_food_from_name
from thai_food_matcher import search_thai_foods
from activity_catalog import search_activities_local
from ml_engine import analyze_meal, load_models, score_menus

app = FastAPI()

@app.on_event("startup")
def warmup_ml_models():
    get_loaded_models()

# --- CORS (ตั้ง FRONTEND_URL บน production เช่น https://nutriai.vercel.app) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 🧠 Load Machine Learning Models (lazy — ไม่บล็อก login/register) ---
def get_loaded_models():
    try:
        return load_models(train_if_missing=True)
    except Exception as error:
        print(f"⚠️ ML models unavailable: {error}")
        return {}

# --- Database Connection ---
def get_db_connection():
    settings = get_db_settings()
    try:
        return mysql.connector.connect(
            host=settings["host"],
            port=settings["port"],
            user=settings["user"],
            password=settings["password"],
            database=settings["database"],
        )
    except Error as e:
        print(f"❌ Database Error: {e}")
        return None

def ensure_sync_table(conn):
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS user_sync_data (
              username VARCHAR(64) NOT NULL PRIMARY KEY,
              payload JSON NOT NULL,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()
    finally:
        cursor.close()


def parse_sync_payload(raw):
    if raw is None:
        return None
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except Exception:
            return None
    return None


def payload_has_daily_logs(payload):
    if not isinstance(payload, dict):
        return False
    meals = payload.get("dailyMeals") or {}
    if isinstance(meals, dict):
        for items in meals.values():
            if items:
                return True
    return bool(payload.get("activities"))


def _item_merge_key(item):
    if not isinstance(item, dict):
        return ""
    item_id = item.get("id")
    if item_id is not None and str(item_id):
        return f"id:{item_id}"
    return "|".join(
        str(item.get(field) or "")
        for field in ("name", "loggedAt", "calories", "mealPeriod", "durationMinutes")
    )


def merge_item_lists(primary, secondary):
    seen = set()
    merged = []
    for item in list(primary or []) + list(secondary or []):
        key = _item_merge_key(item)
        if not key or key in seen:
            continue
        seen.add(key)
        merged.append(item)
    return merged


def merge_meal_maps(primary, secondary):
    keys = set((primary or {}).keys()) | set((secondary or {}).keys())
    return {
        key: merge_item_lists((primary or {}).get(key), (secondary or {}).get(key))
        for key in keys
    }


def merge_sync_payload(existing, incoming):
    if not incoming:
        return existing or incoming
    if not existing:
        return incoming
    same_day = existing.get("lastDate") and incoming.get("lastDate") and existing.get("lastDate") == incoming.get("lastDate")
    if incoming.get("rolledOver"):
        return incoming
    if same_day and payload_has_daily_logs(existing) and not payload_has_daily_logs(incoming):
        merged = dict(incoming)
        merged["dailyMeals"] = existing.get("dailyMeals", incoming.get("dailyMeals"))
        merged["activities"] = existing.get("activities", incoming.get("activities"))
        return merged
    if same_day and payload_has_daily_logs(existing) and payload_has_daily_logs(incoming):
        merged = dict(incoming)
        merged["dailyMeals"] = merge_meal_maps(existing.get("dailyMeals"), incoming.get("dailyMeals"))
        merged["activities"] = merge_item_lists(existing.get("activities"), incoming.get("activities"))
        return merged
    return incoming


def verify_user_credentials(username, password):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB Connection Failed")
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT username FROM users WHERE username = %s AND password_hash = %s",
            (username, password),
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Invalid Credentials")
        return row["username"]
    finally:
        cursor.close()
        conn.close()


# --- Health check ---
@app.get("/health")
async def health():
    conn = get_db_connection()
    if conn:
        conn.close()
        return {"status": "ok", "database": "connected"}
    return {"status": "ok", "database": "unavailable"}

# --- 🔍 1. Search Endpoint (ส่วนที่ทำให้ปุ่มค้นหาทำงาน) ---
@app.get("/api/foods/search")
async def search_foods(q: str = Query(None)):
    if not q:
        return []

    db_results = []
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            query = "SELECT * FROM foods WHERE name LIKE %s"
            cursor.execute(query, (f"%{q}%",))
            db_results = cursor.fetchall()
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            cursor.close()
            conn.close()

    if db_results:
        return db_results

    return search_thai_foods(q)

@app.post("/api/foods/estimate")
async def estimate_food(data: dict):
    name = str(data.get("name", "")).strip()
    if not name:
        raise HTTPException(status_code=400, detail="Food name is required")

    conn = get_db_connection()
    cursor = None
    try:
        if conn:
            cursor = conn.cursor(dictionary=True)
        result = estimate_food_from_name(name, cursor)
        if not result:
            raise HTTPException(status_code=400, detail="Invalid food name")
        return result
    except HTTPException:
        raise
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- 2. Register System ---
@app.post("/register")
async def register(data: dict):
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="DB Connection Failed")
    cursor = conn.cursor()
    try:
        w, h, a = float(data['weight']), float(data['height']), int(data['age'])
        gender = data['gender']
        
        # คำนวณ BMR พื้นฐาน
        bmr = (10 * w) + (6.25 * h) - (5 * a) + (5 if gender == 'Male' else -161)
        tdee = bmr * 1.2 
        
        query = """INSERT INTO users (username, password_hash, gender, age, weight, height, activity_level, bmr, tdee) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (data['username'], data['password'], gender, a, w, h, 'Sedentary', bmr, tdee))
        conn.commit()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# --- User log sync (meals / activities / history) ---
@app.post("/api/user-data/load")
async def load_user_data(data: dict):
    username = str(data.get("username") or "").strip()
    password = data.get("password")
    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")

    verify_user_credentials(username, password)

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB Connection Failed")
    ensure_sync_table(conn)
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT payload, updated_at FROM user_sync_data WHERE username = %s",
            (username,),
        )
        row = cursor.fetchone()
        if not row:
            return {"payload": None, "updated_at": None}
        payload = row["payload"]
        if isinstance(payload, str):
            payload = json.loads(payload)
        updated = row["updated_at"]
        updated_iso = updated.isoformat() if updated else None
        return {"payload": payload, "updated_at": updated_iso}
    finally:
        cursor.close()
        conn.close()


@app.post("/api/user-data/save")
async def save_user_data(data: dict):
    username = str(data.get("username") or "").strip()
    password = data.get("password")
    payload = data.get("payload")
    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")
    if payload is None:
        raise HTTPException(status_code=400, detail="payload required")

    verify_user_credentials(username, password)

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB Connection Failed")
    ensure_sync_table(conn)
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT payload FROM user_sync_data WHERE username = %s",
            (username,),
        )
        row = cursor.fetchone()
        existing = parse_sync_payload(row[0] if row else None)
        incoming = payload if isinstance(payload, dict) else parse_sync_payload(payload)
        merged = merge_sync_payload(existing, incoming)
        payload_json = json.dumps(merged, ensure_ascii=False)
        cursor.execute(
            """
            INSERT INTO user_sync_data (username, payload)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = CURRENT_TIMESTAMP
            """,
            (username, payload_json),
        )
        conn.commit()
        return {"status": "ok"}
    finally:
        cursor.close()
        conn.close()


# --- 3. Login System ---
@app.post("/login")
async def login(data: dict):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB Connection Failed")
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM users WHERE username = %s AND password_hash = %s"
        cursor.execute(query, (data['username'], data['password']))
        user = cursor.fetchone()
        if user:
            return user
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    finally:
        cursor.close()
        conn.close()

# --- 4. AI Analysis System (Random Forest + SVM + Gradient Boosting) ---
@app.get("/api/ml/models")
async def ml_models_status():
    models = get_loaded_models()
    return {
        "ready": all(key in models for key in ("rf", "svm", "gb")),
        "models": {
            "rf": "Random Forest" if "rf" in models else None,
            "svm": "Support Vector Machines" if "svm" in models else None,
            "gb": "Gradient Boosting" if "gb" in models else None,
        },
    }


@app.post("/api/ml/analyze-meal")
async def ml_analyze_meal(data: dict):
    models = get_loaded_models()
    if not models:
        raise HTTPException(status_code=503, detail="ML models unavailable")
    return analyze_meal(data, models)


@app.post("/api/ml/score-menus")
async def ml_score_menus(data: dict):
    menus = data.get("menus") or []
    if not isinstance(menus, list) or not menus:
        return {"items": []}
    models = get_loaded_models()
    if not models:
        return {"items": []}
    remaining = float(data.get("remainingCal") or 0)
    return {"items": score_menus(menus, remaining, models)}


@app.post("/analyze-meal")
async def analyze_meal_endpoint(data: dict):
    food = data.get("food") or data
    if not food:
        raise HTTPException(status_code=400, detail="No food data")

    calories = float(food.get("calories", 0) or 0)
    carbs = float(food.get("carbs", 0) or 0)
    protein = float(food.get("protein", 0) or 0)
    fat = float(food.get("fat", 0) or 0)
    remaining = float(data.get("remainingCal") or food.get("remainingCal") or 0)

    models = get_loaded_models()
    ml = analyze_meal(
        {
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fat": fat,
            "remainingCal": remaining,
        },
        models,
    ) if models else None

    prediction_status = (ml or {}).get("ensemble", {}).get("label") or "วิเคราะห์ด้วยเกณฑ์โภชนาการ"

    recommendations = []
    if carbs > 60:
        recommendations.append("คาร์โบไฮเดรตสูง: ลดปริมาณแป้งในมื้อนี้ลงได้")
    if calories > 500:
        recommendations.append("พลังงานมื้อเดียวค่อนข้างสูง: เพิ่มการเดินย่อยได้")
    if not recommendations:
        recommendations.append("เมนูนี้มีโภชนาการที่เหมาะสม")

    return {
        "status": prediction_status,
        "ai_advice": recommendations,
        "details": food,
        "ml": ml,
    }

# --- 🔍 ค้นหากิจกรรมจาก MySQL ---
@app.get("/api/activities/search")
async def search_activities(q: str = Query(None)):
    if not q:
        return []

    db_results = []
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            query = "SELECT * FROM activities WHERE name LIKE %s"
            cursor.execute(query, (f"%{q}%",))
            db_results = cursor.fetchall()
        except Error:
            db_results = []
        finally:
            cursor.close()
            conn.close()

    if db_results:
        return db_results

    return search_activities_local(q)

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)