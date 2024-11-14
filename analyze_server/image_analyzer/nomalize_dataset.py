import json

def normalize_landmarks(landmarks, width, height):
    """랜드마크 좌표를 정규화"""
    return [[x / width, y / height] for x, y in landmarks]

def normalize_dataset(input_path, output_path, width, height):
    """데이터셋의 랜드마크와 EAR 값을 정규화."""
    with open(input_path, "r") as f:
        dataset = json.load(f)

    for data in dataset:
        data["landmarks"] = normalize_landmarks(data["landmarks"], width, height)
        # EAR 값을 정규화 (0에서 1 사이로)
        data["ear"] = data["ear"] / height

    with open(output_path, "w") as f:
        json.dump(dataset, f, indent=4)
    print(f"정규화된 데이터가 {output_path}에 저장되었습니다.")

# 사용 예시
input_path = "data/augmented_landmarks_dataset.json"  # 기존 학습 데이터 경로
output_path = "data/normalized_landmarks_dataset.json"  # 정규화된 데이터 경로
image_width, image_height = 1080, 1920  # 학습 데이터 해상도
normalize_dataset(input_path, output_path, image_width, image_height)
