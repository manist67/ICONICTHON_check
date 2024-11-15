import os
import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import tensorflow as tf

# 1. 사전 학습된 모델 및 클래스 레이블 로드
MODEL_PATH = os.path.dirname(os.path.realpath(__file__)) + '/models/model_1.h5'  # 학습된 모델 경로
model = load_model(MODEL_PATH, compile=False)
class_labels = ["ys"]  # 특정 화자 레이블만 포함

# 2. 스펙트로그램 생성 함수
def create_spectrogram(wav_path, img_path, img_size=(128, 128)):
    y, sr = librosa.load(wav_path)
    D = librosa.stft(y)
    plt.figure(figsize=(img_size[0] / 100, img_size[1] / 100))
    librosa.display.specshow(librosa.amplitude_to_db(abs(D)), sr=sr, x_axis=None, y_axis=None)
    plt.axis('off')
    plt.savefig(img_path, bbox_inches='tight', pad_inches=0)
    plt.close()

# 3. 화자 예측 함수
def predict_speaker(img_path, img_size=(128, 128)):
    img = load_img(img_path, target_size=img_size)
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    prediction = model.predict(img_array)
    
    # `ys`가 아닌 예측은 모두 False로 처리
    is_ys = np.argmax(prediction, axis=1)[0] == 0  # 0번째 인덱스가 'ys'임을 의미
    return is_ys
    
# 4. 전체 API 함수
def analyze_speaker(input_wav_path):
    temp_img_path =  os.path.dirname(os.path.realpath(__file__)) + '/temp_spectrogram.png'
    filepath = os.path.join(os.path.dirname(os.path.realpath(__file__)) , input_wav_path)
    create_spectrogram(filepath, temp_img_path)
    result = predict_speaker(temp_img_path)
    os.remove(temp_img_path)  # 임시 파일 삭제
    return result

if __name__ == "__main__":
    import argparse
    import sys
    import tensorflow as tf
    tf.get_logger().setLevel('INFO')
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
    os.environ['HDF5_USE_FILE_LOCKING'] = 'FALSE'

    parser = argparse.ArgumentParser(description="화자 식별 프로그램")
    parser.add_argument("id", type=str, help="사용자ID")
    parser.add_argument("voice",type=str, help="분석할 음성 파일 경로")
    args = parser.parse_args()
    
    sys.stdout.write( "__true__" if analyze_speaker(args.voice) else "__false__" )
    