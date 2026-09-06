import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# 1. สร้างข้อมูลจำลอง (ในอนาคตคุณจะดึงจาก MySQL หรือ CSV)
data = {
    'calories': np.random.randint(100, 800, 100),
    'carbs': np.random.randint(10, 100, 100),
    'gi_index': np.random.randint(30, 90, 100),
    'suitable': np.random.choice([0, 1], 100) # 1 คือเหมาะสม, 0 คือไม่เหมาะ
}
df = pd.DataFrame(data)

X = df[['calories', 'carbs', 'gi_index']]
y = df['suitable']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 2. เปรียบเทียบ 3 Model ตามวัตถุประสงค์โครงการ
models = {
    "Random Forest": RandomForestClassifier(),
    "SVM": SVC(probability=True),
    "Gradient Boosting": GradientBoostingClassifier()
}

print("--- ผลการทดสอบโมเดล ---")
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"{name} Accuracy: {acc:.2f}")
    
    # 3. เซฟโมเดลเก็บไว้ในโฟลเดอร์ models/
    filename = f"models/{name.lower().replace(' ', '_')}_model.pkl"
    joblib.dump(model, filename)

print("\nบันทึกไฟล์โมเดลทั้งหมดลงในโฟลเดอร์ models/ เรียบร้อยแล้ว!")