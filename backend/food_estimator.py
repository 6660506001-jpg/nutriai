import re
from difflib import SequenceMatcher

from nutrition_api import fetch_calorieninjas
from nlp_food_parser import estimate_from_text_parsing
from portion_parser import format_portion_note, parse_portion, scale_nutrition
from thai_food_matcher import match_thai_food

DEFAULT_NUTRITION = {"calories": 450, "protein": 20, "carbs": 52, "fat": 16}

# fallback กรณีไม่ match ฐานข้อมูลเมนูไทย (เรียงจากเฉพาะเจาะจง → ทั่วไป)
FOOD_RULES = [
    (["ข้าวกะเพรา", "กะเพรา"], {"calories": 589, "protein": 28, "carbs": 75, "fat": 22}),
    (["ข้าวผัด"], {"calories": 534, "protein": 14, "carbs": 82, "fat": 16}),
    (["ข้าวมัน"], {"calories": 602, "protein": 24, "carbs": 68, "fat": 28}),
    (["ผัดไทย"], {"calories": 460, "protein": 14, "carbs": 68, "fat": 14}),
    (["ส้มตำ"], {"calories": 280, "protein": 6, "carbs": 52, "fat": 8}),
    (["ยำ", "ลาบ", "แซ่บ"], {"calories": 280, "protein": 20, "carbs": 12, "fat": 16}),
    (["ต้มยำ"], {"calories": 200, "protein": 16, "carbs": 12, "fat": 10}),
    (["แกงเขียวหวาน"], {"calories": 380, "protein": 22, "carbs": 12, "fat": 28}),
    (["ก๋วยเตี๋ยว"], {"calories": 380, "protein": 22, "carbs": 52, "fat": 10}),
    (["สลัด"], {"calories": 180, "protein": 12, "carbs": 14, "fat": 8}),
    (["ไก่ทอด"], {"calories": 540, "protein": 32, "carbs": 22, "fat": 36}),
    (["หมูทอด", "หมูกรอบ"], {"calories": 520, "protein": 28, "carbs": 8, "fat": 42}),
    (["ไข่เจียว"], {"calories": 250, "protein": 14, "carbs": 4, "fat": 20}),
    (["โจ๊ก"], {"calories": 320, "protein": 18, "carbs": 45, "fat": 8}),
    (["กล้วย", "banana"], {"calories": 105, "protein": 1.3, "carbs": 27, "fat": 0.4}),
    (["ส้ม", "orange"], {"calories": 62, "protein": 1.2, "carbs": 15.4, "fat": 0.2}),
    (["มะม่วง", "mango"], {"calories": 135, "protein": 1.1, "carbs": 35, "fat": 0.6}),
    (["มะละกอ", "papaya"], {"calories": 59, "protein": 0.9, "carbs": 15, "fat": 0.2}),
    (["แอปเปิ้ล", "apple"], {"calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3}),
    (["องุ่น", "grape"], {"calories": 104, "protein": 1.1, "carbs": 27, "fat": 0.2}),
    (["แตงโม", "watermelon"], {"calories": 86, "protein": 1.7, "carbs": 22, "fat": 0.4}),
    (["สับปะรด", "pineapple"], {"calories": 82, "protein": 0.9, "carbs": 22, "fat": 0.2}),
    (["ทุเรียน", "durian"], {"calories": 147, "protein": 1.5, "carbs": 27, "fat": 5}),
    (["มังคุด", "mangosteen"], {"calories": 63, "protein": 0.6, "carbs": 16, "fat": 0.2}),
    (["ลำไย", "longan"], {"calories": 120, "protein": 1.3, "carbs": 31, "fat": 0.1}),
    (["ลิ้นจี่", "lychee"], {"calories": 125, "protein": 1.6, "carbs": 31, "fat": 0.4}),
    (["ฝรั่ง", "guava"], {"calories": 37, "protein": 1.4, "carbs": 8, "fat": 0.5}),
]


def _normalize(text):
    return re.sub(r"\s+", " ", str(text or "").strip().lower())


def _nutrition_from_row(row):
    return {
        "calories": round(float(row.get("calories") or 0)),
        "protein": round(float(row.get("protein") or 0), 1),
        "carbs": round(float(row.get("carbs") or row.get("carb") or 0), 1),
        "fat": round(float(row.get("fat") or 0), 1),
    }


def _best_db_match(name, cursor):
    clean_name = re.sub(r"\s+", " ", str(name or "").strip())
    norm = _normalize(clean_name)
    if not norm or cursor is None:
        return None

    candidates = []
    try:
        cursor.execute("SELECT * FROM foods WHERE name LIKE %s LIMIT 20", (f"%{clean_name}%",))
        candidates.extend(cursor.fetchall())

        for token in [t for t in re.split(r"[\s,/]+", clean_name) if len(t) >= 2][:4]:
            cursor.execute("SELECT * FROM foods WHERE name LIKE %s LIMIT 8", (f"%{token}%",))
            candidates.extend(cursor.fetchall())
    except Exception:
        return None

    if not candidates:
        return None

    unique = {}
    for row in candidates:
        key = row.get("id") or row.get("name")
        unique[key] = row

    best_row = None
    best_score = 0.0
    for row in unique.values():
        row_name = str(row.get("name") or "")
        row_norm = _normalize(row_name)
        if row_norm == norm:
            return row, 1.0, row_name

        score = SequenceMatcher(None, norm, row_norm).ratio()
        if norm in row_norm or row_norm in norm:
            overlap = min(len(norm), len(row_norm)) / max(len(norm), len(row_norm))
            score = max(score, 0.84 + overlap * 0.16)

        if score > best_score:
            best_score = score
            best_row = row

    if best_row and best_score >= 0.68:
        return best_row, best_score, str(best_row.get("name") or "")
    return None


def _keyword_estimate(name):
    lowered = name.lower()
    for keywords, nutrition in FOOD_RULES:
        if any(keyword.lower() in lowered or keyword in name for keyword in keywords):
            return dict(nutrition), "rule"
    return dict(DEFAULT_NUTRITION), "rule_default"


def _build_result(name, nutrition, source, matched_alias=None, portion_note=None):
    payload = {
        "name": name,
        "calories": round(nutrition["calories"]),
        "protein": round(float(nutrition["protein"]), 1),
        "carbs": round(float(nutrition["carbs"]), 1),
        "fat": round(float(nutrition["fat"]), 1),
        "estimated": True,
        "estimateSource": source,
    }
    if matched_alias:
        payload["matchedReference"] = matched_alias
    if portion_note:
        payload["portionNote"] = portion_note
    return payload


def estimate_food_from_name(name, cursor=None):
    clean_name = re.sub(r"\s+", " ", str(name or "").strip())
    if not clean_name:
        return None

    portion = parse_portion(clean_name)
    match_name = portion["foodName"]
    portion_note = format_portion_note(portion)

    thai_match = match_thai_food(match_name)
    if thai_match and thai_match["score"] >= 0.72:
        item = thai_match["item"]
        scaled = scale_nutrition(item, portion, item)
        reference = thai_match["matchedAlias"]
        if portion_note:
            reference = f"{reference} · {portion_note}"
        return _build_result(
            clean_name,
            scaled,
            "thai_reference",
            reference,
            portion_note,
        )

    db_match = _best_db_match(match_name, cursor)
    if db_match:
        row, score, matched_name = db_match
        scaled = scale_nutrition(_nutrition_from_row(row), portion)
        reference = matched_name
        if portion_note:
            reference = f"{matched_name} · {portion_note}"
        return _build_result(
            clean_name,
            scaled,
            "database" if score >= 0.9 else "database_fuzzy",
            reference,
            portion_note,
        )

    nlp_result = estimate_from_text_parsing(match_name)
    if nlp_result:
        scaled = scale_nutrition(nlp_result, portion)
        payload = _build_result(
            clean_name,
            scaled,
            nlp_result.get("estimateSource", "nlp_parse"),
            nlp_result.get("matchedReference"),
            portion_note,
        )
        if nlp_result.get("parsedIngredients"):
            payload["parsedIngredients"] = nlp_result["parsedIngredients"]
            payload["parseMethod"] = nlp_result.get("parseMethod")
            payload["dishLabel"] = nlp_result.get("dishLabel")
        return payload

    api_result = fetch_calorieninjas(clean_name)
    if api_result:
        scaled = scale_nutrition(api_result, portion)
        reference = api_result.get("matchedQuery")
        if portion_note and reference:
            reference = f"{reference} · {portion_note}"
        return _build_result(
            clean_name,
            scaled,
            api_result.get("estimateSource", "calorieninjas"),
            reference,
            portion_note,
        )

    nutrition, source = _keyword_estimate(match_name)
    scaled = scale_nutrition(nutrition, portion)
    return _build_result(clean_name, scaled, source, portion_note=portion_note)
