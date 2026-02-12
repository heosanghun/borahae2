"""
chat_soave.png에서 얼굴만 크롭하여 아바타용 이미지 생성
"""

from PIL import Image
import os

def crop_face_for_avatar(input_path, output_path, size=512):
    """
    전체 몸 이미지에서 얼굴 부분만 크롭하여 정사각형 아바타 생성
    """
    img = Image.open(input_path)
    
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    width, height = img.size
    
    # 얼굴은 보통 이미지 상단 10-25% 영역에 위치
    # 얼굴 중심을 원형 프레임 중앙에 오도록 크롭
    crop_size = min(width, height * 0.5)  # 얼굴+어깨 정도
    left = (width - crop_size) / 2
    top = height * 0.08  # 상단 8% 지점부터 (얼굴 중심)
    right = left + crop_size
    bottom = top + crop_size
    
    # 크롭
    cropped = img.crop((int(left), int(top), int(right), int(bottom)))
    
    # 정사각형으로 리사이즈
    cropped_resized = cropped.resize((size, size), Image.Resampling.LANCZOS)
    
    # 저장
    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    cropped_resized.save(output_path, format='PNG', optimize=True)
    print(f"[OK] 얼굴 크롭 완료: {output_path} ({size}x{size})")
    return cropped_resized

def main():
    input_path = r'd:\AI\borahae\image\chat_soave.png'
    output_dir = r'd:\AI\borahae\SIMS_Fashion\image\soave'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 얼굴만 크롭한 아바타 생성
    crop_face_for_avatar(input_path, os.path.join(output_dir, 'chat-soave-face.png'), size=512)
    
    print("\n완료! 얼굴만 크롭된 아바타 이미지가 생성되었습니다.")
    print(f"저장 위치: {output_dir}")

if __name__ == '__main__':
    main()
