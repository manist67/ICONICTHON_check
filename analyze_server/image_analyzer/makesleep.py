import os

def rename_files(folder_path, prefix):
    """폴더 안의 파일 이름을 일괄적으로 변경"""
    try:
        files = os.listdir(folder_path)  # 폴더 안의 파일 리스트 가져오기
        files = [f for f in files if os.path.isfile(os.path.join(folder_path, f))]  # 파일만 필터링
        for i, filename in enumerate(files, start=27):
            # 기존 파일 경로와 확장자 추출
            old_path = os.path.join(folder_path, filename)
            file_extension = os.path.splitext(filename)[1]
            
            # 새 이름 생성
            new_name = f"{prefix}{i}{file_extension}"
            new_path = os.path.join(folder_path, new_name)
            
            # 파일 이름 변경
            os.rename(old_path, new_path)
            print(f"{filename} -> {new_name}")
        print("모든 파일 이름 변경 완료!")
    except Exception as e:
        print(f"오류 발생: {e}")

# 사용법
folder_path = "sleep"  # 변경할 폴더 경로
prefix = "sleep"  # 새로운 파일 이름의 접두사
rename_files(folder_path, prefix)
