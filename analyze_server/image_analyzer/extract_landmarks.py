import cv2
import dlib
import json
import os
from EAR import calculate_ear

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("data/shape_predictor_68_face_landmarks.dat")  # dlib 모델 로드

def extract_landmarks(image_path):
    """이미지에서 랜드마크 추출 및 EAR 계산"""
    image = cv2.imread(image_path)
    if image is None:
        print(f"이미지를 로드할 수 없습니다: {image_path}")
        return None, None

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    if len(faces) == 0:
        print(f"얼굴을 감지할 수 없습니다: {image_path}")
        return None, None

    face = faces[0]
    landmarks = predictor(gray, face)
    points = [(landmarks.part(n).x, landmarks.part(n).y) for n in range(68)]

    # EAR 계산
    ear = calculate_ear(points)
    return points, ear

def save_landmarks(image_folder, output_file="data/landmarks_dataset.json"):
    """이미지 폴더에서 랜드마크와 EAR 추출 및 저장"""
    dataset = []
    for filename in os.listdir(image_folder):
        if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
            image_path = os.path.join(image_folder, filename)
            landmarks, ear = extract_landmarks(image_path)
            if landmarks:
                # 파일 이름에 따라 라벨 자동 설정
                if filename.lower().startswith("focus"):
                    label = 0  # 집중
                elif filename.lower().startswith("sleep"):
                    label = 1  # 졸음
                else:
                    print(f"알 수 없는 파일명 형식: {filename}. 라벨을 건너뜁니다.")
                    continue

                dataset.append({"image": filename, "landmarks": landmarks, "ear": ear, "label": label})
                print(f"{filename}: 라벨={label}, EAR={ear:.2f}로 추가되었습니다.")

    with open(output_file, "w") as f:
        json.dump(dataset, f, indent=4)
    print(f"데이터가 {output_file}에 저장되었습니다.")

if __name__ == "__main__":
    save_landmarks("images")  # 이미지 폴더 경로를 지정