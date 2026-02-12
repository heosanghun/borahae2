"""
파비콘에 보라색 그라데이션 배경 추가
기존 파비콘(흰색 배경)에 보라→핑크 그라데이션 배경을 추가합니다.
"""

from PIL import Image, ImageDraw
import os
import glob

def create_gradient_background(size, start_color, end_color):
    """보라→핑크 그라데이션 배경 생성"""
    img = Image.new('RGB', size)
    draw = ImageDraw.Draw(img)
    
    width, height = size
    for y in range(height):
        # y 위치에 따라 색상 보간
        ratio = y / height
        r = int(start_color[0] * (1 - ratio) + end_color[0] * ratio)
        g = int(start_color[1] * (1 - ratio) + end_color[1] * ratio)
        b = int(start_color[2] * (1 - ratio) + end_color[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def add_background_to_favicon(input_path, output_path):
    """파비콘에 배경 추가"""
    # 기존 파비콘 로드
    try:
        favicon = Image.open(input_path)
        # RGBA로 변환 (투명도 지원)
        if favicon.mode != 'RGBA':
            favicon = favicon.convert('RGBA')
    except Exception as e:
        print(f"파일 로드 실패 {input_path}: {e}")
        return False
    
    size = favicon.size
    
    # 보라→핑크 그라데이션 배경 생성
    # 보라색: #7c3aed (124, 58, 237), 핑크: #ec4899 (236, 72, 153)
    start_color = (124, 58, 237)  # 보라
    end_color = (236, 72, 153)    # 핑크
    background = create_gradient_background(size, start_color, end_color)
    
    # 배경 위에 파비콘 합성 (알파 채널 고려)
    result = Image.new('RGBA', size)
    result.paste(background, (0, 0))
    result = Image.alpha_composite(result, favicon)
    
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
    backup_dir = os.path.join(favicon_dir, 'backup_original')
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
    
    print("파비콘 배경 추가 시작...\n")
    
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
        
        # 배경 추가
        if add_background_to_favicon(input_path, input_path):
            success_count += 1
    
    # favicon.ico도 처리 (ICO는 복잡하므로 PNG로 변환 후 다시 ICO로)
    ico_path = os.path.join(favicon_dir, 'favicon.ico')
    if os.path.exists(ico_path):
        try:
            # 백업
            backup_ico = os.path.join(backup_dir, 'favicon.ico')
            import shutil
            shutil.copy2(ico_path, backup_ico)
            
            # 32x32 PNG로 변환 후 배경 추가
            ico_img = Image.open(ico_path)
            if ico_img.mode != 'RGBA':
                ico_img = ico_img.convert('RGBA')
            
            # 32x32 크기로 리사이즈 (ICO는 여러 크기 포함 가능)
            ico_img = ico_img.resize((32, 32), Image.Resampling.LANCZOS)
            
            # 배경 추가
            size = ico_img.size
            start_color = (124, 58, 237)
            end_color = (236, 72, 153)
            background = create_gradient_background(size, start_color, end_color)
            result = Image.new('RGBA', size)
            result.paste(background, (0, 0))
            result = Image.alpha_composite(result, ico_img)
            
            # ICO로 저장 (여러 크기 포함)
            result.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32)])
            print(f"[OK] 생성 완료: favicon.ico")
            success_count += 1
        except Exception as e:
            print(f"[FAIL] favicon.ico 처리 실패: {e}")
    
    print(f"\n완료: {success_count}개 파일 처리됨")
    print(f"원본 백업 위치: {backup_dir}")

if __name__ == '__main__':
    main()
