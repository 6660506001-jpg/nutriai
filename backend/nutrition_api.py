import json
import os
import urllib.parse
import urllib.request


def fetch_calorieninjas(name):
    api_key = os.environ.get("CALORIE_NINJAS_API_KEY", "").strip()
    if not api_key:
        return None

    queries = [
        f"1 plate {name}",
        f"1 serving {name}",
        name,
    ]

    for query in queries:
        encoded = urllib.parse.quote(query)
        url = f"https://api.calorieninjas.com/v1/nutrition?query={encoded}"
        request = urllib.request.Request(
            url,
            headers={"X-Api-Key": api_key, "Accept": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=8) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except Exception:
            continue

        items = payload.get("items") or []
        if not items:
            continue

        totals = {
            "calories": 0.0,
            "protein": 0.0,
            "carbs": 0.0,
            "fat": 0.0,
        }
        for item in items:
            totals["calories"] += float(item.get("calories") or 0)
            totals["protein"] += float(item.get("protein_g") or 0)
            totals["carbs"] += float(item.get("carbohydrates_total_g") or 0)
            totals["fat"] += float(item.get("fat_total_g") or 0)

        if totals["calories"] <= 0:
            continue

        return {
            "calories": round(totals["calories"]),
            "protein": round(totals["protein"], 1),
            "carbs": round(totals["carbs"], 1),
            "fat": round(totals["fat"], 1),
            "estimateSource": "calorieninjas",
            "matchedQuery": query,
        }

    return None
