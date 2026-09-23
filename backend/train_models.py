"""Train Random Forest, SVM, and Gradient Boosting for NutriAI meal suitability."""
from ml_engine import train_and_save

if __name__ == "__main__":
    metrics = train_and_save()
    print("--- ผลการทดสอบโมเดล ---")
    names = {
        "rf": "Random Forest",
        "svm": "Support Vector Machines (SVM)",
        "gb": "Gradient Boosting",
    }
    for key, label in names.items():
        print(f"{label} Accuracy: {metrics.get(key, 0):.2f}")
    print("\nบันทึกไฟล์โมเดลทั้งหมดลงในโฟลเดอร์ models/ เรียบร้อยแล้ว")
