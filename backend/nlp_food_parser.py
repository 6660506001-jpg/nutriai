import json
import os
import re
import urllib.error
import urllib.request

from thai_food_matcher import match_thai_food

_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "ingredients_kb.json")
_INGREDIENTS = None
_ALIAS_INDEX = []

ADDON_KEYWORDS = [
    ("ไข่ดาว", "fried_egg"),
    ("ไข่ทอด", "fried_egg"),
    ("ไข่เจียว", "omelette"),
    ("ไข่ต้ม", "boiled_egg"),
    ("ไข่ลวก", "boiled_egg"),
    ("เพิ่มไข่", "fried_egg"),
    ("ชีส", "cheese"),
]

PROTEIN_KEYWORDS = [
    ("ไก่", "chicken_meat"),
    ("หมู", "pork_meat"),
    ("เนื้อ", "beef_meat"),
    ("กุ้ง", "shrimp"),
    ("เต้าหู้", "tofu"),
]

DISH_TEMPLATES = {
    "krapao": {
        "triggers": ["กะเพรา", "กระเพรา"],
        "components": ["rice_cooked", "holy_basil", "chili_garlic", "fish_sauce", "cooking_oil"],
        "protein_slot": True,
        "default_protein": "chicken_meat",
    },
    "fried_rice": {
        "triggers": ["ข้าวผัด"],
        "components": ["rice_cooked", "cooking_oil", "chili_garlic", "fish_sauce"],
        "protein_slot": True,
        "default_protein": "chicken_meat",
    },
    "stir_fry": {
        "triggers": ["ผัด"],
        "components": ["rice_cooked", "mixed_vegetables", "cooking_oil", "chili_garlic"],
        "protein_slot": True,
        "default_protein": "chicken_meat",
    },
    "yum_salad": {
        "triggers": [],
        "components": ["mixed_vegetables", "chili_garlic", "fish_sauce"],
        "protein_slot": True,
        "default_protein": "chicken_meat",
    },
}

YUM_SALAD_EXCLUDES = ("ต้มยำ", "ข้าวยำ", "ก๋วยเตี๋ยวต้มยำ")


def _is_yum_salad_dish(text):
    if any(marker in text for marker in YUM_SALAD_EXCLUDES):
        return False
    return text.startswith("ยำ") or "ลาบ" in text or "แซ่บ" in text


def _normalize(text):
    return re.sub(r"\s+", " ", str(text or "").strip().lower())


def _load_ingredients():
    global _INGREDIENTS, _ALIAS_INDEX
    if _INGREDIENTS is not None:
        return
    with open(_DATA_PATH, "r", encoding="utf-8") as handle:
        _INGREDIENTS = json.load(handle)

    index = []
    for item in _INGREDIENTS:
        for alias in item["names"]:
            index.append(
                {
                    "alias": alias,
                    "alias_norm": _normalize(alias),
                    "item": item,
                    "length": len(alias),
                }
            )
    _ALIAS_INDEX = sorted(index, key=lambda row: row["length"], reverse=True)


def _get_ingredient(ingredient_id):
    _load_ingredients()
    for item in _INGREDIENTS:
        if item["id"] == ingredient_id:
            return item
    return None


def _ingredient_row(item, note=None):
    return {
        "id": item["id"],
        "name": item["names"][0],
        "servingLabel": item.get("servingLabel", ""),
        "grams": item.get("grams", 0),
        "calories": item.get("calories", 0),
        "protein": item.get("protein", 0),
        "carbs": item.get("carbs", 0),
        "fat": item.get("fat", 0),
        "note": note,
    }


def _sum_nutrition(rows):
    totals = {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
    for row in rows:
        totals["calories"] += float(row.get("calories") or 0)
        totals["protein"] += float(row.get("protein") or 0)
        totals["carbs"] += float(row.get("carbs") or 0)
        totals["fat"] += float(row.get("fat") or 0)
    return {
        "calories": round(totals["calories"]),
        "protein": round(totals["protein"], 1),
        "carbs": round(totals["carbs"], 1),
        "fat": round(totals["fat"], 1),
    }


def _detect_protein(text):
    for keyword, ingredient_id in PROTEIN_KEYWORDS:
        if keyword in text:
            return ingredient_id
    return None


def _extract_addons(text):
    extras = []
    remaining = text
    for keyword, ingredient_id in sorted(ADDON_KEYWORDS, key=lambda row: -len(row[0])):
        if keyword in remaining:
            item = _get_ingredient(ingredient_id)
            if item:
                extras.append(_ingredient_row(item, note=f"เพิ่มจากคำว่า '{keyword}'"))
            remaining = remaining.replace(keyword, " ")
    return re.sub(r"\s+", " ", remaining).strip(), extras


def _match_template(text):
    if _is_yum_salad_dish(text):
        return DISH_TEMPLATES["yum_salad"]
    for template in DISH_TEMPLATES.values():
        if any(trigger in text for trigger in template["triggers"]):
            return template
    return None


def _compose_from_template(text, template):
    rows = []
    protein_id = _detect_protein(text) or template.get("default_protein")
    for component_id in template["components"]:
        item = _get_ingredient(component_id)
        if item:
            rows.append(_ingredient_row(item))
    if template.get("protein_slot") and protein_id:
        protein = _get_ingredient(protein_id)
        if protein:
            rows.append(_ingredient_row(protein))
    return rows


def _match_ingredients_in_text(text):
    norm = _normalize(text)
    if not norm:
        return []

    matched_ids = set()
    rows = []
    for entry in _ALIAS_INDEX:
        alias_norm = entry["alias_norm"]
        if len(alias_norm) < 2:
            continue
        if alias_norm in norm and entry["item"]["id"] not in matched_ids:
            matched_ids.add(entry["item"]["id"])
            rows.append(_ingredient_row(entry["item"]))
    return rows


def _llm_parse_food(name):
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        return None

    base_url = os.environ.get("LLM_API_BASE", "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("LLM_MODEL", "gpt-4o-mini")

    system_prompt = (
        "You parse Thai food names into ingredient lists with estimated grams. "
        "Return ONLY valid JSON with keys: dish_label (string), ingredients (array of "
        "{name, grams, servingLabel}). Use Thai ingredient names."
    )
    user_prompt = f'Parse this Thai dish: "{name}"'

    payload = json.dumps(
        {
            "model": model,
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{base_url}/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            body = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError):
        return None

    try:
        content = body["choices"][0]["message"]["content"]
        parsed = json.loads(content)
    except (KeyError, IndexError, json.JSONDecodeError):
        return None

    llm_rows = []
    for item in parsed.get("ingredients") or []:
        ing_name = str(item.get("name") or "").strip()
        if not ing_name:
            continue
        kb_match = match_thai_food(ing_name)
        if kb_match and kb_match["score"] >= 0.72:
            food = kb_match["item"]
            llm_rows.append(
                _ingredient_row(
                    {
                        "id": food.get("names", [ing_name])[0],
                        "names": [ing_name],
                        "servingLabel": item.get("servingLabel") or "1 ที่",
                        "grams": item.get("grams") or 100,
                        "calories": food.get("calories", 0),
                        "protein": food.get("protein", 0),
                        "carbs": food.get("carbs", 0),
                        "fat": food.get("fat", 0),
                    },
                    note="LLM + อ้างอิงเมนูไทย",
                )
            )
            continue

        kb_ing = None
        norm = _normalize(ing_name)
        for entry in _ALIAS_INDEX:
            if entry["alias_norm"] == norm or entry["alias_norm"] in norm or norm in entry["alias_norm"]:
                kb_ing = entry["item"]
                break
        if kb_ing:
            llm_rows.append(_ingredient_row(kb_ing, note="LLM + คลังวัตถุดิบ"))
            continue

        grams = float(item.get("grams") or 100)
        llm_rows.append(
            {
                "id": ing_name,
                "name": ing_name,
                "servingLabel": item.get("servingLabel") or f"{int(grams)}g",
                "grams": grams,
                "calories": round(grams * 1.2),
                "protein": round(grams * 0.08, 1),
                "carbs": round(grams * 0.12, 1),
                "fat": round(grams * 0.04, 1),
                "note": "LLM ประมาณ",
            }
        )

    if len(llm_rows) < 2:
        return None

    return {
        "method": "llm",
        "dishLabel": parsed.get("dish_label") or name,
        "ingredients": llm_rows,
        "confidence": 0.82,
    }


def parse_food_text(name):
    clean_name = re.sub(r"\s+", " ", str(name or "").strip())
    if not clean_name:
        return None

    llm_result = _llm_parse_food(clean_name)
    if llm_result:
        return llm_result

    _load_ingredients()
    norm = _normalize(clean_name)
    base_text, addon_rows = _extract_addons(norm)

    thai_match = match_thai_food(base_text or clean_name)
    template = None
    rows = []

    if thai_match and thai_match["score"] >= 0.72:
        food = thai_match["item"]
        rows.append(
            {
                "id": thai_match["matchedAlias"],
                "name": thai_match["matchedAlias"],
                "servingLabel": "1 จาน",
                "grams": food.get("defaultServingGrams", 250),
                "calories": food.get("calories", 0),
                "protein": food.get("protein", 0),
                "carbs": food.get("carbs", 0),
                "fat": food.get("fat", 0),
                "note": "ฐานเมนูไทย",
            }
        )
    else:
        template = _match_template(base_text or norm)
        if template:
            rows = _compose_from_template(base_text or norm, template)
        else:
            rows = _match_ingredients_in_text(base_text or norm)

    rows.extend(addon_rows)

    if len(rows) < 2:
        return None

    confidence = 0.75 if thai_match else (0.62 if template else 0.55)
    if addon_rows:
        confidence += 0.05

    return {
        "method": "nlp",
        "dishLabel": clean_name,
        "ingredients": rows,
        "confidence": min(confidence, 0.9),
    }


def estimate_from_text_parsing(name):
    parsed = parse_food_text(name)
    if not parsed or parsed["confidence"] < 0.55:
        return None

    nutrition = _sum_nutrition(parsed["ingredients"])
    source = "llm_parse" if parsed["method"] == "llm" else "nlp_parse"
    ingredient_labels = ", ".join(row["name"] for row in parsed["ingredients"][:5])

    return {
        "name": name,
        **nutrition,
        "estimated": True,
        "estimateSource": source,
        "matchedReference": f"แกะจาก: {ingredient_labels}",
        "parsedIngredients": parsed["ingredients"],
        "parseMethod": parsed["method"],
        "dishLabel": parsed.get("dishLabel") or name,
    }
