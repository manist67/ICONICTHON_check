import numpy as np

def calculate_ear(landmarks):
    """눈 비율(EAR) 계산"""
    left_eye = landmarks[36:42]  # 왼쪽 눈 랜드마크
    right_eye = landmarks[42:48]  # 오른쪽 눈 랜드마크

    def eye_aspect_ratio(eye):
        A = np.linalg.norm(eye[1] - eye[5])  # 수직 거리 1
        B = np.linalg.norm(eye[2] - eye[4])  # 수직 거리 2
        C = np.linalg.norm(eye[0] - eye[3])  # 수평 거리
        return (A + B) / (2.0 * C)

    left_ear = eye_aspect_ratio(np.array(left_eye))
    right_ear = eye_aspect_ratio(np.array(right_eye))
    ear = (left_ear + right_ear) / 2.0
    
    # 얼굴 높이 계산
    nose_tip = landmarks[30]  # 코끝
    chin = landmarks[8]       # 턱 끝
    face_height = np.linalg.norm(np.array(nose_tip) - np.array(chin))

    # EAR 정규화
    normalized_ear = ear / face_height
    return normalized_ear

