import numpy as np
import json

def augment_landmarks(landmarks, max_shift=5):
    """랜드마크 데이터에 노이즈 추가"""
    noise = np.random.randint(-max_shift, max_shift, np.array(landmarks).shape)
    augmented = np.clip(np.array(landmarks) + noise, 0, 640)  # 값 제한
    return augmented.tolist()

def augment_ear(ear, max_shift=0.1):
    """EAR 데이터에 노이즈 추가"""
    noise = np.random.uniform(-max_shift, max_shift)
    augmented = max(0, min(ear + noise, 1))  # EAR 값은 0과 1 사이로 제한
    return augmented

# JSON 파일 경로 설정
json_file_path = "data/landmarks_dataset.json"
augmented_file_path = "data/augmented_landmarks_dataset.json"

# JSON 데이터 로드
try:
    with open(json_file_path, "r") as f:
        dataset = json.load(f)
        print(f"데이터 로드 성공! 데이터 개수: {len(dataset)}")
except FileNotFoundError:
    print(f"파일을 찾을 수 없습니다: {json_file_path}")
    dataset = []
except json.JSONDecodeError as e:
    print(f"JSON 파일 파싱 오류: {e}")
    dataset = []

# 데이터 증강
if dataset:
    augmented_dataset = []
    for data in dataset:
        augmented_dataset.append(data)  # 원본 데이터 추가
        for _ in range(10):  # 각 데이터 10배 증강
            augmented_data = {
                "image": data["image"],
                "landmarks": augment_landmarks(data["landmarks"]),
                "ear": augment_ear(data.get("ear", 0.5)),  # EAR 추가, 기본값 0.5
                "label": data["label"]
            }
            augmented_dataset.append(augmented_data)

    # 증강된 데이터 저장
    with open(augmented_file_path, "w") as f:
        json.dump(augmented_dataset, f, indent=4)
    print(f"데이터 증강 완료! 총 데이터 개수: {len(augmented_dataset)}")
else:
    print("데이터셋이 비어 있어 증강을 수행할 수 없습니다.")

