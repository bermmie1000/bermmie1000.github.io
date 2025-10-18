# 🚀 GitHub Pages 배포 가이드

## 목차
1. [사전 준비](#사전-준비)
2. [GitHub 저장소 설정](#github-저장소-설정)
3. [로컬 개발](#로컬-개발)
4. [배포 프로세스](#배포-프로세스)
5. [커스텀 도메인 설정](#커스텀-도메인-설정)
6. [트러블슈팅](#트러블슈팅)

---

## 사전 준비

### 필수 도구
- **Node.js**: v18.0.0 이상
- **Git**: 버전 관리
- **GitHub 계정**: GitHub Pages 호스팅

### 설치 확인
```bash
node --version  # v18.0.0 이상
npm --version   # 9.0.0 이상
git --version   # 2.0.0 이상
```

---

## GitHub 저장소 설정

### 1. 새 저장소 생성

1. GitHub에 로그인
2. 우측 상단 `+` → `New repository` 클릭
3. 저장소 정보 입력:
   - **Repository name**: `wedding-invitation` (또는 원하는 이름)
   - **Description**: `Modern wedding invitation website`
   - **Public** 선택 (GitHub Pages는 Public 필수, 또는 Pro 계정)
   - **README** 체크 해제 (이미 있음)
4. `Create repository` 클릭

### 2. 로컬 저장소와 연결

```bash
# 프로젝트 디렉토리로 이동
cd /Users/changbum/workplace/wedding_invitation

# Git 초기화 (이미 되어 있다면 스킵)
git init

# GitHub 원격 저장소 추가
git remote add origin https://github.com/yourusername/wedding-invitation.git

# 또는 SSH 사용
git remote add origin git@github.com:yourusername/wedding-invitation.git

# 원격 저장소 확인
git remote -v
```

### 3. 첫 커밋 및 푸시

```bash
# 모든 파일 추가
git add .

# 커밋
git commit -m "feat: initial commit - wedding invitation website

- Add responsive HTML/CSS/JS
- Add PWA support (manifest.json, service worker)
- Add GitHub Actions for deployment
- Add Lighthouse CI for performance monitoring

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# main 브랜치로 푸시
git branch -M main
git push -u origin main
```

---

## GitHub Pages 활성화

### 1. 저장소 Settings 이동
1. GitHub 저장소 페이지로 이동
2. 상단 `Settings` 탭 클릭

### 2. Pages 설정
1. 왼쪽 메뉴에서 `Pages` 클릭
2. **Source** 섹션:
   - `GitHub Actions` 선택 (권장)
   - 또는 `Deploy from a branch` 선택 후 `gh-pages` 브랜치 선택

3. **Custom domain** (선택 사항):
   - 커스텀 도메인이 있다면 입력 (예: `wedding.example.com`)
   - `Enforce HTTPS` 체크

4. 설정 저장 후 1-2분 대기

### 3. 배포 확인
```
URL: https://yourusername.github.io/wedding-invitation/
```

브라우저에서 위 URL 접속하여 배포 확인

---

## 로컬 개발

### 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (Vite)
npm run dev

# 브라우저에서 자동으로 열림
# http://localhost:5173
```

### 프로덕션 빌드 테스트

```bash
# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 브라우저에서 확인
# http://localhost:4173
```

### 정적 파일만 사용하는 경우 (Vanilla HTML/CSS/JS)

```bash
# http-server 설치 (전역)
npm install -g http-server

# 개발 서버 실행
http-server . -p 8080 -o

# 브라우저에서 자동으로 열림
# http://localhost:8080
```

---

## 배포 프로세스

### 자동 배포 (GitHub Actions)

프로젝트에는 `.github/workflows/deploy.yml` 파일이 있어 자동 배포가 설정되어 있습니다.

```bash
# main 브랜치에 푸시하면 자동 배포
git add .
git commit -m "update: wedding details"
git push origin main

# GitHub Actions가 자동으로:
# 1. 코드 체크아웃
# 2. 의존성 설치
# 3. Vite 빌드 (npm run build)
# 4. HTML 최적화
# 5. GitHub Pages 배포
```

### 배포 상태 확인

1. GitHub 저장소 페이지
2. 상단 `Actions` 탭 클릭
3. 최근 워크플로우 실행 확인
4. ✅ 초록색 체크 = 성공
5. ❌ 빨간 X = 실패 (로그 확인)

### 수동 배포 (필요시)

```bash
# 빌드
npm run build

# gh-pages 브랜치에 배포 (gh-pages 패키지 사용)
npm install -g gh-pages

# dist 폴더를 gh-pages 브랜치로 배포
gh-pages -d dist
```

---

## 성능 최적화

### Lighthouse CI

프로젝트에는 Lighthouse CI가 설정되어 있어 자동으로 성능 측정합니다.

**목표 점수:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+
- PWA: 80+

### 수동 Lighthouse 실행

```bash
# Lighthouse CI 설치
npm install -g @lhci/cli

# 로컬 서버 실행
npm run dev &

# Lighthouse 실행
lhci autorun

# 결과는 .lighthouseci/ 폴더에 저장
```

### 성능 최적화 체크리스트

- [ ] 이미지 최적화 (WebP/AVIF 포맷)
- [ ] CSS/JS 번들 크기 확인 (< 100KB)
- [ ] 총 페이지 크기 < 500KB
- [ ] Lazy loading 이미지
- [ ] Service Worker 캐싱
- [ ] Gzip/Brotli 압축 (GitHub Pages 자동 제공)

---

## 커스텀 도메인 설정

### 1. DNS 설정 (도메인 제공업체에서)

**A 레코드 추가:**
```
Type: A
Host: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
TTL: 3600
```

**CNAME 레코드 추가 (선택 사항):**
```
Type: CNAME
Host: www
Value: yourusername.github.io
TTL: 3600
```

### 2. GitHub Pages 설정

1. 저장소 `Settings` → `Pages`
2. **Custom domain**에 도메인 입력 (예: `wedding.example.com`)
3. `Save` 클릭
4. **Enforce HTTPS** 체크 (자동 SSL 인증서 발급)

### 3. CNAME 파일 생성

```bash
# public/ 폴더에 CNAME 파일 생성
echo "wedding.example.com" > public/CNAME

# 커밋 및 푸시
git add public/CNAME
git commit -m "add: custom domain CNAME"
git push origin main
```

### 4. DNS 전파 확인

```bash
# DNS 전파 확인 (최대 24-48시간 소요)
nslookup wedding.example.com

# 또는 온라인 도구 사용
https://www.whatsmydns.net/
```

---

## 환경 변수 설정

### Kakao Maps API 키

```bash
# .env 파일 생성 (로컬 개발용)
echo "VITE_KAKAO_MAP_API_KEY=your_api_key_here" > .env

# .gitignore에 .env 추가 (이미 되어 있음)
```

### GitHub Secrets 설정 (배포용)

1. 저장소 `Settings` → `Secrets and variables` → `Actions`
2. `New repository secret` 클릭
3. 환경 변수 추가:
   - **Name**: `VITE_KAKAO_MAP_API_KEY`
   - **Value**: `your_api_key_here`

### 코드에서 사용

```javascript
// src/scripts/main.js
const kakaoApiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
```

---

## 트러블슈팅

### 1. 404 에러 - Page not found

**원인**: GitHub Pages가 활성화되지 않았거나 배포 실패

**해결**:
```bash
# 1. Settings → Pages에서 Source 확인
# 2. Actions 탭에서 배포 로그 확인
# 3. main 브랜치에 코드가 있는지 확인
git branch
git log --oneline -5
```

### 2. CSS/JS 파일 404 에러

**원인**: 경로 문제 (GitHub Pages는 서브디렉토리에 배포됨)

**해결**:
```javascript
// vite.config.js 수정
export default {
  base: '/wedding-invitation/', // 저장소 이름
}
```

### 3. Service Worker 등록 실패

**원인**: HTTPS가 아닌 환경

**해결**:
- GitHub Pages는 자동으로 HTTPS 제공
- 로컬 개발 시 `localhost`는 예외 허용
- 커스텀 도메인은 `Enforce HTTPS` 체크

### 4. 빌드 실패 - GitHub Actions

**원인**: 의존성 설치 실패 또는 빌드 오류

**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# package-lock.json 커밋 확인
git add package-lock.json
git commit -m "fix: update dependencies"
git push origin main
```

### 5. 이미지 로딩 실패

**원인**: 경로 오류 또는 파일 누락

**해결**:
```bash
# 이미지 파일 확인
ls -la public/images/

# Git에 추가되었는지 확인
git status

# 대용량 파일은 Git LFS 사용 고려
git lfs install
git lfs track "*.jpg" "*.png" "*.webp"
```

---

## 배포 체크리스트

### 배포 전
- [ ] 모든 텍스트 내용 확인 (이름, 날짜, 장소)
- [ ] 전화번호, 연락처 확인
- [ ] 지도 좌표 확인 (Kakao Maps)
- [ ] 이미지 최적화 완료
- [ ] 로컬에서 빌드 테스트 (`npm run build`)
- [ ] Lighthouse 점수 확인 (90+ 목표)
- [ ] 모바일 반응형 테스트
- [ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox)

### 배포 후
- [ ] 배포 URL 접속 확인
- [ ] 모든 섹션 동작 확인
- [ ] 전화/문자 링크 동작 확인
- [ ] RSVP 폼 제출 테스트
- [ ] PWA 설치 테스트 (Add to Home Screen)
- [ ] Open Graph 메타태그 확인 (카카오톡, 페이스북 공유)
- [ ] 성능 모니터링 (Google Analytics, Lighthouse CI)

---

## 유용한 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 코드 포맷팅
npm run format

# Lint 검사
npm run lint

# Lighthouse CI 실행
npm run lighthouse

# Git 상태 확인
git status

# 최근 커밋 확인
git log --oneline -5

# 배포 로그 확인 (GitHub Actions)
# https://github.com/yourusername/wedding-invitation/actions
```

---

## 참고 자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Vite 공식 문서](https://vitejs.dev/)
- [Lighthouse CI 가이드](https://github.com/GoogleChrome/lighthouse-ci)
- [PWA 체크리스트](https://web.dev/pwa-checklist/)
- [Web.dev 성능 가이드](https://web.dev/fast/)

---

## 문의

배포 관련 이슈가 있다면 GitHub Issues에 등록해주세요:
https://github.com/yourusername/wedding-invitation/issues

---

**Made with ❤️ | Powered by GitHub Pages**
