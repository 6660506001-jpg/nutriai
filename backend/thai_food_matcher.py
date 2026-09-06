import json
import os
import re
from difflib import SequenceMatcher

_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "thai_foods.json")
_THAI_FOODS = None
_ALIAS_INDEX = []


def _normalize(text):
    return re.sub(r"\s+", " ", str(text or "").strip().lower())


def _load_foods():
    global _THAI_FOODS, _ALIAS_INDEX
    if _THAI_FOODS is not None:
        return
    with open(_DATA_PATH, "r", encoding="utf-8") as handle:
        _THAI_FOODS = json.load(handle)

    index = []
    for item in _THAI_FOODS:
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


_GENERIC_RICE_ALIASES = {"ข้าวเปล่า", "ข้าวสวย"}
_RICE_DISH_MARKERS = ("ยำ", "ผัด", "ราด", "มัน", "ซอย", "ต้ม", "หมก", "คลุก")


def _is_generic_rice_mismatch(norm, matched_alias, score):
    if matched_alias not in _GENERIC_RICE_ALIASES:
        return False
    if not any(marker in norm for marker in _RICE_DISH_MARKERS):
        return False
    return score < 0.95


def match_thai_food(name):
    _load_foods()
    clean = re.sub(r"\s+", " ", str(name or "").strip())
    norm = _normalize(clean)
    if not norm:
        return None

    best = None
    best_score = 0.0

    for row in _ALIAS_INDEX:
        alias_norm = row["alias_norm"]
        if alias_norm == norm:
            return {"item": row["item"], "score": 1.0, "matchedAlias": row["alias"]}

        if alias_norm in norm or norm in alias_norm:
            overlap = min(len(alias_norm), len(norm)) / max(len(alias_norm), len(norm))
            score = 0.82 + overlap * 0.18
            if score > best_score:
                best_score = score
                best = {"item": row["item"], "score": score, "matchedAlias": row["alias"]}
            continue

        ratio = SequenceMatcher(None, norm, alias_norm).ratio()
        if ratio > best_score:
            best_score = ratio
            best = {"item": row["item"], "score": ratio, "matchedAlias": row["alias"]}

    if best and best_score >= 0.72 and not _is_generic_rice_mismatch(norm, best["matchedAlias"], best_score):
        return best
    return None


def _thai_food_to_result(item, matched_alias):
    return {
        "name": matched_alias,
        "baseName": item["names"][0],
        "calories": item.get("calories"),
        "protein": item.get("protein"),
        "carbs": item.get("carbs"),
        "fat": item.get("fat"),
        "defaultServingGrams": item.get("defaultServingGrams"),
        "defaultServingLabel": item.get("defaultServingLabel"),
        "per100g": item.get("per100g"),
        "category": item.get("category"),
    }


def search_thai_foods(query, limit=12):
    _load_foods()
    norm = _normalize(query)
    if not norm:
        return []

    scored = []
    seen = set()

    for item in _THAI_FOODS:
        primary = item["names"][0]
        if primary in seen:
            continue

        best_alias = None
        best_score = 0.0
        for alias in item["names"]:
            alias_norm = _normalize(alias)
            if alias_norm == norm:
                best_alias = alias
                best_score = 1.0
                break
            if norm in alias_norm or alias_norm in norm:
                overlap = min(len(alias_norm), len(norm)) / max(len(alias_norm), len(norm))
                score = 0.82 + overlap * 0.18
            else:
                score = SequenceMatcher(None, norm, alias_norm).ratio()
            if score > best_score:
                best_score = score
                best_alias = alias

        if best_alias and best_score >= 0.55:
            seen.add(primary)
            scored.append((best_score, _thai_food_to_result(item, best_alias)))

    scored.sort(key=lambda row: row[0], reverse=True)
    return [row[1] for row in scored[:limit]]
