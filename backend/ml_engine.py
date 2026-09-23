"""Train and serve Random Forest, SVM, and Gradient Boosting for meal suitability."""
from __future__ import annotations

import json
import os
from typing import Any

import joblib
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

FEATURE_NAMES = ["calories", "protein", "carbs", "fat", "remaining_cal"]
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
MODEL_FILES = {
    "rf": "random_forest_model.pkl",
    "svm": "svm_model.pkl",
    "gb": "gradient_boosting_model.pkl",
}
METRICS_FILE = "metrics.json"

_CACHE: dict[str, Any] | None = None


def label_suitable(calories: float, protein: float, carbs: float, fat: float, remaining_cal: float) -> int:
    remaining = max(float(remaining_cal), 1.0)
    cal = float(calories)
    protein = float(protein)
    carbs = float(carbs)
    fat = float(fat)
    fat_ratio = (fat * 9) / cal if cal > 0 else 0

    if remaining <= 80:
        return int(cal <= 280 and fat_ratio <= 0.42)
    if cal > remaining * 1.12 or cal > 720:
        return 0
    if fat_ratio > 0.45:
        return 0
    if carbs > 88:
        return 0
    if cal >= 220 and protein < 8:
        return 0
    return 1


def generate_training_set(n_samples: int = 2800, seed: int = 42) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    remaining = rng.integers(180, 2800, size=n_samples).astype(float)
    calories = rng.integers(80, 780, size=n_samples).astype(float)
    protein = np.clip(calories * rng.uniform(0.02, 0.12, size=n_samples) / 4, 2, 55)
    carbs = np.clip(calories * rng.uniform(0.18, 0.62, size=n_samples) / 4, 4, 120)
    fat = np.clip(calories * rng.uniform(0.12, 0.48, size=n_samples) / 9, 2, 48)
    X = np.column_stack([calories, protein, carbs, fat, remaining])
    y = np.array(
        [label_suitable(*row) for row in X],
        dtype=int,
    )
    return X, y


def _build_models() -> dict[str, Any]:
    return {
        "rf": RandomForestClassifier(
            n_estimators=160,
            max_depth=10,
            min_samples_leaf=4,
            random_state=42,
        ),
        "svm": Pipeline(
            [
                ("scaler", StandardScaler()),
                (
                    "clf",
                    SVC(kernel="rbf", C=1.6, gamma="scale", probability=True, random_state=42),
                ),
            ]
        ),
        "gb": GradientBoostingClassifier(
            n_estimators=120,
            learning_rate=0.08,
            max_depth=3,
            random_state=42,
        ),
    }


def train_and_save(model_dir: str = MODEL_DIR) -> dict[str, float]:
    os.makedirs(model_dir, exist_ok=True)
    X, y = generate_training_set()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    models = _build_models()
    metrics: dict[str, float] = {}
    for key, model in models.items():
        model.fit(X_train, y_train)
        pred = model.predict(X_test)
        metrics[key] = float(accuracy_score(y_test, pred))
        joblib.dump(model, os.path.join(model_dir, MODEL_FILES[key]))
    with open(os.path.join(model_dir, METRICS_FILE), "w", encoding="utf-8") as handle:
        json.dump({"accuracy": metrics, "features": FEATURE_NAMES}, handle, indent=2)
    return metrics


def _all_model_paths(model_dir: str = MODEL_DIR) -> list[str]:
    return [os.path.join(model_dir, filename) for filename in MODEL_FILES.values()]


def load_models(model_dir: str = MODEL_DIR, train_if_missing: bool = True) -> dict[str, Any]:
    global _CACHE
    if _CACHE is not None:
        return _CACHE

    missing = [path for path in _all_model_paths(model_dir) if not os.path.exists(path)]
    if missing and train_if_missing:
        train_and_save(model_dir)

    loaded: dict[str, Any] = {}
    for key, filename in MODEL_FILES.items():
        path = os.path.join(model_dir, filename)
        if os.path.exists(path):
            loaded[key] = joblib.load(path)
    _CACHE = loaded
    return loaded


def _as_vector(payload: dict[str, Any]) -> np.ndarray:
    return np.array(
        [[
            float(payload.get("calories") or 0),
            float(payload.get("protein") or 0),
            float(payload.get("carbs") or 0),
            float(payload.get("fat") or 0),
            float(payload.get("remainingCal") or payload.get("remaining_cal") or 0),
        ]],
        dtype=float,
    )


def _model_classes(model: Any) -> list:
    if hasattr(model, "named_steps") and "clf" in model.named_steps:
        return list(model.named_steps["clf"].classes_)
    return list(getattr(model, "classes_", [0, 1]))


def _predict_one(model: Any, vector: np.ndarray) -> tuple[int, float]:
    label = int(model.predict(vector)[0])
    confidence = 0.5
    if hasattr(model, "predict_proba"):
        try:
            proba = model.predict_proba(vector)[0]
            classes = _model_classes(model)
            idx = classes.index(label) if label in classes else int(np.argmax(proba))
            confidence = float(proba[idx])
        except Exception:
            confidence = 0.5
    return label, round(confidence, 3)


def analyze_meal(payload: dict[str, Any], models: dict[str, Any] | None = None) -> dict[str, Any]:
    models = models if models is not None else load_models()
    vector = _as_vector(payload)
    votes: dict[str, dict[str, Any]] = {}
    suitable_votes = 0
    for key in ("rf", "svm", "gb"):
        model = models.get(key)
        if model is None:
            votes[key] = {"available": False, "suitable": None, "confidence": None}
            continue
        label, confidence = _predict_one(model, vector)
        suitable = bool(label == 1)
        if suitable:
            suitable_votes += 1
        votes[key] = {
            "available": True,
            "suitable": suitable,
            "confidence": round(confidence, 3),
            "label": "เหมาะสม" if suitable else "ไม่เหมาะสม",
        }

    available = [item for item in votes.values() if item["available"]]
    ensemble_suitable = suitable_votes >= 2 if len(available) >= 2 else (
        available[0]["suitable"] if available else None
    )
    names = {
        "rf": "Random Forest",
        "svm": "Support Vector Machines",
        "gb": "Gradient Boosting",
    }
    return {
        "features": FEATURE_NAMES,
        "votes": votes,
        "modelNames": names,
        "suitableVotes": suitable_votes,
        "ensemble": {
            "suitable": ensemble_suitable,
            "label": "เหมาะสม" if ensemble_suitable else "ไม่เหมาะสม" if ensemble_suitable is False else "ยังไม่มีโมเดล",
            "agreeCount": suitable_votes,
            "modelCount": len(available),
        },
    }


def score_menus(menus: list[dict[str, Any]], remaining_cal: float, models: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    models = models if models is not None else load_models()
    results = []
    for menu in menus:
        payload = {
            "calories": menu.get("calories"),
            "protein": menu.get("protein"),
            "carbs": menu.get("carbs"),
            "fat": menu.get("fat"),
            "remainingCal": remaining_cal,
        }
        analysis = analyze_meal(payload, models)
        results.append(
            {
                "name": menu.get("name"),
                "ml": analysis,
            }
        )
    return results
