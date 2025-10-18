# 🚢 배포 가이드 (Deployment Guide)

**Last Updated**: 2025-10-18
**Project**: GitHub Pages 모바일 청첩장
**Status**: ✅ Production Ready

---

## 목차

- [배포 개요](#배포-개요)
- [GitHub Pages 배포 설정](#github-pages-배포-설정)
- [GitHub Actions 워크플로우](#github-actions-워크플로우)
- [커스텀 도메인 연결](#커스텀-도메인-연결)
- [환경 변수 설정](#환경-변수-설정)
- [배포 확인 및 모니터링](#배포-확인-및-모니터링)
- [트러블슈팅](#트러블슈팅)

---

## 배포 개요

### 배포 플랫폼: GitHub Pages

**선택 이유**:
- ✅ **완전 무료**: 무제한 트래픽, 대역폭
- ✅ **HTTPS 기본 제공**: Let's Encrypt 인증서
- ✅ **CDN**: Fastly CDN으로 전세계 빠른 로딩
- ✅ **Git 기반**: `git push`로 자동 배포
- ✅ **99.9% 업타임**: GitHub 인프라

### 배포 프로세스

```
┌────────────────┐
│  git push main │
└────────┬───────┘
         │
         ▼
┌─────────────────────────────┐
│  GitHub Actions Trigger     │
│  (.github/workflows)        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Build (pnpm build)         │
│  - Astro 빌드               │
│  - 이미지 최적화            │
│  - CSS/JS 압축              │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Deploy to GitHub Pages     │
│  https://username.github.io │
└─────────────────────────────┘
```

---

## GitHub Pages 배포 설정

### 1단계: 저장소 설정

#### 옵션 A: User/Organization Site (권장)

**저장소 이름**: `yourusername.github.io`

**URL**: `https://yourusername.github.io`

**장점**:
- 짧은 URL
- `base` 경로 불필요
- SEO 유리

**단점**:
- 계정당 1개만 가능

#### 옵션 B: Project Site

**저장소 이름**: `wedding-invitation` (아무 이름)

**URL**: `https://yourusername.github.io/wedding-invitation`

**장점**:
- 여러 프로젝트 가능

**단점**:
- 긴 URL
- `base` 경로 설정 필요

### 2단계: Repository Settings

1. GitHub 저장소 → **Settings**
2. 왼쪽 메뉴 → **Pages**
3. **Source** 설정:
   - Source: `GitHub Actions` 선택
   - (기존 방식인 "Deploy from a branch"는 사용 안 함)

**스크린샷 설명**:
```
┌────────────────────────────────┐
│ GitHub Pages                   │
├────────────────────────────────┤
│ Source                         │
│ ○ Deploy from a branch        │
│ ● GitHub Actions              │ ← 이것 선택!
└────────────────────────────────┘
```

### 3단계: astro.config.mjs 설정

#### User Site (yourusername.github.io)

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://yourusername.github.io',  // ← 여기 수정
  // base는 설정 안 함 (루트 경로)

  output: 'static',
  integrations: [react(), tailwind()],

  build: {
    assets: 'assets',
  },
});
```

#### Project Site (yourusername.github.io/wedding)

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/wedding-invitation',  // ← 저장소 이름과 동일

  output: 'static',
  integrations: [react(), tailwind()],

  build: {
    assets: 'assets',
  },
});
```

---

## GitHub Actions 워크플로우

### 워크플로우 파일 생성

```bash
# .github/workflows/deploy.yml 생성
mkdir -p .github/workflows
```

**`.github/workflows/deploy.yml`**:

```yaml
name: Deploy to GitHub Pages

on:
  # main 브랜치에 push 시 자동 배포
  push:
    branches: [main]

  # 수동 실행 허용
  workflow_dispatch:

# GitHub Pages 권한 설정
permissions:
  contents: read
  pages: write
  id-token: write

# 동시 배포 방지
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        run: pnpm build
        env:
          # GitHub Secrets에서 환경 변수 주입
          PUBLIC_RSVP_WEBHOOK_URL: ${{ secrets.RSVP_WEBHOOK_URL }}
          PUBLIC_KAKAO_MAP_KEY: ${{ secrets.KAKAO_MAP_KEY }}
          PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 워크플로우 동작 확인

```bash
# 1. 커밋 및 푸시
git add .
git commit -m "Add deployment workflow"
git push origin main

# 2. GitHub Actions 탭에서 진행 상황 확인
# https://github.com/yourusername/wedding-invitation/actions
```

**배포 성공 시 출력**:
```
✓ Build job completed
✓ Deploy job completed
URL: https://yourusername.github.io/wedding-invitation
```

---

## 커스텀 도메인 연결

### 1단계: 도메인 구매

**추천 도메인 등록 업체** (한국):
- [가비아](https://www.gabia.com) - 연 1만원~
- [후이즈](https://www.whois.co.kr) - 연 1.5만원~
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) - 연 $10 (해외)

**도메인 예시**:
- `kim-park-wedding.com`
- `2025wedding.com`
- `ourwedding.co.kr`

### 2단계: DNS 설정

#### A 레코드 (Apex Domain)

도메인 등록 업체의 DNS 관리 페이지에서:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

#### CNAME 레코드 (Subdomain)

| Type | Name | Value |
|------|------|-------|
| CNAME | www | yourusername.github.io. |

**전파 시간**: 5분 ~ 48시간 (보통 1시간 내)

### 3단계: GitHub Pages 커스텀 도메인 설정

1. GitHub 저장소 → **Settings** → **Pages**
2. **Custom domain** 입력: `yourdomain.com`
3. **Save** 클릭
4. **Enforce HTTPS** 체크 (DNS 전파 후 가능)

**설정 완료 후**:
```bash
# public/CNAME 파일 자동 생성됨
cat public/CNAME
# 출력: yourdomain.com
```

### 4단계: astro.config.mjs 업데이트

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://yourdomain.com',  // ← 커스텀 도메인으로 변경
  // base는 제거 (루트 경로 사용)

  // ... 나머지 설정
});
```

### 5단계: 배포 및 확인

```bash
git add astro.config.mjs public/CNAME
git commit -m "Add custom domain"
git push origin main
```

**확인**:
```bash
# DNS 전파 확인
nslookup yourdomain.com

# HTTPS 확인
curl -I https://yourdomain.com
# 출력: HTTP/2 200 (성공)
```

---

## 환경 변수 설정

### GitHub Secrets 등록

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭

**등록할 Secrets**:

| Name | Value | Required |
|------|-------|----------|
| `RSVP_WEBHOOK_URL` | Google Apps Script 웹 앱 URL | RSVP 기능 사용 시 |
| `KAKAO_MAP_KEY` | Kakao Maps JavaScript 키 | 지도 기능 사용 시 |
| `SITE_URL` | `https://yourdomain.com` | SEO/OG 태그용 |

**예시**:

```
Name:  RSVP_WEBHOOK_URL
Value: https://script.google.com/macros/s/AKfycbyXXXX/exec
```

### 로컬 개발 vs 프로덕션

```bash
# .env (로컬 개발용 - .gitignore에 포함)
PUBLIC_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/DEV_SCRIPT/exec
PUBLIC_KAKAO_MAP_KEY=dev_api_key_local_only
PUBLIC_SITE_URL=http://localhost:4321

# GitHub Secrets (프로덕션용)
# → GitHub Actions 빌드 시 자동 주입
```

---

## 배포 확인 및 모니터링

### 배포 상태 확인

#### 1. GitHub Actions

```
https://github.com/yourusername/wedding-invitation/actions
```

**성공 시**:
```
✓ build (3m 12s)
✓ deploy (1m 5s)
```

**실패 시**:
```
✗ build (1m 30s)
  Error: Command failed: pnpm build
```

→ 로그 클릭하여 에러 확인

#### 2. Deployment History

```
https://github.com/yourusername/wedding-invitation/deployments
```

**최근 배포 목록**:
```
✓ Production - 2025-10-18 10:30 (main @ abc1234)
✓ Production - 2025-10-17 15:20 (main @ def5678)
```

### 성능 모니터링

#### Lighthouse CI (자동)

**`.github/workflows/lighthouse-ci.yml`** (선택 사항):

```yaml
name: Lighthouse CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Lighthouse CI
        run: npm install -g @lhci/cli

      - name: Install dependencies
        run: pnpm install

      - name: Build site
        run: pnpm build

      - name: Run Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**lighthouserc.js**:

```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/',
        'http://localhost/#rsvp',
        'http://localhost/#map',
      ],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

#### Google Analytics (선택 사항)

**1. GA4 속성 생성**:
```
https://analytics.google.com
→ 관리 → 속성 만들기
```

**2. 측정 ID 복사**: `G-XXXXXXXXXX`

**3. 환경 변수 추가**:
```bash
# GitHub Secrets
Name:  PUBLIC_GA_ID
Value: G-XXXXXXXXXX
```

**4. 컴포넌트 추가**:
```astro
---
// src/components/GoogleAnalytics.astro
const { id } = Astro.props;
---

{id && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`}></script>
    <script is:inline define:vars={{ id }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', id);
    </script>
  </>
)}
```

**5. Layout에 추가**:
```astro
---
// src/layouts/Layout.astro
import GoogleAnalytics from '../components/GoogleAnalytics.astro';
const gaId = import.meta.env.PUBLIC_GA_ID;
---

<html>
  <head>
    <GoogleAnalytics id={gaId} />
  </head>
</html>
```

---

## 트러블슈팅

### 문제 1: 배포 후 404 Error

**증상**: `https://yourusername.github.io/wedding` 접속 시 404

**원인**: `base` 경로 설정 오류

**해결**:
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/wedding-invitation',  // ← 저장소 이름과 정확히 일치
});
```

**확인**:
```bash
pnpm build
cat dist/index.html
# 모든 링크가 /wedding-invitation/ 로 시작하는지 확인
```

---

### 문제 2: GitHub Actions 빌드 실패

**증상**: Actions 탭에서 ✗ 빌드 실패

**원인 1**: `pnpm-lock.yaml` 누락

**해결**:
```bash
# pnpm-lock.yaml을 커밋에 포함
git add pnpm-lock.yaml
git commit -m "Add lockfile"
git push
```

**원인 2**: Node 버전 불일치

**해결**:
```yaml
# .github/workflows/deploy.yml
- uses: actions/setup-node@v4
  with:
    node-version: 22  # ← 로컬과 동일한 버전
```

---

### 문제 3: 이미지가 표시되지 않음

**증상**: 로컬에서는 보이지만 GitHub Pages에서 안 보임

**원인**: 절대 경로 vs 상대 경로

**해결**:
```astro
<!-- ❌ 잘못된 경로 -->
<img src="images/cover.jpg" />

<!-- ✅ 올바른 경로 (프로젝트 사이트) -->
<img src={import.meta.env.BASE_URL + 'images/cover.jpg'} />

<!-- ✅ 또는 Astro Image 컴포넌트 사용 -->
---
import { Image } from 'astro:assets';
import cover from '../assets/cover.jpg';
---
<Image src={cover} alt="Cover" />
```

---

### 문제 4: 커스텀 도메인 HTTPS 오류

**증상**: "Your connection is not private" 경고

**원인**: DNS 전파 미완료 또는 HTTPS 미활성화

**해결**:

**1. DNS 전파 확인**:
```bash
dig yourdomain.com

# A 레코드가 GitHub Pages IP로 설정되었는지 확인
# 185.199.108.153 등
```

**2. HTTPS 강제 활성화 대기**:
- GitHub Pages Settings → "Enforce HTTPS" 체크
- DNS 전파 후 자동으로 Let's Encrypt 인증서 발급 (최대 24시간)

**3. 임시 해결**:
```
http://yourdomain.com (HTTPS 없이 접속 가능)
```

---

### 문제 5: 환경 변수가 적용되지 않음

**증상**: API 호출 실패, 지도 표시 안 됨

**원인**: GitHub Secrets 미등록 또는 오타

**해결**:

**1. Secrets 확인**:
```
Settings → Secrets and variables → Actions
→ RSVP_WEBHOOK_URL, KAKAO_MAP_KEY 존재 확인
```

**2. 워크플로우에서 환경 변수 주입 확인**:
```yaml
# .github/workflows/deploy.yml
- name: Build site
  run: pnpm build
  env:
    PUBLIC_RSVP_WEBHOOK_URL: ${{ secrets.RSVP_WEBHOOK_URL }}  # ← 이 부분 확인
```

**3. 빌드 로그에서 환경 변수 확인** (디버깅):
```yaml
- name: Debug environment variables
  run: |
    echo "Site URL: $PUBLIC_SITE_URL"
    echo "Webhook: $PUBLIC_RSVP_WEBHOOK_URL"
  env:
    PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}
    PUBLIC_RSVP_WEBHOOK_URL: ${{ secrets.RSVP_WEBHOOK_URL }}
```

---

## 배포 체크리스트

### 배포 전 (Pre-deployment)

- [ ] `site.config.ts` 개인 정보 수정
- [ ] 이미지 추가 (`public/images/`)
- [ ] Google Sheets RSVP 설정 (선택)
- [ ] Kakao Maps API 키 발급 (선택)
- [ ] `astro.config.mjs` 설정 확인 (`site`, `base`)
- [ ] 로컬 빌드 테스트 (`pnpm build`)
- [ ] 로컬 미리보기 확인 (`pnpm preview`)

### 배포 중 (Deployment)

- [ ] GitHub Secrets 등록
- [ ] `.github/workflows/deploy.yml` 생성
- [ ] `main` 브랜치에 push
- [ ] GitHub Actions 성공 확인

### 배포 후 (Post-deployment)

- [ ] 사이트 접속 확인
- [ ] 모바일 테스트 (iPhone, Android)
- [ ] RSVP 폼 제출 테스트
- [ ] 지도 표시 확인
- [ ] Lighthouse 점수 확인 (>90)
- [ ] 커스텀 도메인 연결 (선택)
- [ ] Google Analytics 연동 (선택)

---

## 참고 자료

### 공식 문서

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Actions Documentation](https://docs.github.com/actions)

### 유용한 도구

- [DNS Checker](https://dnschecker.org) - DNS 전파 확인
- [SSL Labs](https://www.ssllabs.com/ssltest/) - HTTPS 보안 테스트
- [PageSpeed Insights](https://pagespeed.web.dev) - 성능 측정
- [Pingdom](https://tools.pingdom.com) - 사이트 속도 테스트

---

**Last Updated**: 2025-10-18
**Next Review**: 배포 후 1주일 (성능 모니터링)
**Document Owner**: DevOps Engineer

---

**Navigation**: [← QUICK_START](QUICK_START.md) | [PROJECT_PLAN →](../../PROJECT_PLAN.md) | [README →](../../README.md)
