"""
파비콘에 보라색 단색 배경 추가
기존 파비콘의 흰색 배경을 보라색으로 변경합니다.
로고가 투명 배경 PNG이면 보라색 배경을 추가하고,
흰색 배경이면 흰색을 투명하게 처리한 후 보라색 배경을 추가합니다.
"""

from PIL import Image
import os
import numpy as np

def add_purple_background(input_path, output_path, purple_color=(124, 58, 237)):
    """
    파비콘에 보라색 단색 배경 추가
    
    Args:
        input_path: 입력 이미지 경로
        output_path: 출력 이미지 경로
        purple_color: 보라색 RGB 값 (기본: #7c3aed)
    """
    try:
        favicon = Image.open(input_path)
        # RGBA로 변환
        if favicon.mode != 'RGBA':
            favicon = favicon.convert('RGBA')
    except Exception as e:
        print(f"[FAIL] 파일 로드 실패 {input_path}: {e}")
        return False
    
    size = favicon.size
    width, height = size
    
    # 보라색 배경 생성
    background = Image.new('RGBA', size, purple_color + (255,))
    
    # 이미지 데이터를 numpy 배열로 변환 (흰색 배경 처리용)
    img_array = np.array(favicon)
    
    # 흰색 배경을 투명하게 처리 (RGB가 모두 240 이상인 픽셀)
    # 또는 이미 투명한 부분은 유지
    alpha = img_array[:, :, 3]  # 알파 채널
    rgb = img_array[:, :, :3]   # RGB 채널
    
    # 흰색에 가까운 픽셀 찾기 (RGB 평균이 240 이상)
    white_mask = np.mean(rgb, axis=2) > 240
    
    # 알파 채널 업데이트: 흰색 부분을 투명하게
    alpha[white_mask] = 0
    
    # 업데이트된 알파 채널 적용
    img_array[:, :, 3] = alpha
    favicon_processed = Image.fromarray(img_array)
    
    # 보라색 배경 위에 파비콘 합성
    result = Image.new('RGBA', size)
    result.paste(background, (0, 0))
    result = Image.alpha_composite(result, favicon_processed)
    
    # 저장
    try:
        result.save(output_path, format='PNG', optimize=True)
        print(f"[OK] 생성 완료: {output_path} ({size[0]}x{size[1]})")
        return True
    except Exception as e:
        print(f"[FAIL] 저장 실패 {output_path}: {e}")
        return False

def main():
    favicon_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'image', 'favicon')
    
    # 백업 디렉토리 생성
    backup_dir = os.path.join(favicon_dir, 'backup_before_purple')
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"백업 디렉토리 생성: {backup_dir}")
    
    # PNG 파비콘 파일 목록
    png_files = [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon-96x96.png',
        'apple-icon-57x57.png',
        'apple-icon-60x60.png',
        'apple-icon-72x72.png',
        'apple-icon-76x76.png',
        'apple-icon-114x114.png',
        'apple-icon-120x120.png',
        'apple-icon-144x144.png',
        'apple-icon-152x152.png',
        'apple-icon-180x180.png',
        'apple-icon.png',
        'apple-icon-precomposed.png',
        'android-icon-36x36.png',
        'android-icon-48x48.png',
        'android-icon-72x72.png',
        'android-icon-96x96.png',
        'android-icon-144x144.png',
        'android-icon-192x192.png',
        'ms-icon-70x70.png',
        'ms-icon-144x144.png',
        'ms-icon-150x150.png',
        'ms-icon-310x310.png'
    ]
    
    print("파비콘 보라색 배경 추가 시작...\n")
    
    success_count = 0
    for filename in png_files:
        input_path = os.path.join(favicon_dir, filename)
        if not os.path.exists(input_path):
            print(f"[SKIP] 파일 없음: {filename}")
            continue
        
        # 백업
        backup_path = os.path.join(backup_dir, filename)
        try:
            import shutil
            shutil.copy2(input_path, backup_path)
        except Exception as e:
            print(f"[WARN] 백업 실패 {filename}: {e}")
        
        # 보라색 배경 추가
        if add_purple_background(input_path, input_path):
            success_count += 1
    
    # favicon.ico도 처리
    ico_path = os.path.join(favicon_dir, 'favicon.ico')
    if os.path.exists(ico_path):
        try:
            # 백업
            backup_ico = os.path.join(backup_dir, 'favicon.ico')
            import shutil
            shutil.copy2(ico_path, backup_ico)
            
            # 32x32 PNG로 변환 후 보라색 배경 추가
            ico_img = Image.open(ico_path)
            if ico_img.mode != 'RGBA':
                ico_img = ico_img.convert('RGBA')
            
            # 32x32 크기로 리사이즈
            ico_img = ico_img.resize((32, 32), Image.Resampling.LANCZOS)
            
            # 보라색 배경 추가
            size = ico_img.size
            background = Image.new('RGBA', size, (124, 58, 237, 255))
            
            # 흰색 배경 처리
            img_array = np.array(ico_img)
            alpha = img_array[:, :, 3]
            rgb = img_array[:, :, :3]
            white_mask = np.mean(rgb, axis=2) > 240
            alpha[white_mask] = 0
            img_array[:, :, 3] = alpha
            ico_processed = Image.fromarray(img_array)
            
            result = Image.new('RGBA', size)
            result.paste(background, (0, 0))
            result = Image.alpha_composite(result, ico_processed)
            
            # ICO로 저장
            result.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32)])
            print(f"[OK] 생성 완료: favicon.ico")
            success_count += 1
        except Exception as e:
            print(f"[FAIL] favicon.ico 처리 실패: {e}")
    
    print(f"\n완료: {success_count}개 파일 처리됨")
    print(f"원본 백업 위치: {backup_dir}")

if __name__ == '__main__':
    main()
