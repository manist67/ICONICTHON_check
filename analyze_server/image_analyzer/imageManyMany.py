import cv2
import dlib
import os
import numpy as np
import joblib
import sys
from EAR import calculate_ear
from collections import Counter
# dlib 모델 로드
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(os.path.dirname(os.path.realpath(__file__)) + "/data/shape_predictor_68_face_landmarks.dat")
model = joblib.load( os.path.dirname(os.path.realpath(__file__)) + "/data/focus_model.pkl")

def normalize_landmarks(landmarks, width, height):
    """랜드마크 좌표를 정규화"""
    return [(x / width, y / height) for x, y in landmarks]

def extract_landmarks_from_frame(frame):
    """프레임에서 랜드마크와 EAR 추출 및 정규화"""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    if len(faces) == 0:
        return None, None

    face = faces[0]
    landmarks = predictor(gray, face)
    points = [(landmarks.part(n).x, landmarks.part(n).y) for n in range(68)]

    height, width = frame.shape[:2]
    normalized_points = normalize_landmarks(points, width, height)
    ear = calculate_ear(points)
    return np.array(normalized_points).flatten(), ear

def process_images(id, image_paths):
    """이미지들을 처리하고 평균 상태 출력"""
    results = []

    for image_path in image_paths:
        frame = cv2.imread(image_path)
        if frame is None:
            sys.stderr.write(f"이미지를 로드할 수 없습니다: {image_path}")
            continue

        landmarks, ear = extract_landmarks_from_frame(frame)
        if landmarks is not None:
            input_features = np.append(landmarks, ear).reshape(1, -1)
            prediction = model.predict(input_features)
            results.append(prediction[0])
        else:
            sys.stderr.write(f"{image_path}:p얼굴감지실패\n")

    if results:
        most_common = Counter(results).most_common(1)[0][0]
        if most_common == 0:
            sys.stdout.write(f"{id}:focus\n")
        elif most_common == 1:
            sys.stdout.write(f"{id}:sleep\n")
        else:
            sys.stdout.write(f"{id}:unknown\n")
    else:
        sys.stdout.write(f"{id}:no_data\n")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="이미지 분석 프로그램")
    parser.add_argument("id", type=str, help="사용자 ID")
    parser.add_argument("images", type=str, nargs='+', help="분석할 이미지 파일 경로")
    args = parser.parse_args()

    process_images(args.id, args.images)
