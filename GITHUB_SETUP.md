# GitHub 푸시 설정 가이드

## Personal Access Token 생성 방법

1. GitHub에 로그인 후: https://github.com/settings/tokens
2. "Generate new token" → "Generate new token (classic)" 클릭
3. Token 이름 입력 (예: "SIMS_Fashion_Access")
4. 권한 선택:
   - ✅ `repo` (전체 체크)
5. "Generate token" 클릭
6. **토큰을 복사해 안전한 곳에 보관** (한 번만 표시됩니다!)

## 푸시 방법

### 방법 1: 명령어로 직접 푸시 (권장)

PowerShell에서 다음 명령어 실행:

```powershell
cd D:\simsfashion
git push -u origin main
```

사용자 이름: `heosanghun`
비밀번호: **생성한 Personal Access Token 입력**

### 방법 2: Git Credential Manager 사용

```powershell
cd D:\simsfashion
git config --global credential.helper manager-core
git push -u origin main
```

첫 푸시 시 토큰을 입력하면 이후 자동으로 저장됩니다.

### 방법 3: URL에 토큰 포함 (임시)

```powershell
cd D:\simsfashion
git remote set-url origin https://[YOUR_TOKEN]@github.com/heosanghun/SIMS_Fashion.git
git push -u origin main
```

⚠️ **보안 주의**: 이 방법은 명령어 히스토리에 토큰이 남을 수 있으므로 권장하지 않습니다.

## 자동 푸시 스크립트 (선택사항)

`push.ps1` 파일을 생성하여 사용할 수 있습니다:

```powershell
cd D:\simsfashion
git add .
git commit -m "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main
```

## 현재 상태

✅ Git 저장소 초기화 완료
✅ 원격 저장소 연결 완료 (https://github.com/heosanghun/SIMS_Fashion.git)
✅ 초기 커밋 완료
⏳ GitHub 인증 필요 (Personal Access Token)

## 다음 단계

1. Personal Access Token 생성
2. `git push -u origin main` 실행
3. 토큰 입력하여 푸시 완료
