# 📋 프로젝트 마스터 플랜 (Master Plan)

**프로젝트명**: GitHub Pages 모바일 청첩장
**버전**: 1.0
**최종 업데이트**: 2025-10-18
**상태**: 🟢 Active (Phase 4 Complete - 문서화 완료)

---

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [문서 통합 인덱스](#문서-통합-인덱스)
- [역할별 읽어야 할 문서](#역할별-읽어야-할-문서)
- [개발 로드맵](#개발-로드맵)
- [Sprint별 체크리스트](#sprint별-체크리스트)
- [빠른 참조](#빠른-참조)

---

## 프로젝트 개요

### Vision (비전)

> "개발자가 만드는, 무료이면서 아름다운 모바일 청첩장"

### Mission (미션)

GitHub Pages와 최신 웹 기술을 활용하여 **완전 무료**, **고성능**, **커스터마이징 가능**한 오픈소스 청첩장 플랫폼을 구축합니다.

### Core Values (핵심 가치)

1. **Zero Cost** 💰: 모든 서비스 무료 (GitHub Pages, Google Sheets)
2. **High Performance** ⚡: Lighthouse 95+ 목표, 모바일 최적화
3. **Developer Experience** 🎯: 모던 기술 스택, 간편한 설정
4. **Open Source** 🌐: 커뮤니티 기여 환영, MIT 라이선스

### Success Metrics (성공 지표)

| Metric | Target (MVP) | Target (3 Months) | Status |
|--------|--------------|-------------------|--------|
| Lighthouse Performance | > 90 | > 95 | 📋 TBD |
| 초기 로딩 시간 (3G) | < 3초 | < 2초 | 📋 TBD |
| GitHub Stars | - | 100+ | 📋 TBD |
| 실사용 케이스 | 1건 (자체) | 20건 | 📋 TBD |

---

## 문서 통합 인덱스

### 📁 전체 문서 구조

```
wedding-invitation/
├── 📄 README.md                          # 프로젝트 소개
├── 📄 MASTER_PLAN.md                     # ⭐ 이 문서 (통합 가이드)
├── 📄 PROJECT_PLAN.md                    # 실행 계획서
├── 📄 PRD_모바일청첩장.md                 # 제품 요구사항 문서
├── 📄 CONTRIBUTING.md                    # 기여 가이드
│
└── docs/
    ├── 📄 INDEX.md                       # 문서 인덱스
    ├── 📄 TECH_STACK.md                  # 기술 스택 상세
    │
    ├── architecture/
    │   ├── OVERVIEW.md                   # 아키텍처 개요
    │   └── ADR-001-astro-framework.md    # 기술 결정 기록
    │
    ├── design/
    │   └── DESIGN_SYSTEM.md              # 디자인 시스템
    │
    ├── api/
    │   └── RSVP_API.md                   # RSVP API 명세
    │
    └── development/
        ├── QUICK_START.md                # ⭐ 빠른 시작 가이드
        └── DEPLOYMENT.md                 # ⭐ 배포 가이드
```

### 📊 문서 통계

- **총 문서 수**: 18개
- **주요 문서**: 10개 (MASTER_PLAN, PROJECT_PLAN, QUICK_START 등)
- **보조 문서**: 8개 (기존 문서)
- **최근 추가**: 10개 (2025-10-18)

---

## 역할별 읽어야 할 문서

### 👤 프로젝트 관리자 (PM)

**필수 읽기**:
1. ⭐ **MASTER_PLAN.md** (이 문서)
2. [PROJECT_PLAN.md](/Users/changbum/workplace/wedding_invitation/PROJECT_PLAN.md)
   - Executive Summary
   - Sprint 1-3 계획
   - 리스크 관리
3. [PRD_모바일청첩장.md](/Users/changbum/workplace/wedding_invitation/PRD_모바일청첩장.md)
   - User Stories
   - Success Metrics

**참고 문서**:
- [docs/INDEX.md](/Users/changbum/workplace/wedding_invitation/docs/INDEX.md) - 전체 문서 네비게이션

---

### 💻 개발자 (Frontend/Fullstack)

**빠른 시작** (5분):
1. ⭐ [QUICK_START.md](/Users/changbum/workplace/wedding_invitation/docs/development/QUICK_START.md)
   - 프로젝트 클론
   - 로컬 실행
   - `site.config.ts` 수정

**기술 이해** (30분):
2. [TECH_STACK.md](/Users/changbum/workplace/wedding_invitation/docs/TECH_STACK.md)
   - Astro, React, Tailwind 선택 이유
   - 성능 벤치마크
3. [architecture/OVERVIEW.md](/Users/changbum/workplace/wedding_invitation/docs/architecture/OVERVIEW.md)
   - Islands Architecture
   - 컴포넌트 구조
   - 데이터 플로우
4. [architecture/ADR-001-astro-framework.md](/Users/changbum/workplace/wedding_invitation/docs/architecture/ADR-001-astro-framework.md)
   - Astro vs Next.js 비교
   - 의사결정 배경

**개발 가이드**:
5. [DESIGN_SYSTEM.md](/Users/changbum/workplace/wedding_invitation/docs/design/DESIGN_SYSTEM.md)
   - 색상, 타이포그래피
   - 컴포넌트 스타일
6. [RSVP_API.md](/Users/changbum/workplace/wedding_invitation/docs/api/RSVP_API.md)
   - Google Sheets 연동
   - Apps Script 코드

**배포**:
7. ⭐ [DEPLOYMENT.md](/Users/changbum/workplace/wedding_invitation/docs/development/DEPLOYMENT.md)
   - GitHub Actions 설정
   - 커스텀 도메인 연결

---

### 🎨 디자이너

**필수 읽기**:
1. [DESIGN_SYSTEM.md](/Users/changbum/workplace/wedding_invitation/docs/design/DESIGN_SYSTEM.md)
   - Minimal Elegance 컨셉
   - 색상 팔레트
   - 타이포그래피 스케일
   - 반응형 브레이크포인트

**참고 문서**:
2. [PRD_모바일청첩장.md](/Users/changbum/workplace/wedding_invitation/PRD_모바일청첩장.md) - UI/UX 요구사항
3. [architecture/OVERVIEW.md](/Users/changbum/workplace/wedding_invitation/docs/architecture/OVERVIEW.md) - 컴포넌트 구조

---

### 🚀 DevOps / 배포 담당자

**필수 읽기**:
1. ⭐ [DEPLOYMENT.md](/Users/changbum/workplace/wedding_invitation/docs/development/DEPLOYMENT.md)
   - GitHub Pages 설정
   - GitHub Actions 워크플로우
   - 환경 변수 관리
   - 커스텀 도메인 연결

**참고 문서**:
2. [TECH_STACK.md](/Users/changbum/workplace/wedding_invitation/docs/TECH_STACK.md) - 배포 도구 (pnpm, Biome)
3. [architecture/OVERVIEW.md](/Users/changbum/workplace/wedding_invitation/docs/architecture/OVERVIEW.md) - 배포 파이프라인

---

### 🆕 신규 기여자

**1단계: 프로젝트 이해 (10분)**
1. [README.md](/Users/changbum/workplace/wedding_invitation/README.md) - 프로젝트 소개
2. [MASTER_PLAN.md](/Users/changbum/workplace/wedding_invitation/MASTER_PLAN.md) - 이 문서

**2단계: 개발 환경 구축 (20분)**
3. ⭐ [QUICK_START.md](/Users/changbum/workplace/wedding_invitation/docs/development/QUICK_START.md)

**3단계: 기여 방법 학습 (10분)**
4. [CONTRIBUTING.md](/Users/changbum/workplace/wedding_invitation/CONTRIBUTING.md)

**총 소요 시간**: 약 40분

---

## 개발 로드맵

### 타임라인 개요

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Sprint 0   │  Sprint 1   │  Sprint 2   │  Sprint 3   │
│   Week 1    │  Week 2-3   │  Week 4-5   │  Week 6-7   │
├─────────────┼─────────────┼─────────────┼─────────────┤
│   기획 &    │  MVP 개발   │ Enhancement │  배포 &     │
│   문서화    │  (핵심기능) │  (추가기능) │ 커뮤니티    │
└─────────────┴─────────────┴─────────────┴─────────────┘
     ✅             🔜             📋             📋
   완료          다음         예정          예정
```

### Sprint 0: 기획 & 문서화 (Week 1) ✅ 완료

**목표**: 프로젝트 계획 및 문서 체계 구축

**완료 항목**:
- ✅ PRD 작성 (제품 요구사항 문서)
- ✅ PROJECT_PLAN 작성 (실행 계획서)
- ✅ TECH_STACK 문서 작성
- ✅ 아키텍처 설계 (OVERVIEW, ADR-001)
- ✅ 디자인 시스템 정의 (DESIGN_SYSTEM)
- ✅ API 명세 작성 (RSVP_API)
- ✅ 개발 가이드 작성 (QUICK_START, DEPLOYMENT)
- ✅ MASTER_PLAN 작성 (통합 인덱스)

**Outcome**: 프로젝트 기반 완성, 개발 시작 준비 완료

---

### Sprint 1: MVP 핵심 기능 개발 (Week 2-3) 🔜 다음

**Sprint Goal**: "하객이 청첩장을 열람하고 참석 여부를 응답할 수 있는 최소 기능 완성"

**주요 태스크** (62 story points):

| Priority | Task | Story Points | Status |
|----------|------|--------------|--------|
| **P0 - 필수** | | | |
| S1-01 | Astro 프로젝트 초기화 & 환경 설정 | 3 | 📋 Todo |
| S1-02 | 디자인 시스템 구축 (Tailwind 설정) | 5 | 📋 Todo |
| S1-03 | Hero 섹션 컴포넌트 개발 | 5 | 📋 Todo |
| S1-04 | Event Info 섹션 (날짜, 장소, 안내사항) | 5 | 📋 Todo |
| S1-05 | Map 컴포넌트 (Kakao Maps 연동) | 8 | 📋 Todo |
| S1-06 | RSVP Form 컴포넌트 (React) | 8 | 📋 Todo |
| S1-07 | Google Sheets Apps Script Webhook 구현 | 8 | 📋 Todo |
| S1-08 | RSVP Form - Google Sheets 연동 | 5 | 📋 Todo |
| S1-09 | 반응형 레이아웃 (모바일/태블릿/데스크톱) | 5 | 📋 Todo |
| S1-10 | 이미지 최적화 (WebP, lazy loading) | 3 | 📋 Todo |
| S1-11 | Contact 버튼 (전화/문자 링크) | 2 | 📋 Todo |

**Success Criteria**:
- [ ] 모바일에서 청첩장 정보 확인 가능
- [ ] RSVP 폼 제출 성공률 90%+
- [ ] Google Sheets에 응답 데이터 저장 확인
- [ ] Lighthouse Performance > 90

**Deliverables**:
- 작동하는 MVP 웹사이트
- GitHub Pages 첫 배포
- Unit 테스트 (핵심 컴포넌트)

---

### Sprint 2: Enhancement & 품질 향상 (Week 4-5) 📋 예정

**Sprint Goal**: "사용자 경험을 개선하고 추가 기능으로 차별화"

**주요 기능** (63 story points):
- 갤러리 컴포넌트 (이미지 그리드, Lightbox)
- 테마 시스템 (3가지 컬러 테마)
- 다국어 지원 (한/영)
- 방명록 기능 (Google Sheets)
- E2E 테스트 (Playwright)
- 성능 최적화 (Code splitting)

**Success Criteria**:
- [ ] Lighthouse Performance > 95
- [ ] E2E 테스트 커버리지 80%+
- [ ] 3가지 테마 전환 가능

---

### Sprint 3: 배포 & 커뮤니티 준비 (Week 6-7) 📋 예정

**Sprint Goal**: "프로덕션 배포 완료 및 오픈소스 프로젝트 공개"

**주요 작업** (49 story points):
- GitHub Actions 워크플로우 설정
- 문서화 완료 (README, 가이드)
- 커스텀 도메인 설정 가이드
- 쇼케이스 페이지 (실사용 예제)
- PWA 설정 (Manifest, Service Worker)

**Success Criteria**:
- [ ] GitHub Pages 자동 배포 완료
- [ ] 문서 5개 이상 작성
- [ ] GitHub Star 10+ 획득

---

## Sprint별 체크리스트

### ✅ Sprint 0 체크리스트 (완료)

#### 기획 문서
- [x] PRD 작성 (66KB, 1,696줄)
- [x] PROJECT_PLAN 작성 (Sprint 1-3 계획)
- [x] TECH_STACK 문서 작성 (기술 선택 이유)
- [x] MASTER_PLAN 작성 (통합 인덱스)

#### 기술 문서
- [x] 아키텍처 개요 (OVERVIEW.md)
- [x] ADR-001: Astro Framework 선택
- [x] 디자인 시스템 명세 (색상, 타이포, 컴포넌트)
- [x] RSVP API 명세 (Google Sheets 연동)

#### 개발 가이드
- [x] QUICK_START.md (클론부터 로컬 실행까지)
- [x] DEPLOYMENT.md (GitHub Pages 배포)

#### 문서 정리
- [x] INDEX.md 업데이트 (18개 문서 인덱싱)
- [x] MASTER_PLAN.md 작성 (역할별 가이드)
- [x] .docmap.json 업데이트 (문서 메타데이터)

---

### 📋 Sprint 1 체크리스트 (다음 단계)

#### 환경 설정
- [ ] Astro 프로젝트 초기화 (`pnpm create astro@latest`)
- [ ] GitHub 저장소 생성 및 초기 커밋
- [ ] Tailwind CSS 설정 및 디자인 토큰 정의
- [ ] GitHub Project Board 생성

#### 정적 컴포넌트 개발 (Astro)
- [ ] `src/layouts/Layout.astro` - 메인 레이아웃
- [ ] `src/components/Hero.astro` - Hero 섹션
- [ ] `src/components/EventInfo.astro` - 이벤트 정보
- [ ] `src/components/Contact.astro` - 연락처 버튼

#### 인터랙티브 컴포넌트 개발 (React Islands)
- [ ] `src/components/Map.tsx` - Kakao Maps 연동
- [ ] `src/components/RsvpForm.tsx` - RSVP 폼

#### Backend 설정
- [ ] Google Sheets 생성 (RSVP 시트)
- [ ] Apps Script Webhook 구현 및 배포
- [ ] 환경 변수 설정 (`.env`, GitHub Secrets)

#### 테스트
- [ ] Unit 테스트 작성 (Vitest)
- [ ] RSVP 제출 테스트 (수동)

#### 성능 최적화
- [ ] 이미지 최적화 (WebP + JPEG fallback)
- [ ] Lazy loading 구현
- [ ] Lighthouse CI 설정

#### 배포
- [ ] GitHub Actions 워크플로우 생성
- [ ] GitHub Pages 첫 배포
- [ ] 모바일 테스트 (iOS, Android)

---

### 📋 Sprint 2 체크리스트 (예정)

#### 추가 기능
- [ ] 갤러리 컴포넌트 (Masonry 레이아웃)
- [ ] Lightbox 모달
- [ ] 테마 전환 UI
- [ ] 다국어 지원 (i18n)
- [ ] Calendar 버튼 (Add to Calendar)
- [ ] 방명록 기능

#### 테스트
- [ ] E2E 테스트 (Playwright)
- [ ] 크로스 브라우저 테스트
- [ ] 성능 회귀 테스트

#### 최적화
- [ ] Code splitting
- [ ] Tree shaking
- [ ] CSS 최적화

---

### 📋 Sprint 3 체크리스트 (예정)

#### 문서화
- [ ] README.md 완성 (설치, 사용법)
- [ ] CONFIG_GUIDE.md (설정 커스터마이징)
- [ ] Google Sheets 연동 가이드
- [ ] 기여 가이드 업데이트

#### 커뮤니티
- [ ] 이슈/PR 템플릿 생성
- [ ] GitHub Discussions 오픈
- [ ] 쇼케이스 페이지 (실사용 예제)
- [ ] Dev.to 포스팅

#### PWA (선택 사항)
- [ ] Manifest.json 생성
- [ ] Service Worker 구현
- [ ] 오프라인 모드

---

## 빠른 참조

### 🔗 중요 링크

| 링크 | 설명 |
|------|------|
| [MASTER_PLAN.md](MASTER_PLAN.md) | 이 문서 (프로젝트 통합 가이드) |
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | 실행 계획서 (Sprint 상세) |
| [QUICK_START.md](docs/development/QUICK_START.md) | 빠른 시작 가이드 |
| [DEPLOYMENT.md](docs/development/DEPLOYMENT.md) | 배포 가이드 |
| [docs/INDEX.md](docs/INDEX.md) | 문서 인덱스 |

### 📞 연락처 및 리소스

- **GitHub Repository**: [github.com/yourusername/wedding-invitation](https://github.com/yourusername/wedding-invitation)
- **Issues**: [Issues 페이지](https://github.com/yourusername/wedding-invitation/issues)
- **Discussions**: [Discussions 페이지](https://github.com/yourusername/wedding-invitation/discussions)

### 🛠️ 개발 명령어 치트시트

```bash
# 프로젝트 클론 및 설치
git clone https://github.com/yourusername/wedding-invitation.git
cd wedding-invitation
pnpm install

# 로컬 개발 서버 실행
pnpm dev                    # http://localhost:4321

# 빌드 (프로덕션)
pnpm build                  # 출력: dist/

# 빌드 미리보기
pnpm preview                # http://localhost:4321

# 테스트
pnpm test                   # Vitest (단위 테스트)
pnpm test:e2e               # Playwright (E2E)

# 린트 & 포맷
pnpm lint                   # Biome 린트
pnpm format                 # Biome 포맷
```

### 📁 핵심 파일 경로

| 파일 | 경로 | 용도 |
|------|------|------|
| **사이트 설정** | `src/config/site.config.ts` | 신랑신부 정보, 예식 정보 |
| **환경 변수** | `.env` | API 키, Webhook URL |
| **Astro 설정** | `astro.config.mjs` | 프레임워크 설정 |
| **Tailwind 설정** | `tailwind.config.cjs` | 디자인 토큰 |
| **배포 워크플로우** | `.github/workflows/deploy.yml` | GitHub Actions |

### 🎨 디자인 토큰 (Quick Reference)

```css
/* 색상 */
--color-primary-500: #2C3E50;   /* Navy */
--color-accent-500: #D4AF37;    /* Gold */
--color-neutral-700: #44403c;   /* Gray */

/* 폰트 */
--font-heading: 'Cormorant Garamond', serif;
--font-body: 'Inter', sans-serif;

/* 스페이싱 */
--spacing-4: 1rem;    /* 16px */
--spacing-8: 2rem;    /* 32px */
--spacing-12: 3rem;   /* 48px */
```

### 🔧 트러블슈팅 Quick Fix

| 문제 | 해결 |
|------|------|
| `pnpm: command not found` | `npm install -g pnpm` |
| 모듈 없음 에러 | `rm -rf node_modules && pnpm install` |
| 포트 4321 사용 중 | `pnpm dev --port 3000` |
| 이미지 안 보임 | 경로 확인: `/images/cover.jpg` (절대 경로) |
| RSVP 제출 실패 | GitHub Secrets 확인 (`RSVP_WEBHOOK_URL`) |

---

## 다음 단계 (Next Steps)

### 즉시 실행 (Immediate Actions)

1. ✅ **Sprint 0 완료 확인** - 모든 문서 작성 완료
2. 🔜 **Sprint 1 Kickoff 미팅** - 2025-10-20 예정
3. 🔜 **Astro 프로젝트 초기화** - 첫 커밋
4. 🔜 **GitHub Project Board 생성** - 태스크 트래킹

### 이번 주 목표 (This Week)

- [ ] Sprint 1 태스크 분배
- [ ] 개발 환경 설정 완료
- [ ] Hero + EventInfo 컴포넌트 완성

### 이번 달 목표 (This Month)

- [ ] Sprint 1 완료 (MVP 배포)
- [ ] 첫 사용자 피드백 수집
- [ ] Sprint 2 계획

---

## 문서 업데이트 로그

| 날짜 | 변경사항 | 작성자 |
|------|----------|--------|
| 2025-10-18 | MASTER_PLAN 초안 작성 | Project Leader |
| 2025-10-18 | 18개 문서 통합 인덱싱 완료 | Librarian |
| 2025-10-18 | Sprint 0 체크리스트 완료 표시 | PM |

---

**Navigation**: [README →](README.md) | [PROJECT_PLAN →](PROJECT_PLAN.md) | [QUICK_START →](docs/development/QUICK_START.md) | [INDEX →](docs/INDEX.md)

---

**📌 이 문서는 프로젝트의 "북극성"입니다. 길을 잃었다면 여기로 돌아오세요!**
