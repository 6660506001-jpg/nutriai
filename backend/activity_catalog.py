"""กิจกรรมสำรองเมื่อ API / DB ไม่พร้อม — calories = ประมาณ 30 นาที ระดับปานกลาง (70 kg)"""

FALLBACK_ACTIVITIES = [
    {"id": "run", "name": "วิ่ง", "calories": 300},
    {"id": "walk", "name": "เดิน", "calories": 120},
    {"id": "walk-fast", "name": "เดินเร็ว", "calories": 180},
    {"id": "swim", "name": "ว่ายน้ำ", "calories": 260},
    {"id": "cycle", "name": "ปั่นจักรยาน", "calories": 220},
    {"id": "cycle-indoor", "name": "ปั่นจักรยานในร่ม", "calories": 200},
    {"id": "yoga", "name": "โยคะ", "calories": 100},
    {"id": "weight", "name": "ยกน้ำหนัก", "calories": 180},
    {"id": "aerobic", "name": "แอโรบิก", "calories": 240},
    {"id": "dance", "name": "เต้น", "calories": 210},
    {"id": "badminton", "name": "แบดมินตัน", "calories": 230},
    {"id": "football", "name": "ฟุตบอล", "calories": 280},
    {"id": "basketball", "name": "บาสเกตบอล", "calories": 270},
    {"id": "tennis", "name": "เทนนิส", "calories": 250},
    {"id": "hiking", "name": "เดินป่า", "calories": 200},
    {"id": "stairs", "name": "ขึ้นบันได", "calories": 220},
    {"id": "housework", "name": "ทำงานบ้าน", "calories": 130},
    {"id": "stretch", "name": "ยืดเหยียด", "calories": 80},
    {"id": "sleep", "name": "นอน", "calories": 35},
    {"id": "sit-work", "name": "นั่งทำงาน", "calories": 45},
]


def search_activities_local(query, limit=12):
    term = str(query or "").strip().lower()
    if not term:
        return []
    return [
        item
        for item in FALLBACK_ACTIVITIES
        if term in str(item.get("name", "")).lower()
    ][:limit]
