import numpy as np
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

def load_landmark_data(filename):
    """랜드마크 JSON 데이터 로드"""
    with open(filename, "r") as f:
        dataset = json.load(f)

    X = []
    y = []
    for data in dataset:
        # 랜드마크와 EAR 값을 포함하여 입력 데이터 구성
        flattened_landmarks = np.array(data["landmarks"]).flatten()
        ear = np.array([data["ear"]])  # EAR 값을 추가
        X.append(np.concatenate((flattened_landmarks, ear)))  # 랜드마크 + EAR
        y.append(data["label"])
    return np.array(X), np.array(y)

def train_model():
    """머신러닝 모델 학습"""
    X, y = load_landmark_data("data/normalized_landmarks_dataset.json")

    # 데이터 분할
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 모델 학습
    model = RandomForestClassifier(n_estimators=10000, random_state=42)
    model.fit(X_train, y_train)

    # 테스트 및 성능 출력
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"모델 정확도: {accuracy:.2f}")

    # 모델 저장
    joblib.dump(model, "data/focus_model.pkl")
    print("모델이 data/focus_model.pkl에 저장되었습니다.")

if __name__ == "__main__":
    train_model()

