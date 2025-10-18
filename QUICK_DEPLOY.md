# ⚡ GitHub Pages 빠른 배포 가이드

## 5분 안에 배포하기

### 전제 조건
- GitHub 계정 보유
- Git 설치 완료
- 프로젝트가 로컬에 있음

---

## 단계 1: GitHub Repository 생성 (1분)

### 1-1. GitHub에서 새 저장소 생성
```
https://github.com/new
```

- **Repository name**: `wedding-invitation` (또는 원하는 이름)
- **Visibility**: Public 선택 (무료 GitHub Pages)
- **Initialize repository**: 체크 해제 (이미 로컬에 코드 있음)
- **Create repository** 클릭

### 1-2. 로컬 Git 초기화 및 푸시

```bash
cd /Users/changbum/workplace/wedding_invitation

# Git 초기화 (아직 안 했다면)
git init

# 원격 저장소 연결 (본인의 GitHub 계정명으로 변경!)
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git

# 변경사항 커밋
git add .
git commit -m "Initial commit: Wedding invitation site"

# main 브랜치로 푸시
git branch -M main
git push -u origin main
```

---

## 단계 2: GitHub Pages 활성화 (1분)

### 2-1. Settings 접속
```
Repository → Settings → Pages
```

### 2-2. Source 설정
**Build and deployment** 섹션에서:
- **Source**: `GitHub Actions` 선택

![Source Selection](https://i.imgur.com/example.png)

> 중요: "Deploy from a branch" 가 아닌 **"GitHub Actions"** 선택!

---

## 단계 3: 자동 배포 시작 (2분)

### 3-1. Actions 탭 확인
```
Repository → Actions → Deploy to GitHub Pages
```

워크플로우가 자동으로 실행됩니다:
```
✓ build (ubuntu-latest) - 약 1분
✓ deploy (ubuntu-latest) - 약 30초
```

### 3-2. 배포 URL 확인

배포 완료 후 Settings → Pages에서 URL 확인:
```
🟢 Your site is live at https://YOUR_USERNAME.github.io/wedding-invitation/
```

---

## 단계 4: 사이트 확인 (1분)

### 4-1. 브라우저로 접속
```
https://YOUR_USERNAME.github.io/wedding-invitation/
```

### 4-2. 모바일에서 테스트
- QR 코드 생성: https://www.qr-code-generator.com/
- 모바일 브라우저로 스캔 후 확인

---

## 완료! 🎉

이제 다음이 자동으로 작동합니다:
- ✅ main 브랜치에 push할 때마다 자동 배포
- ✅ HTML/CSS/JS 자동 압축
- ✅ 이미지 최적화
- ✅ HTTPS 자동 적용

---

## 다음 단계

### 커스텀 도메인 연결 (선택)
상세 가이드: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md#커스텀-도메인-설정)

### 코드 수정 및 재배포
```bash
# 1. 파일 수정
vim index.html

# 2. 로컬 테스트
./build.sh
npm run preview

# 3. 커밋 및 푸시
git add .
git commit -m "Update: 내용 수정"
git push

# 4. 자동 배포 (2-3분 소요)
# Actions 탭에서 진행 상황 확인
```

---

## 문제 해결

### 배포 실패 시
1. Actions 탭에서 에러 로그 확인
2. [트러블슈팅 가이드](docs/DEPLOYMENT_GUIDE.md#트러블슈팅) 참고

### 404 에러 발생 시
```bash
# Settings → Pages에서 Source가 "GitHub Actions"인지 확인
# 브라우저 캐시 삭제: Ctrl + Shift + R
```

### CSS/이미지 안 보임
```bash
# vite.config.js의 base 경로 확인
base: './'  # 상대 경로 사용 (권장)
```

---

## 추가 리소스

- 📖 [상세 배포 가이드](docs/DEPLOYMENT_GUIDE.md)
- 🛠️ [GitHub Actions 워크플로우](.github/workflows/deploy.yml)
- 💡 [Vite 설정](vite.config.js)

**Happy Deploying! 💒**
