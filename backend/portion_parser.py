import re

THAI_NUMBER_WORDS = {
    "หนึ่ง": 1,
    "สอง": 2,
    "สาม": 3,
    "สี่": 4,
    "ห้า": 5,
    "ครึ่ง": 0.5,
    "เค้า": 0.5,
}

PIECE_UNITS = {"ลูก", "ชิ้น", "ผล", "ฟอง"}
CUP_UNITS = {"ถ้วย", "แก้ว"}

# มาตรฐานอ้างอิงใกล้ Google / HDmall
UNIT_GRAMS = {
    "จาน": 150,
    "ทัพพี": 80,
    "ทัพพจน์": 80,
    "ช้อน": 15,
    "ชาม": 200,
    "ถ้วย": 120,
    "ลูก": None,
    "ชิ้น": None,
    "ผล": None,
    "ก": None,
    "g": None,
    "gram": None,
    "กรัม": None,
}


def _parse_number(raw):
    if raw is None:
        return 1.0
    token = str(raw).strip().lower()
    if token in THAI_NUMBER_WORDS:
        return float(THAI_NUMBER_WORDS[token])
    try:
        return float(token)
    except ValueError:
        return 1.0


def parse_portion(name):
    original = re.sub(r"\s+", " ", str(name or "").strip())
    food_name = original
    multiplier = 1.0
    unit = None
    grams = None

    patterns = [
        r"(\d+(?:\.\d+)?|หนึ่ง|สอง|สาม|สี่|ห้า|ครึ่ง|เค้า)\s*(จาน|ทัพพี|ทัพพจน์|ชาม|ถ้วย|ช้อน|ลูก|ชิ้น|ผล|ฟอง)",
        r"(\d+(?:\.\d+)?)\s*(g|ก|gram|กรัม)\b",
    ]

    for pattern in patterns:
        match = re.search(pattern, original, flags=re.IGNORECASE)
        if not match:
            continue
        multiplier = _parse_number(match.group(1))
        unit = match.group(2).lower()
        food_name = (original[: match.start()] + original[match.end() :]).strip(" ,-")
        break

    if not unit:
        if re.search(r"\b1\s*จาน\b", original, flags=re.IGNORECASE):
            multiplier, unit = 1.0, "จาน"
            food_name = re.sub(r"\b1\s*จาน\b", "", original, flags=re.IGNORECASE).strip(" ,-")
        elif "หนึ่งจาน" in original.replace(" ", ""):
            multiplier, unit = 1.0, "จาน"
            food_name = re.sub(r"หนึ่ง\s*จาน", "", original).strip(" ,-")

    if unit in ("g", "ก", "gram", "กรัม"):
        grams = multiplier
    elif unit in UNIT_GRAMS and UNIT_GRAMS[unit]:
        grams = multiplier * UNIT_GRAMS[unit]

    if not food_name:
        food_name = original

    return {
        "originalName": original,
        "foodName": food_name,
        "multiplier": multiplier,
        "unit": unit,
        "grams": grams,
    }


def scale_nutrition(nutrition, portion, item=None):
    base = {
        "calories": float(nutrition.get("calories") or 0),
        "protein": float(nutrition.get("protein") or 0),
        "carbs": float(nutrition.get("carbs") or 0),
        "fat": float(nutrition.get("fat") or 0),
    }

    per100g = (item or {}).get("per100g")
    default_serving_grams = (item or {}).get("defaultServingGrams")

    if portion.get("grams"):
        target_grams = portion["grams"]
        if per100g:
            factor = target_grams / 100.0
            source = per100g
        elif default_serving_grams:
            factor = target_grams / float(default_serving_grams)
            source = base
        else:
            factor = target_grams / 150.0
            source = base
    elif portion.get("unit") in PIECE_UNITS and default_serving_grams:
        base_count = float(portion.get("baseServingCount") or 1)
        factor = portion["multiplier"] / base_count
        source = base
    elif portion.get("unit") in CUP_UNITS and default_serving_grams:
        base_count = float(portion.get("baseServingCount") or 1)
        factor = portion["multiplier"] / base_count
        source = base
    elif portion.get("unit") and default_serving_grams and portion["unit"] in UNIT_GRAMS:
        target_grams = portion["multiplier"] * UNIT_GRAMS[portion["unit"]]
        factor = target_grams / float(default_serving_grams)
        source = base
    elif portion.get("multiplier") and portion["multiplier"] != 1:
        factor = portion["multiplier"]
        source = base
    else:
        return {
            "calories": round(base["calories"]),
            "protein": round(base["protein"], 1),
            "carbs": round(base["carbs"], 1),
            "fat": round(base["fat"], 1),
        }

    return {
        "calories": round(source["calories"] * factor),
        "protein": round(source["protein"] * factor, 1),
        "carbs": round(source["carbs"] * factor, 1),
        "fat": round(source["fat"] * factor, 1),
    }


def format_portion_note(portion):
    if portion.get("grams"):
        return f"{int(portion['grams'])}g"
    if portion.get("unit"):
        qty = portion["multiplier"]
        qty_text = int(qty) if qty == int(qty) else qty
        return f"{qty_text} {portion['unit']}"
    return None
