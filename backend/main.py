from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
import os
from db_config import get_cors_origins, get_db_settings
from food_estimator import estimate_food_from_name
from thai_food_matcher import search_thai_foods
from activity_catalog import search_activities_local

app = FastAPI()

# --- CORS (ตั้ง FRONTEND_URL บน production เช่น https://nutriai.vercel.app) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 🧠 Load Machine Learning Models (lazy — ไม่บล็อก login/register) ---
loaded_models = None
_models_load_attempted = False

def get_loaded_models():
    global loaded_models, _models_load_attempted
    if _models_load_attempted:
        return loaded_models or {}

    _models_load_attempted = True
    loaded_models = {}
    model_names = {
        "rf": "random_forest_model.pkl",
        "svm": "svm_model.pkl",
        "gb": "gradient_boosting_model.pkl",
    }

    if not os.path.exists("models"):
        os.makedirs("models")

    try:
        import joblib
    except Exception as e:
        print(f"⚠️ ML libraries unavailable: {e}")
        return loaded_models

    for key, filename in model_names.items():
        path = f"models/{filename}"
        if os.path.exists(path):
            try:
                loaded_models[key] = joblib.load(path)
                print(f"✅ Model {key.upper()} Loaded")
            except Exception as e:
                print(f"❌ Error loading {filename}: {e}")
        else:
            print(f"⚠️ Warning: {filename} not found")

    return loaded_models

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

# --- 4. AI Analysis System ---
@app.post("/analyze-meal")
async def analyze_meal(data: dict):
    food = data.get('food') 
    if not food:
        raise HTTPException(status_code=400, detail="No food data")

    # ดึงค่าสารอาหารจากข้อมูลที่เลือก
    calories = float(food.get('calories', 0))
    carbs = float(food.get('carbs', 0)) # คอลัมน์ carbs (มี s)
    
    # 🤖 AI Prediction (Random Forest)
    model = get_loaded_models().get("rf")
    prediction_status = "Suitable"
    
    if model:
        try:
            import pandas as pd
            # สมมติค่า GI Index เพื่อใช้กับ Model
            input_df = pd.DataFrame([[calories, carbs, 50]], 
                                    columns=['calories', 'carbs', 'gi_index'])
            pred = model.predict(input_df)[0]
            prediction_status = "Suitable" if pred == 1 else "Unsuitable"
        except Exception:
            prediction_status = "Analyzed by Logic"

    # 💡 คำแนะนำ AI เชิงรุก
    recommendations = []
    if carbs > 60:
        recommendations.append("🍚 คาร์โบไฮเดรตสูง: แนะนำให้ลดปริมาณแป้งในมื้อนี้ลง")
    if calories > 500:
        recommendations.append("🔥 พลังงานมื้อเดียวค่อนข้างสูง: แนะนำให้เพิ่มการเดินย่อย")
    
    if not recommendations:
        recommendations.append("✅ เมนูนี้มีโภชนาการที่เหมาะสม")

    return {
        "status": prediction_status,
        "ai_advice": recommendations,
        "details": food
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