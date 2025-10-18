# 🚀 배포 체크리스트

배포 전에 이 체크리스트를 확인하세요!

## 사전 준비

### 로컬 환경 확인
- [ ] Node.js 18+ 설치 확인: `node --version`
- [ ] npm 패키지 설치 완료: `npm install`
- [ ] Git 설치 확인: `git --version`
- [ ] GitHub 계정 로그인 완료

### 프로젝트 설정 확인
- [ ] `package.json` 존재 확인
- [ ] `vite.config.js` 설정 확인
  - [ ] `base` 경로 설정: `'./'` (상대 경로 권장)
  - [ ] `minify: 'terser'` 활성화
  - [ ] `sourcemap: false` (프로덕션)

---

## 빌드 테스트

### 로컬 빌드 실행
```bash
# 빌드 스크립트 실행
./build.sh

# 예상 출력:
# ✅ Build completed successfully!
# 📁 Output: ./dist
```

- [ ] `dist/` 폴더 생성 확인
- [ ] `dist/index.html` 존재 확인
- [ ] `dist/.nojekyll` 존재 확인
- [ ] `dist/assets/` 폴더 확인 (CSS/JS 번들)

### 로컬 프리뷰 테스트
```bash
npm run preview
# 또는
npx serve dist
```

- [ ] 브라우저에서 정상 로딩
- [ ] 모든 이미지 표시 확인
- [ ] CSS 스타일 적용 확인
- [ ] JavaScript 동작 확인
- [ ] 모바일 반응형 확인 (DevTools)

---

## 콘텐츠 최종 확인

### 텍스트 내용
- [ ] 신랑/신부 이름 정확
- [ ] 결혼식 날짜 정확
- [ ] 예식장 주소 정확
- [ ] 연락처 정보 정확
- [ ] 맞춤법 검사 완료

### 이미지
- [ ] 모든 이미지 경로 정확
- [ ] 이미지 파일 크기 확인 (각 < 500KB 권장)
- [ ] 이미지 최적화 완료
  - PNG: pngquant 사용
  - JPEG: 85% 품질
  - WebP 변환 고려

### 링크 및 기능
- [ ] 지도 링크 작동 (Kakao/Naver/Google Maps)
- [ ] 전화 링크 작동 (`tel:`)
- [ ] 문자 링크 작동 (`sms:`)
- [ ] 외부 링크 새 탭 열림 (`target="_blank"`)

---

## Git 준비

### Repository 설정
- [ ] GitHub에 저장소 생성 완료
- [ ] 저장소 이름 결정 (예: `wedding-invitation`)
- [ ] Public repository 선택 (무료 GitHub Pages)

### Git 초기화
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
```

- [ ] `.gitignore` 확인 (node_modules, dist, .env 제외)
- [ ] 모든 파일 스테이징: `git add .`
- [ ] 초기 커밋 생성: `git commit -m "Initial commit"`

---

## GitHub Actions 워크플로우 확인

### 워크플로우 파일 검증
- [ ] `.github/workflows/deploy.yml` 존재
- [ ] 권한 설정 확인:
  ```yaml
  permissions:
    contents: read
    pages: write
    id-token: write
  ```
- [ ] 브랜치 설정 확인: `branches: ['main']`
- [ ] Node.js 버전 확인: `node-version: '20'`
- [ ] 빌드 명령어 확인: `npm run build`
- [ ] Artifact 경로 확인: `path: './dist'`

### 추가 워크플로우 (선택)
- [ ] `.github/workflows/preview.yml` (PR 프리뷰)
- [ ] `.github/workflows/performance-check.yml` (성능 체크)

---

## 배포 실행

### 첫 배포
```bash
git branch -M main
git push -u origin main
```

- [ ] Push 성공 확인
- [ ] GitHub Actions 탭 확인
- [ ] 워크플로우 실행 시작 확인

### GitHub Pages 활성화
```
Repository → Settings → Pages
```

- [ ] Source: **GitHub Actions** 선택
- [ ] Save 클릭

---

## 배포 모니터링

### Actions 탭에서 확인
```
Repository → Actions → Deploy to GitHub Pages
```

- [ ] Build job 성공 (녹색 체크)
- [ ] Deploy job 성공 (녹색 체크)
- [ ] 전체 워크플로우 완료 (약 2-3분)

### 예상 로그
```
✓ Checkout
✓ Setup Node
✓ Install dependencies
✓ Build with Vite
✓ Create .nojekyll
✓ Optimize HTML (선택)
✓ Setup Pages
✓ Upload artifact
✓ Deploy to GitHub Pages
```

---

## 배포 검증

### URL 접속 확인
```
https://YOUR_USERNAME.github.io/wedding-invitation/
```

- [ ] 사이트 로딩 확인
- [ ] HTTPS 적용 확인 (자물쇠 아이콘)
- [ ] 모든 콘텐츠 표시 확인
- [ ] 이미지 로딩 확인
- [ ] CSS 스타일 적용 확인

### 다양한 환경 테스트

#### 데스크톱
- [ ] Chrome 최신 버전
- [ ] Firefox 최신 버전
- [ ] Safari (Mac)
- [ ] Edge

#### 모바일
- [ ] iOS Safari (iPhone)
- [ ] Android Chrome
- [ ] 카카오톡 인앱 브라우저
- [ ] 네이버 앱 인앱 브라우저

#### 화면 크기
- [ ] 모바일 (320px ~ 480px)
- [ ] 태블릿 (768px ~ 1024px)
- [ ] 데스크톱 (1920px+)

---

## 성능 최적화 확인

### Lighthouse 점수 측정
```
Chrome DevTools → Lighthouse → Analyze page load
```

목표 점수:
- [ ] Performance: 95+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 95+

### 빌드 크기 확인
```bash
du -sh dist
```

- [ ] 전체 크기 < 1MB (권장)
- [ ] HTML 크기 < 100KB (권장)
- [ ] 이미지 총합 < 500KB (권장)

### 로딩 속도 확인
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] TTI (Time to Interactive) < 3.8s

---

## SNS 공유 테스트

### Open Graph 메타 태그 확인
```html
<meta property="og:title" content="신랑♥신부 결혼합니다">
<meta property="og:description" content="...">
<meta property="og:image" content="https://...">
```

### 공유 미리보기 테스트
- [ ] [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [Kakao Debugger](https://developers.kakao.com/tool/debugger/sharing)

---

## 커스텀 도메인 (선택)

### 도메인 구매
- [ ] 도메인 등록 완료
- [ ] DNS 관리 패널 접근 가능

### DNS 레코드 설정
```
Type: A
Name: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

- [ ] A 레코드 추가 완료
- [ ] CNAME 레코드 추가 완료
- [ ] DNS 전파 대기 (최대 24시간)

### GitHub 설정
```
Settings → Pages → Custom domain
```

- [ ] 커스텀 도메인 입력
- [ ] DNS check 통과
- [ ] **Enforce HTTPS** 체크 (필수)
- [ ] HTTPS 인증서 발급 대기 (최대 24시간)

---

## 유지보수 준비

### 문서화
- [ ] README.md 업데이트
- [ ] 배포 URL 기록
- [ ] 관리자 연락처 기록

### 백업
- [ ] Repository private backup
- [ ] 로컬 백업 보관
- [ ] 이미지 원본 파일 보관

### 모니터링 설정 (선택)
- [ ] Google Analytics 추가
- [ ] Uptime monitoring 설정
- [ ] Error tracking 설정 (Sentry 등)

---

## 배포 후 작업

### 링크 공유
- [ ] 카카오톡 공유 테스트
- [ ] 문자 메시지 전송 테스트
- [ ] QR 코드 생성
  - https://www.qr-code-generator.com/
  - URL 입력 후 다운로드

### 피드백 수집
- [ ] 가족/친구에게 테스트 요청
- [ ] 모바일 로딩 속도 확인 요청
- [ ] 텍스트 가독성 확인 요청

### 최종 점검
- [ ] 모든 기능 정상 작동
- [ ] 모든 링크 작동
- [ ] 오타/맞춤법 확인
- [ ] 날짜/시간 정확성 확인

---

## 긴급 상황 대응

### 배포 실패 시
```bash
# Actions 탭에서 에러 로그 확인
# 로컬에서 빌드 테스트
npm run build

# 이전 커밋으로 롤백
git revert HEAD
git push origin main
```

### 긴급 수정 필요 시
```bash
# 수정 작업
vim index.html

# 빌드 테스트
./build.sh

# 긴급 배포
git add .
git commit -m "Hotfix: 긴급 수정 내용"
git push origin main

# 배포 완료 대기 (2-3분)
```

---

## 완료! 🎉

모든 항목을 체크했다면 배포 준비가 완료되었습니다!

### 다음 단계
- 📱 청첩장 URL 공유
- 🔔 참석 여부 응답 모니터링
- 🎊 결혼식 당일 즐기기!

**축하합니다! 성공적인 배포를 기원합니다! 💒**
