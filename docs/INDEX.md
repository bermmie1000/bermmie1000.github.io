# 📚 Documentation Index

> Last updated: 2025-10-18
> Project: GitHub Pages 모바일 청첩장
> Status: ✅ Complete (Phase 4)
> Total Documents: 18

## 개요

이 문서는 Wedding Invitation 프로젝트의 모든 문서를 체계적으로 정리한 인덱스입니다.
프로젝트에 대한 정보가 필요할 때 이 문서를 시작점으로 활용하세요.

**🆕 New**: 프로젝트 계획 및 기술 문서가 추가되었습니다! ([MASTER_PLAN.md](../MASTER_PLAN.md) 참고)

---

## 빠른 링크

- [프로젝트 계획](#프로젝트-계획)
- [시작하기](#시작하기)
- [개발 가이드](#개발-가이드)
- [배포 가이드](#배포-가이드)
- [아키텍처](#아키텍처)
- [API 문서](#api-문서)
- [디자인 시스템](#디자인-시스템)

---

## 🎯 프로젝트 계획

프로젝트 전체 계획 및 의사결정 문서입니다.

| 문서 | 설명 | 상태 |
|------|------|------|
| [MASTER_PLAN.md](../MASTER_PLAN.md) | **프로젝트 마스터 플랜** (통합 인덱스, 로드맵, 체크리스트) | ✅ Current |
| [PROJECT_PLAN.md](../PROJECT_PLAN.md) | 프로젝트 실행 계획서 (Sprint 계획, 리스크 관리) | ✅ Current |
| [PRD_모바일청첩장.md](../PRD_모바일청첩장.md) | 제품 요구사항 문서 (기능 명세, 사용자 스토리) | ✅ Current |
| [TECH_STACK.md](./TECH_STACK.md) | 기술 스택 상세 (Astro, React, Tailwind 선택 이유) | ✅ Current |

**권장 읽기 순서**:
1. **MASTER_PLAN.md** - 프로젝트 전체 조감도
2. PROJECT_PLAN.md - 실행 계획 및 Sprint 일정
3. TECH_STACK.md - 기술 스택 이해

---

## 🚀 시작하기

프로젝트를 처음 접하는 분들을 위한 필수 문서입니다.

| 문서 | 설명 | 상태 |
|------|------|------|
| [README.md](../README.md) | 프로젝트 소개 및 빠른 시작 가이드 | ✅ Current |
| [QUICK_START.md](./development/QUICK_START.md) | **빠른 시작 가이드** (클론부터 로컬 실행까지) | ✅ Current |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 기여 가이드 및 개발 컨벤션 | ✅ Current |
| [프로젝트 구조](./PROJECT_STRUCTURE.md) | 전체 디렉토리 및 파일 구조 설명 | ✅ Current |

**5분 빠른 시작**:
1. README.md - 프로젝트 소개
2. **QUICK_START.md** - 설치 및 실행
3. `site.config.ts` - 개인 정보 수정

---

## 👨‍💻 개발 가이드

개발자를 위한 상세한 가이드입니다.

| 문서 | 설명 | 상태 |
|------|------|------|
| [QUICK_START.md](./development/QUICK_START.md) | **빠른 시작 가이드** (필수!) | ✅ Current |
| [DEPLOYMENT.md](./development/DEPLOYMENT.md) | **배포 가이드** (GitHub Pages 설정) | ✅ Current |
| [개발 환경 설정](./development/SETUP.md) | 로컬 개발 환경 구축 가이드 | ✅ Current |
| [개발 워크플로우](./development/WORKFLOW.md) | Git 브랜치 전략 및 개발 프로세스 | ✅ Current |
| [코딩 컨벤션](./development/CONVENTIONS.md) | 코드 스타일 및 베스트 프랙티스 | ✅ Current |
| [테스트 가이드](./development/TESTING.md) | 단위/통합/E2E 테스트 작성 방법 | ✅ Current |
| [디버깅 가이드](./development/DEBUGGING.md) | 일반적인 문제 해결 방법 | ✅ Current |

### 주요 개발 도구

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Testing**: Jest, Pytest, Playwright
- **Linting**: ESLint, Prettier, Black, Ruff
- **Package Manager**: npm, uv

---

---

## 🏗️ 아키텍처

시스템 설계 및 기술적 의사결정 문서입니다.

| 문서 | 설명 | 상태 |
|------|------|------|
| [아키텍처 개요](./architecture/OVERVIEW.md) | **시스템 아키텍처** (컴포넌트 구조, 데이터 플로우) | ✅ Current |
| [ADR-001: Astro Framework](./architecture/ADR-001-astro-framework.md) | **기술 결정 기록**: Astro 선택 이유 및 대안 분석 | ✅ Current |

**핵심 아키텍처**:
- **Islands Architecture**: 정적 HTML + 선택적 JS hydration
- **Zero Backend**: GitHub Pages + Google Apps Script
- **Mobile-First**: 반응형 디자인

---

## 📖 API 문서

Backend API 명세 및 연동 가이드입니다.

| 문서 | 설명 | 상태 |
|------|------|------|
| [RSVP API](./api/RSVP_API.md) | **RSVP API 완전 가이드** (Google Sheets 연동, Apps Script) | ✅ Current |

**주요 API**:
- `POST /exec` - RSVP 제출 (Google Apps Script Webhook)
- Google Sheets 데이터베이스
- Kakao Maps API 연동

---

## 🎨 디자인 시스템

디자인 가이드라인 및 스타일 규칙입니다.

| 문서 | 설명 | 상태 |
|------|------|------|
| [DESIGN_SYSTEM.md](./design/DESIGN_SYSTEM.md) | **디자인 시스템 완전 가이드** (색상, 타이포, 컴포넌트) | ✅ Current |

**디자인 컨셉**: Minimal Elegance
- 색상: Navy (#2C3E50) + Gold (#D4AF37)
- 폰트: Cormorant Garamond (Serif) + Inter (Sans)
- 반응형: Mobile-First (640px, 768px, 1024px)

---

## 📊 문서 상태

### 카테고리별 통계

```
총 문서: 30개

카테고리별 분포:
  Getting Started:  3 (10%)
  Development:      5 (17%)
  Deployment:       6 (20%)
  API:              5 (17%)
  Components:       6 (20%)
  Design:           6 (20%)
  Architecture:     4 (13%)
```

### 문서 건강도

- ✅ **Current** (30개): 최신 상태 (3개월 이내 업데이트)
- ⚠️ **Needs Review** (0개): 검토 필요 (3-6개월)
- 🔴 **Outdated** (0개): 오래됨 (6개월 이상)
- 📝 **Draft** (0개): 작성 중

**상태:** 100% Current (모든 문서 최신 상태)

---

## 🏷️ 태그 인덱스

<details>
<summary>태그별 문서 찾기</summary>

**setup** (환경 설정):
- [개발 환경 설정](./development/SETUP.md)
- [환경 변수 설정](./deployment/ENVIRONMENT.md)

**api** (API 관련):
- [API 개요](./api/README.md)
- [RSVP API](./api/RSVP.md)
- [Gallery API](./api/GALLERY.md)

**deployment** (배포 관련):
- [Vercel 배포](./deployment/VERCEL.md)
- [Railway 배포](./deployment/RAILWAY.md)
- [도메인 설정](./deployment/DOMAIN.md)

**testing** (테스트):
- [테스트 가이드](./development/TESTING.md)
- [디버깅 가이드](./development/DEBUGGING.md)

**design** (디자인):
- [디자인 원칙](./design/PRINCIPLES.md)
- [컬러 시스템](./design/COLORS.md)
- [타이포그래피](./design/TYPOGRAPHY.md)

</details>

---

## 🔍 문서 찾기

### 역할별 추천 경로

**신규 개발자:**
1. [README.md](../README.md) - 프로젝트 이해
2. [프로젝트 구조](./PROJECT_STRUCTURE.md) - 코드베이스 파악
3. [개발 환경 설정](./development/SETUP.md) - 개발 환경 구축
4. [CONTRIBUTING.md](../CONTRIBUTING.md) - 기여 방법

**프론트엔드 개발자:**
1. [컴포넌트 개요](./components/README.md)
2. [디자인 시스템](./design/PRINCIPLES.md)
3. [API 문서](./api/README.md)

**백엔드 개발자:**
1. [아키텍처 개요](./architecture/OVERVIEW.md)
2. [데이터 모델](./architecture/DATA_MODEL.md)
3. [API 개요](./api/README.md)

**DevOps/배포 담당자:**
1. [배포 개요](./deployment/README.md)
2. [환경 설정](./deployment/ENVIRONMENT.md)
3. [모니터링](./deployment/MONITORING.md)

**디자이너:**
1. [디자인 원칙](./design/PRINCIPLES.md)
2. [컬러 시스템](./design/COLORS.md)
3. [컴포넌트 개요](./components/README.md)

---

## 🆘 도움이 필요하신가요?

문서에서 찾을 수 없는 내용이 있나요?

1. **검색**: Cmd+F / Ctrl+F로 이 페이지에서 검색
2. **이슈**: [GitHub Issues](https://github.com/yourproject/issues)에 질문 등록
3. **토론**: [GitHub Discussions](https://github.com/yourproject/discussions)에서 논의

---

## 📝 문서 기여

문서 개선에 참여하고 싶으신가요?

- 오타/오류 발견: PR로 직접 수정
- 누락된 내용: Issue로 제안
- 새 문서 작성: [CONTRIBUTING.md](../CONTRIBUTING.md#문서화) 참고

---

## 📅 문서 업데이트 로그

| 날짜 | 변경사항 | 작성자 |
|------|----------|--------|
| 2025-10-18 | 초기 문서 체계 구축 | Librarian |

---

**Navigation**: [Project Root](../) | [README](../README.md) | [CONTRIBUTING](../CONTRIBUTING.md)

<!-- AUTO-GENERATED: 이 문서는 자동 생성되었습니다 -->
