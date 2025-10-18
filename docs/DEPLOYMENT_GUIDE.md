# 🚀 GitHub Pages 배포 가이드

## 목차
1. [사전 준비](#사전-준비)
2. [GitHub Repository 설정](#github-repository-설정)
3. [GitHub Pages 활성화](#github-pages-활성화)
4. [자동 배포 확인](#자동-배포-확인)
5. [커스텀 도메인 설정](#커스텀-도메인-설정)
6. [최적화 전략](#최적화-전략)
7. [트러블슈팅](#트러블슈팅)

---

## 사전 준비

### 필요한 것들
- ✅ GitHub 계정
- ✅ Git 설치
- ✅ 로컬에 프로젝트 클론

### 로컬 빌드 테스트
배포 전에 반드시 로컬에서 빌드를 테스트하세요:

```bash
# 빌드 스크립트 실행
./build.sh

# 로컬 서버로 확인
npx serve dist
# 또는
python3 -m http.server --directory dist 8000

# 브라우저에서 http://localhost:8000 접속
```

---

## GitHub Repository 설정

### 1. 로컬 Git 초기화 (아직 안 했다면)

```bash
cd /Users/changbum/workplace/wedding_invitation

# Git 초기화
git init

# 원격 저장소 추가 (본인 GitHub 계정의 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git

# 첫 커밋
git add .
git commit -m "Initial commit: Wedding invitation site"

# main 브랜치로 push
git branch -M main
git push -u origin main
```

### 2. GitHub에서 Repository 생성

1. https://github.com/new 접속
2. Repository name: `wedding-invitation` (또는 원하는 이름)
3. 선택사항:
   - **Public** 권장 (GitHub Pages는 Public repo에서 무료)
   - Private도 가능하지만 GitHub Pro 계정 필요
4. **Create repository** 클릭

---

## GitHub Pages 활성화

### 단계별 설정

#### 1단계: Settings 접속
```
Repository → Settings → Pages (왼쪽 메뉴)
```

#### 2단계: Build and deployment 설정
**Source**: `GitHub Actions` 선택

![GitHub Actions Source](https://docs.github.com/assets/cb-47528/mw-1440/images/help/pages/create-pages-workflow.webp)

> 🔴 중요: "Deploy from a branch" 가 아닌 **"GitHub Actions"** 를 선택해야 합니다!

#### 3단계: 자동 배포 대기
- 설정 후 main 브랜치에 push하면 자동으로 배포 워크플로우가 실행됩니다
- Actions 탭에서 진행 상황을 실시간으로 확인할 수 있습니다

---

## 자동 배포 확인

### Actions 탭에서 모니터링

```
Repository → Actions → Deploy to GitHub Pages
```

#### 성공적인 배포 흐름
```
┌─────────────────────────────────────┐
│ 1. build (ubuntu-latest)            │
│    ✓ Checkout repository            │
│    ✓ Setup Node.js                  │
│    ✓ Install dependencies           │
│    ✓ Create optimized build         │
│    ✓ Optimize images                │
│    ✓ Setup Pages                    │
│    ✓ Upload artifact                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 2. deploy (ubuntu-latest)           │
│    ✓ Deploy to GitHub Pages         │
│    → URL: https://username.github.io│
└─────────────────────────────────────┘
```

### 배포 URL 확인

배포 완료 후 사이트 접속:
```
https://YOUR_USERNAME.github.io/wedding-invitation/
```

또는 Settings → Pages에서 URL 확인 가능:
```
🟢 Your site is live at https://...
```

---

## 커스텀 도메인 설정

### 옵션 1: GitHub 제공 서브도메인 사용
기본 URL: `https://username.github.io/repository-name/`

### 옵션 2: 커스텀 도메인 연결

#### 2-1. 도메인 구매
- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (추천)

#### 2-2. DNS 레코드 설정

**Apex 도메인** (예: `wedding.com`):
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

**서브도메인** (예: `www.wedding.com`):
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

#### 2-3. GitHub에서 커스텀 도메인 설정

1. Repository → Settings → Pages
2. Custom domain 입력: `wedding.com`
3. **Enforce HTTPS** 체크 (필수)
4. DNS check 완료 대기 (최대 24시간)

#### 2-4. CNAME 파일 자동 생성 (선택)

`.github/workflows/deploy.yml` 파일 수정:
```yaml
# Line 50-51 주석 해제 및 수정
- name: Create CNAME
  run: echo "your-domain.com" > dist/CNAME
```

---

## 최적화 전략

### 1. HTML/CSS/JS 압축 ✅ 자동 적용됨

워크플로우에서 자동으로 처리:
```yaml
html-minifier-terser \
  --collapse-whitespace \
  --remove-comments \
  --minify-css true \
  --minify-js true
```

**효과**: 50-70% 크기 감소

### 2. 이미지 최적화

#### 자동 최적화 (GitHub Actions)
PNG/JPEG 이미지는 배포 시 자동으로 최적화됩니다.

#### 수동 최적화 (로컬)
배포 전에 이미지를 미리 최적화하면 더 빠릅니다:

```bash
# PNG 최적화
pngquant --quality=65-80 public/images/*.png

# JPEG 최적화
jpegoptim --max=85 public/images/*.jpg

# WebP 변환 (최신 포맷)
for img in public/images/*.{jpg,png}; do
  cwebp -q 80 "$img" -o "${img%.*}.webp"
done
```

#### 권장 이미지 크기
```
Hero 이미지: 1920x1080, < 300KB
썸네일: 600x400, < 100KB
아이콘: 64x64, < 10KB
```

### 3. 캐싱 전략

#### GitHub Pages 기본 캐싱
자동으로 적용되는 캐시 헤더:
```
Cache-Control: max-age=600
```

#### 브라우저 캐싱 강화
`index.html`에 meta 태그 추가:
```html
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

#### Service Worker (PWA)
고급 캐싱을 위해 Service Worker 추가 가능:
```javascript
// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/public/images/hero.jpg'
      ]);
    })
  );
});
```

### 4. 성능 최적화 체크리스트

```
✅ HTML minification
✅ CSS inline (index.html 내 포함)
✅ .nojekyll 파일 (Jekyll 처리 스킵)
✅ Preconnect to external domains
✅ Font display: swap
⬜ Critical CSS extraction
⬜ Lazy loading images
⬜ HTTP/2 Server Push
⬜ PWA manifest
```

---

## 트러블슈팅

### 🔴 문제: "Resource not accessible by integration"

**원인**: 권한 부족

**해결**:
```yaml
# .github/workflows/deploy.yml 확인
permissions:
  contents: read
  pages: write
  id-token: write
```

### 🔴 문제: 배포 성공했지만 404 에러

**원인 1**: GitHub Pages 소스 설정 오류
```
Settings → Pages → Source: GitHub Actions 확인
```

**원인 2**: index.html 경로 문제
```bash
# dist 폴더에 index.html이 루트에 있는지 확인
ls -la dist/
# 출력에 index.html이 있어야 함
```

**원인 3**: 브라우저 캐시
```
Ctrl + Shift + R (강제 새로고침)
또는 시크릿 모드로 접속
```

### 🔴 문제: CSS/이미지가 로드되지 않음

**원인**: 상대 경로 문제

**해결**:
```html
<!-- 잘못된 방법 -->
<link rel="stylesheet" href="/style.css">
<img src="/images/photo.jpg">

<!-- 올바른 방법 (repository name 포함) -->
<link rel="stylesheet" href="/wedding-invitation/style.css">
<img src="/wedding-invitation/images/photo.jpg">

<!-- 또는 상대 경로 사용 -->
<link rel="stylesheet" href="./style.css">
<img src="./images/photo.jpg">
```

### 🔴 문제: 워크플로우 실행 안 됨

**체크리스트**:
```bash
# 1. main 브랜치에 push했는지 확인
git branch  # main 브랜치 확인

# 2. 워크플로우 파일 경로 확인
ls -la .github/workflows/deploy.yml

# 3. YAML 문법 오류 확인
# Actions 탭에서 에러 메시지 확인

# 4. 수동 실행 테스트
# Actions → Deploy to GitHub Pages → Run workflow
```

### 🔴 문제: 이미지 최적화 실패

**해결**:
```yaml
# deploy.yml에서 이미지 최적화는 continue-on-error: true
# 실패해도 배포는 계속 진행됨
# 로컬에서 미리 최적화하는 것을 권장
```

### 🟡 문제: 배포가 너무 느림

**최적화**:
```yaml
# Node.js 캐싱 활성화 (이미 적용됨)
- uses: actions/setup-node@v4
  with:
    cache: npm

# 의존성 캐싱 추가
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 🟢 문제: 커스텀 도메인 HTTPS 활성화 안 됨

**대기 시간**: DNS 전파 + GitHub SSL 인증서 발급 (최대 24시간)

**확인 방법**:
```bash
# DNS 전파 확인
dig wedding.com

# SSL 인증서 확인
curl -I https://wedding.com
```

---

## 배포 후 확인 사항

### 1. 기능 테스트

```
✅ 사이트 정상 로딩
✅ 이미지 표시 확인
✅ 반응형 디자인 (모바일/태블릿/데스크톱)
✅ 외부 링크 작동 (지도, 연락처)
✅ 성능 테스트 (Lighthouse)
```

### 2. Lighthouse 성능 측정

Chrome DevTools:
```
F12 → Lighthouse → Analyze page load
```

**목표 점수**:
```
Performance: 95+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

### 3. 모바일 테스트

실제 기기에서 테스트:
```
iOS Safari
Android Chrome
다양한 화면 크기
```

### 4. 공유 테스트

SNS 공유 미리보기 확인:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- KakaoTalk: https://developers.kakao.com/tool/debugger/sharing

---

## 유지보수

### 코드 수정 및 재배포

```bash
# 1. 로컬에서 수정
vim index.html

# 2. 로컬 빌드 테스트
./build.sh
npx serve dist

# 3. 커밋 및 푸시
git add .
git commit -m "Update: 예식장 주소 수정"
git push origin main

# 4. 자동 배포 확인
# GitHub Actions에서 자동으로 배포됨 (약 2-3분 소요)
```

### 긴급 롤백

```bash
# 이전 커밋으로 되돌리기
git revert HEAD
git push origin main

# 또는 특정 커밋으로 강제 롤백 (주의!)
git reset --hard COMMIT_HASH
git push -f origin main
```

### 배포 히스토리 확인

```
Repository → Actions → All workflows
각 배포의 성공/실패 로그 확인 가능
```

---

## 추가 리소스

### 공식 문서
- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [upload-pages-artifact](https://github.com/actions/upload-pages-artifact)
- [deploy-pages](https://github.com/actions/deploy-pages)

### 도구
- [HTML Minifier](https://github.com/terser/html-minifier-terser)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

### 커뮤니티
- [GitHub Community Forum](https://github.community/)
- [Stack Overflow: github-pages](https://stackoverflow.com/questions/tagged/github-pages)

---

## 문의

배포 과정에서 문제가 발생하면:
1. 이 문서의 [트러블슈팅](#트러블슈팅) 섹션 확인
2. GitHub Actions 로그 확인
3. GitHub Issues에 질문 등록

**Happy Deploying! 🎉**
