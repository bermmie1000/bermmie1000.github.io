# 🎯 프로젝트 실행 계획서 (Project Execution Plan)

**프로젝트명**: GitHub Pages 모바일 청첩장
**버전**: 1.0
**작성일**: 2025-10-18
**상태**: 🟢 Active
**소유자**: Project Team

---

## Executive Summary

### 프로젝트 목표

개발자 친화적인 **무료 오픈소스 모바일 청첩장 플랫폼**을 구축하여, 기존 상용 서비스의 비용 부담 없이 고품질의 맞춤형 웨딩 웹사이트를 제작할 수 있도록 지원합니다.

### 핵심 가치 제안

- **Zero Cost**: GitHub Pages 무료 호스팅 활용
- **Full Control**: 코드 레벨 완전 커스터마이징
- **High Performance**: Lighthouse 성능 점수 95+ 목표
- **Developer Experience**: 모던 웹 기술 스택 (Astro 5.0, React 18, Tailwind CSS)
- **Privacy First**: Google Sheets 기반 자체 RSVP 관리

### 프로젝트 타임라인

| Phase | 기간 | 목표 | 상태 |
|-------|------|------|------|
| **Sprint 0** | Week 1 (현재) | 기획 & 문서화 완료 | ✅ 완료 |
| **Sprint 1** | Week 2-3 (2주) | MVP 개발 (핵심 기능) | 🔜 다음 |
| **Sprint 2** | Week 4-5 (2주) | Enhancement & 테스트 | 📋 예정 |
| **Sprint 3** | Week 6-7 (2주) | 배포 & 커뮤니티 준비 | 📋 예정 |

### 주요 의사결정 사항

1. **기술 스택**: Astro 5.0 (SSG) 선택 ✅
   - 이유: 정적 사이트 특화, 최고의 성능, React 통합 가능
   - 대안: Next.js (과도한 기능), Vite+React (SSG 부족)

2. **RSVP 백엔드**: Google Sheets + Apps Script ✅
   - 이유: 무료, 간편한 관리, 별도 DB 불필요
   - 대안: Firebase (비용), Supabase (복잡도)

3. **디자인 컨셉**: Minimal Elegance ✅
   - 이유: 타임리스, 빠른 로딩, 다양한 취향 수용
   - 대안: Romantic Floral (취향 분열), Modern Bold (과도한 시각 요소)

---

## 기술 스택 상세

### Frontend Stack

| 기술 | 버전 | 선택 이유 |
|------|------|-----------|
| **Astro** | 5.0+ | 정적 사이트 생성, Islands Architecture, 최고의 성능 |
| **React** | 18+ | 인터랙티브 컴포넌트 (RSVP Form, Gallery), 풍부한 생태계 |
| **Tailwind CSS** | 3.4+ | 빠른 스타일링, 일관된 디자인 시스템, 최적화된 CSS |
| **TypeScript** | 5.0+ | 타입 안전성, 개발 생산성 향상 |

### Backend & Services

| 서비스 | 용도 | 비용 |
|--------|------|------|
| **GitHub Pages** | 정적 사이트 호스팅 | 무료 |
| **Google Sheets** | RSVP 데이터 저장 | 무료 |
| **Google Apps Script** | RSVP Webhook API | 무료 |
| **Kakao Maps API** | 지도 표시 | 무료 (쿼터 제한 내) |

### Development Tools

| 도구 | 용도 |
|------|------|
| **pnpm** | 패키지 관리 (빠른 설치, 디스크 절약) |
| **Vitest** | 단위 테스트 (Vite 네이티브 지원) |
| **Playwright** | E2E 테스트 (크로스 브라우저) |
| **Lighthouse CI** | 성능 모니터링 (자동화) |
| **GitHub Actions** | CI/CD 자동화 |
| **Biome** | 린터 & 포맷터 (Rust 기반, ESLint+Prettier 대체) |

> **기술 스택 상세 문서**: [docs/TECH_STACK.md](docs/TECH_STACK.md)

---

## Sprint 계획 상세

### Sprint 1: MVP 핵심 기능 개발 (Week 2-3)

**Sprint Goal**: "하객이 청첩장을 열람하고 참석 여부를 응답할 수 있는 최소 기능 완성"

#### 목표 및 성공 지표

- [ ] 모바일에서 청첩장 정보 확인 가능
- [ ] RSVP 폼 제출 성공률 90%+
- [ ] Google Sheets에 응답 데이터 저장
- [ ] Lighthouse Performance > 90

#### Sprint 1 태스크 (우선순위순)

| ID | Task | Story Points | Assignee | Status |
|----|------|--------------|----------|--------|
| **P0 - 필수** | | | | |
| S1-01 | Astro 프로젝트 초기화 & 환경 설정 | 3 | DevOps | Todo |
| S1-02 | 디자인 시스템 구축 (Tailwind 설정) | 5 | Frontend | Todo |
| S1-03 | Hero 섹션 컴포넌트 개발 | 5 | Frontend | Todo |
| S1-04 | Event Info 섹션 (날짜, 장소, 안내사항) | 5 | Frontend | Todo |
| S1-05 | Map 컴포넌트 (Kakao Maps 연동) | 8 | Frontend | Todo |
| S1-06 | RSVP Form 컴포넌트 (React) | 8 | Frontend | Todo |
| S1-07 | Google Sheets Apps Script Webhook 구현 | 8 | Backend | Todo |
| S1-08 | RSVP Form - Google Sheets 연동 | 5 | Fullstack | Todo |
| **P1 - 중요** | | | | |
| S1-09 | 반응형 레이아웃 (모바일/태블릿/데스크톱) | 5 | Frontend | Todo |
| S1-10 | 이미지 최적화 (WebP, lazy loading) | 3 | Frontend | Todo |
| S1-11 | Contact 버튼 (전화/문자 링크) | 2 | Frontend | Todo |
| **P2 - 선택** | | | | |
| S1-12 | 스크롤 애니메이션 (Intersection Observer) | 3 | Frontend | Todo |
| S1-13 | 오픈 그래프 메타 태그 (SNS 공유) | 2 | Frontend | Todo |

**Total Committed**: 62 story points (2주 = 4 days/week × 2 weeks = 8 working days)

#### Sprint 1 기술적 요구사항

**개발 환경 세팅**:
```bash
# 프로젝트 초기화
pnpm create astro@latest wedding-invitation --template minimal --typescript strict

# 의존성 설치
pnpm add react react-dom
pnpm add -D @astrojs/react @astrojs/tailwind tailwindcss
pnpm add -D vitest @playwright/test
pnpm add -D @biomejs/biome

# Astro 통합 추가
pnpm astro add react tailwind
```

**디렉토리 구조**:
```
src/
├── components/
│   ├── Hero.astro
│   ├── EventInfo.astro
│   ├── Map.tsx (React)
│   ├── RsvpForm.tsx (React)
│   └── Contact.astro
├── layouts/
│   └── Layout.astro
├── pages/
│   └── index.astro
├── styles/
│   └── global.css
└── config/
    └── site.config.ts
```

**성능 목표**:
- First Contentful Paint (FCP): < 1.5초
- Largest Contentful Paint (LCP): < 2.5초
- Total Blocking Time (TBT): < 300ms
- Cumulative Layout Shift (CLS): < 0.1

#### Sprint 1 리스크 및 완화 전략

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Kakao Maps API 쿼터 초과 | Low | Medium | 클라이언트 사이드 캐싱, API 키 분리 |
| Google Sheets API 응답 지연 | Medium | High | Apps Script 최적화, 클라이언트 로딩 상태 표시 |
| 모바일 브라우저 호환성 이슈 | Medium | Medium | BrowserStack 크로스 브라우저 테스트 |
| 이미지 최적화 미흡으로 성능 저하 | High | High | Sharp 기반 빌드 타임 이미지 처리, WebP + fallback |

---

### Sprint 2: Enhancement & 품질 향상 (Week 4-5)

**Sprint Goal**: "사용자 경험을 개선하고 추가 기능으로 차별화"

#### 목표 및 성공 지표

- [ ] 갤러리 기능 추가 (사진 10장 이상)
- [ ] 테마 시스템 구현 (3가지 컬러 테마)
- [ ] Lighthouse Performance > 95
- [ ] E2E 테스트 커버리지 80%+

#### Sprint 2 태스크

| ID | Task | Story Points | Priority |
|----|------|--------------|----------|
| S2-01 | 갤러리 컴포넌트 (React) | 8 | P0 |
| S2-02 | 이미지 Lightbox 모달 | 5 | P0 |
| S2-03 | 테마 시스템 (CSS Variables) | 5 | P1 |
| S2-04 | 테마 전환 UI | 3 | P1 |
| S2-05 | 다국어 지원 (한/영) | 8 | P1 |
| S2-06 | Calendar 버튼 (Add to Calendar) | 3 | P2 |
| S2-07 | 방명록 기능 (Google Sheets) | 13 | P2 |
| S2-08 | E2E 테스트 (Playwright) | 8 | P0 |
| S2-09 | Unit 테스트 (Vitest) | 5 | P1 |
| S2-10 | 성능 최적화 (Code splitting) | 5 | P0 |

**Total**: 63 story points

#### Sprint 2 기술 요구사항

**갤러리 구현**:
- Masonry 레이아웃 (react-masonry-css)
- Lazy loading (Intersection Observer API)
- Image optimization (Sharp + Astro Image)

**테마 시스템**:
```css
/* CSS Variables */
:root[data-theme="minimal-elegance"] {
  --color-primary: #2C3E50;
  --color-accent: #D4AF37;
  --font-heading: 'Cormorant Garamond', serif;
}

:root[data-theme="romantic-floral"] {
  --color-primary: #C9A9A6;
  --color-accent: #E8B4B8;
  --font-heading: 'Great Vibes', cursive;
}
```

**다국어 설정**:
```typescript
// src/config/i18n.ts
export const languages = {
  ko: {
    hero: {
      greeting: "결혼합니다",
      bride: "신부",
      groom: "신랑"
    }
  },
  en: {
    hero: {
      greeting: "We're Getting Married",
      bride: "Bride",
      groom: "Groom"
    }
  }
}
```

---

### Sprint 3: 배포 & 커뮤니티 준비 (Week 6-7)

**Sprint Goal**: "프로덕션 배포 완료 및 오픈소스 프로젝트 공개"

#### 목표 및 성공 지표

- [ ] GitHub Pages 자동 배포 설정
- [ ] 커스텀 도메인 연결 (선택)
- [ ] 문서화 완료 (README, 가이드)
- [ ] GitHub Star 10+ 획득

#### Sprint 3 태스크

| ID | Task | Story Points | Priority |
|----|------|--------------|----------|
| S3-01 | GitHub Actions 워크플로우 설정 | 5 | P0 |
| S3-02 | 환경 변수 관리 (.env 가이드) | 3 | P0 |
| S3-03 | 커스텀 도메인 설정 가이드 | 2 | P1 |
| S3-04 | README.md 완성 (설치, 사용법) | 5 | P0 |
| S3-05 | QUICK_START.md 작성 | 3 | P0 |
| S3-06 | CONFIG_GUIDE.md (설정 커스터마이징) | 5 | P0 |
| S3-07 | Google Sheets 연동 가이드 | 5 | P0 |
| S3-08 | 기여 가이드 업데이트 | 3 | P1 |
| S3-09 | 이슈/PR 템플릿 생성 | 2 | P1 |
| S3-10 | 쇼케이스 페이지 (실사용 예제) | 8 | P2 |
| S3-11 | PWA 설정 (Manifest, Service Worker) | 8 | P2 |

**Total**: 49 story points

#### Sprint 3 배포 요구사항

**GitHub Actions Workflow**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Astro Config**:
```typescript
// astro.config.mjs
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/wedding-invitation', // 프로젝트 리포지토리 이름
  output: 'static',
  integrations: [react(), tailwind()],
  build: {
    assets: 'assets'
  }
});
```

---

## 리스크 관리 계획

### 프로젝트 전체 리스크

| ID | Risk | Category | P | I | Severity | Mitigation | Contingency | Owner | Status |
|----|------|----------|---|---|----------|------------|-------------|-------|--------|
| R-001 | 개발 리소스 부족 (1인 개발) | Resource | H | H | 🔴 Critical | MVP 범위 축소, P2 태스크 연기 | 외부 기여자 모집 | PM | Active |
| R-002 | Google Sheets API 제한/중단 | Technical | L | H | 🟡 Medium | API 쿼터 모니터링, 캐싱 | 대체 백엔드 (Supabase) 검토 | Backend | Monitoring |
| R-003 | 성능 목표 미달성 | Quality | M | M | 🟡 Medium | 지속적 Lighthouse CI, 조기 최적화 | 일부 기능 제거/간소화 | Frontend | Active |
| R-004 | 브라우저 호환성 이슈 | Technical | M | M | 🟡 Medium | Playwright 크로스 브라우저 테스트 | Polyfill 추가, fallback UI | Frontend | Monitoring |
| R-005 | 커뮤니티 관심 부족 | Market | M | L | 🟢 Low | SNS 홍보, Dev.to 포스팅 | 개인 프로젝트로 전환 | Marketing | Accepted |
| R-006 | 보안 취약점 (XSS, CSRF) | Security | L | H | 🟡 Medium | React 기본 보호, CSP 헤더 | 보안 패치 긴급 배포 | Security | Monitoring |

**Severity Levels**:
- 🔴 **Critical**: 즉각 대응 필요
- 🟡 **Medium**: 적극적 모니터링
- 🟢 **Low**: 수용 가능

---

## 의사결정 기록 및 권장 사항

### 주요 의사결정

#### ✅ Decision 1: Astro vs Next.js

**Context**: 정적 청첩장 사이트에 적합한 프레임워크 선택

**Options**:
1. Astro 5.0 - SSG 특화, Islands Architecture
2. Next.js 15 - Full-stack, App Router, 대중적
3. Vite + React - 단순, SSG 플러그인 필요

**Decision**: **Astro 5.0 선택** ✅

**Rationale**:
- 정적 사이트에 최적화된 성능 (Zero JS by default)
- React 필요 부분만 선택적 hydration (Islands)
- GitHub Pages 배포 간소 (공식 Action 지원)
- 학습 곡선 낮음 (HTML-like 문법)

**Consequences**:
- ✅ Lighthouse 95+ 달성 가능성 높음
- ✅ 빌드 시간 단축 (SSG 최적화)
- ⚠️ Astro 생태계가 Next.js보다 작음
- ⚠️ 복잡한 인터랙션은 React/Vue 필요

> **상세 ADR**: [docs/architecture/ADR-001-astro-framework.md](docs/architecture/ADR-001-astro-framework.md)

---

#### ✅ Decision 2: Google Sheets vs Firebase

**Context**: RSVP 응답 데이터 저장소 선택

**Options**:
1. Google Sheets + Apps Script - 무료, 간단
2. Firebase Firestore - 실시간 DB, Google 생태계
3. Supabase - 오픈소스, PostgreSQL

**Decision**: **Google Sheets + Apps Script** ✅

**Rationale**:
- 완전 무료 (Firebase는 쿼터 초과 시 과금)
- 비개발자도 쉽게 데이터 확인/관리
- Apps Script로 간단한 Webhook 구현 가능
- 별도 DB 서버 불필요

**Consequences**:
- ✅ 제로 비용 유지
- ✅ 엑셀처럼 직관적인 데이터 관리
- ⚠️ 실시간 업데이트 어려움
- ⚠️ 대용량 트래픽 처리 제한 (분당 요청 제한)

---

#### ✅ Decision 3: Minimal Elegance 디자인 컨셉

**Context**: 청첩장 기본 디자인 테마 선택

**Options**:
1. Minimal Elegance - 타임리스, 심플
2. Romantic Floral - 화사한 꽃 패턴
3. Modern Bold - 대담한 타이포, 그라데이션

**Decision**: **Minimal Elegance** ✅

**Rationale**:
- 유행을 타지 않는 디자인 (10년 후에도 세련됨)
- 성능 최적화 (무거운 이미지/애니메이션 최소)
- 다양한 취향 수용 가능
- 커스터마이징 용이 (테마 시스템으로 확장)

**Consequences**:
- ✅ 빠른 로딩 속도
- ✅ 모든 연령대 하객에게 적합
- ⚠️ 화려함을 원하는 사용자 불만 가능
- ✅ 해결책: 테마 시스템으로 대안 제공

---

### 권장 사항 (Recommendations)

#### 🔥 High Priority

1. **Sprint 1 범위 엄격 관리**
   - P0 태스크만 집중 (62 story points → 50 points로 축소 권장)
   - S1-12, S1-13은 Sprint 2로 이동 고려

2. **조기 성능 모니터링**
   - Sprint 1 Week 1부터 Lighthouse CI 설정
   - 매 PR마다 자동 성능 체크

3. **Google Sheets API 테스트**
   - Sprint 1 Day 1에 Apps Script Webhook 프로토타입 작성
   - CORS, 응답 시간 조기 검증

#### 💡 Medium Priority

4. **디자인 시스템 우선 구축**
   - Tailwind 설정 완료 후 컴포넌트 개발 시작
   - Figma/Storybook 스킵하고 코드로 직접

5. **문서화 지속 업데이트**
   - 각 Sprint 종료 시 README 업데이트
   - CHANGELOG 자동 생성 (conventional commits)

6. **커뮤니티 조기 준비**
   - Sprint 2 시작 전 GitHub Discussions 오픈
   - 첫 MVP 완성 시 Dev.to 포스팅

---

## 다음 단계 액션 아이템

### Immediate (이번 주 내)

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Sprint 1 Kickoff 미팅 | PM | 2025-10-20 | 🔜 Pending |
| Astro 프로젝트 초기화 | DevOps | 2025-10-20 | 🔜 Pending |
| GitHub Project Board 생성 | PM | 2025-10-20 | 🔜 Pending |
| Tailwind 디자인 시스템 설정 | Frontend | 2025-10-21 | 🔜 Pending |
| Google Apps Script Webhook 프로토타입 | Backend | 2025-10-22 | 🔜 Pending |
| Lighthouse CI GitHub Action 추가 | DevOps | 2025-10-22 | 🔜 Pending |

### Short-term (Sprint 1 기간)

- [ ] Hero, EventInfo, Map, RSVP 컴포넌트 개발
- [ ] Google Sheets 연동 완료
- [ ] 모바일 반응형 레이아웃 완성
- [ ] 성능 최적화 (이미지, lazy loading)
- [ ] Unit 테스트 작성 (핵심 컴포넌트)

### Mid-term (Sprint 2-3 기간)

- [ ] 갤러리, 테마, 다국어 기능 추가
- [ ] E2E 테스트 80% 커버리지
- [ ] GitHub Pages 자동 배포
- [ ] 문서화 완료 (가이드 5개 이상)
- [ ] 커뮤니티 공개 (GitHub Star 10+ 목표)

---

## 부록

### 참고 문서

- [PRD (Product Requirements Document)](PRD_모바일청첩장.md)
- [기술 스택 상세](docs/TECH_STACK.md)
- [아키텍처 개요](docs/architecture/OVERVIEW.md)
- [디자인 시스템](docs/design/DESIGN_SYSTEM.md)
- [배포 가이드](docs/development/DEPLOYMENT.md)

### 외부 리소스

- [Astro Documentation](https://docs.astro.build)
- [GitHub Pages Deployment Guide](https://docs.astro.build/en/guides/deploy/github/)
- [Google Apps Script Webhooks](https://developers.google.com/apps-script/guides/web)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Last Updated**: 2025-10-18
**Next Review**: Sprint 1 종료 시 (2025-11-03 예정)
**Document Owner**: Project Manager

---

**Navigation**: [← README](README.md) | [기술 스택 →](docs/TECH_STACK.md) | [Architecture →](docs/architecture/OVERVIEW.md)
