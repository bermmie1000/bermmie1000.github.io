# 프로젝트 구조

> Last updated: 2025-10-18

Wedding Invitation 프로젝트의 전체 디렉토리 구조와 파일 조직 방법을 설명합니다.

## 📋 목차

- [디렉토리 트리](#디렉토리-트리)
- [주요 디렉토리 설명](#주요-디렉토리-설명)
- [파일 네이밍 규칙](#파일-네이밍-규칙)
- [모듈 구조](#모듈-구조)

---

## 디렉토리 트리

```
wedding_invitation/
├── .github/                    # GitHub 설정
│   ├── workflows/              # GitHub Actions CI/CD
│   │   ├── ci.yml              # 테스트 및 린트
│   │   └── deploy.yml          # 배포 자동화
│   ├── ISSUE_TEMPLATE/         # 이슈 템플릿
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/                       # 📚 프로젝트 문서
│   ├── INDEX.md                # 문서 인덱스
│   ├── PROJECT_STRUCTURE.md    # 이 문서
│   ├── development/            # 개발 가이드
│   │   ├── README.md
│   │   ├── SETUP.md            # 개발 환경 설정
│   │   ├── WORKFLOW.md         # 개발 워크플로우
│   │   ├── CONVENTIONS.md      # 코딩 컨벤션
│   │   ├── TESTING.md          # 테스트 가이드
│   │   └── DEBUGGING.md        # 디버깅 가이드
│   ├── deployment/             # 배포 가이드
│   │   ├── README.md
│   │   ├── ENVIRONMENT.md      # 환경 변수
│   │   ├── VERCEL.md           # Vercel 배포
│   │   ├── RAILWAY.md          # Railway 배포
│   │   ├── DOMAIN.md           # 도메인 설정
│   │   └── MONITORING.md       # 모니터링
│   ├── api/                    # API 문서
│   │   ├── README.md           # API 개요
│   │   ├── RSVP.md             # RSVP API
│   │   ├── GALLERY.md          # 갤러리 API
│   │   ├── GUESTBOOK.md        # 방명록 API
│   │   └── ERRORS.md           # 에러 코드
│   ├── components/             # 컴포넌트 문서
│   │   ├── README.md
│   │   ├── INVITATION_CARD.md
│   │   ├── RSVP_FORM.md
│   │   ├── GALLERY_GRID.md
│   │   ├── MAP_VIEWER.md
│   │   └── GUESTBOOK.md
│   ├── design/                 # 디자인 시스템
│   │   ├── PRINCIPLES.md       # 디자인 원칙
│   │   ├── COLORS.md           # 컬러 시스템
│   │   ├── TYPOGRAPHY.md       # 타이포그래피
│   │   ├── SPACING.md          # 스페이싱
│   │   ├── ICONS.md            # 아이콘
│   │   └── ANIMATION.md        # 애니메이션
│   └── architecture/           # 아키텍처 문서
│       ├── OVERVIEW.md         # 아키텍처 개요
│       ├── DATA_MODEL.md       # 데이터 모델
│       ├── SECURITY.md         # 보안
│       ├── PERFORMANCE.md      # 성능 최적화
│       └── adr/                # Architecture Decision Records
│           ├── 001-tech-stack.md
│           ├── 002-database-choice.md
│           └── 003-hosting-platform.md
│
├── src/                        # 🎯 소스 코드
│   ├── app/                    # Next.js App Router (Frontend)
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈페이지
│   │   ├── rsvp/               # RSVP 페이지
│   │   ├── gallery/            # 갤러리 페이지
│   │   └── guestbook/          # 방명록 페이지
│   │
│   ├── components/             # React 컴포넌트
│   │   ├── ui/                 # 기본 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── features/           # 기능별 컴포넌트
│   │       ├── InvitationCard.tsx
│   │       ├── RSVPForm.tsx
│   │       ├── GalleryGrid.tsx
│   │       ├── MapViewer.tsx
│   │       └── Guestbook.tsx
│   │
│   ├── lib/                    # 유틸리티 및 헬퍼
│   │   ├── api-client.ts       # API 클라이언트
│   │   ├── validators.ts       # 유효성 검사
│   │   ├── formatters.ts       # 포맷터
│   │   └── constants.ts        # 상수
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useRSVP.ts
│   │   ├── useGallery.ts
│   │   └── useGuestbook.ts
│   │
│   ├── styles/                 # 스타일
│   │   ├── globals.css         # 전역 스타일
│   │   └── theme.ts            # 테마 설정
│   │
│   ├── types/                  # TypeScript 타입 정의
│   │   ├── index.ts
│   │   ├── rsvp.ts
│   │   ├── gallery.ts
│   │   └── guestbook.ts
│   │
│   └── backend/                # 🐍 Backend (FastAPI)
│       ├── main.py             # FastAPI 앱 진입점
│       ├── config.py           # 설정 관리
│       ├── database.py         # 데이터베이스 연결
│       ├── models/             # SQLAlchemy 모델
│       │   ├── __init__.py
│       │   ├── rsvp.py
│       │   ├── gallery.py
│       │   └── guestbook.py
│       ├── schemas/            # Pydantic 스키마
│       │   ├── __init__.py
│       │   ├── rsvp.py
│       │   ├── gallery.py
│       │   └── guestbook.py
│       ├── routers/            # API 라우터
│       │   ├── __init__.py
│       │   ├── rsvp.py
│       │   ├── gallery.py
│       │   └── guestbook.py
│       ├── services/           # 비즈니스 로직
│       │   ├── __init__.py
│       │   ├── rsvp_service.py
│       │   ├── gallery_service.py
│       │   └── guestbook_service.py
│       └── utils/              # 유틸리티
│           ├── __init__.py
│           ├── email.py
│           └── storage.py
│
├── public/                     # 🌐 정적 파일
│   ├── images/                 # 이미지
│   │   ├── hero.jpg            # 메인 이미지
│   │   ├── couple/             # 커플 사진
│   │   └── gallery/            # 갤러리 사진
│   ├── fonts/                  # 폰트 파일
│   │   ├── heading.woff2
│   │   └── body.woff2
│   ├── favicon.ico
│   └── robots.txt
│
├── tests/                      # 🧪 테스트
│   ├── frontend/               # Frontend 테스트
│   │   ├── unit/               # 단위 테스트
│   │   │   └── components/
│   │   ├── integration/        # 통합 테스트
│   │   └── e2e/                # E2E 테스트 (Playwright)
│   └── backend/                # Backend 테스트
│       ├── test_rsvp.py
│       ├── test_gallery.py
│       └── test_guestbook.py
│
├── scripts/                    # 🔧 유틸리티 스크립트
│   ├── setup.sh                # 초기 설정
│   ├── seed-db.py              # 데이터베이스 시드
│   └── migrate.py              # 마이그레이션
│
├── .venv/                      # Python 가상 환경 (gitignore)
├── node_modules/               # Node.js 의존성 (gitignore)
│
├── .env.example                # 환경 변수 예시
├── .env                        # 환경 변수 (gitignore)
├── .gitignore                  # Git ignore 규칙
├── .eslintrc.json              # ESLint 설정
├── .prettierrc                 # Prettier 설정
├── pyproject.toml              # Python 프로젝트 설정 (uv)
├── requirements.txt            # Python 의존성
├── requirements-dev.txt        # 개발용 의존성
├── package.json                # Node.js 의존성
├── tsconfig.json               # TypeScript 설정
├── next.config.js              # Next.js 설정
├── tailwind.config.js          # Tailwind CSS 설정
├── playwright.config.ts        # Playwright 설정
├── README.md                   # 프로젝트 소개
├── CONTRIBUTING.md             # 기여 가이드
└── LICENSE                     # 라이선스
```

---

## 주요 디렉토리 설명

### `/docs` - 문서

프로젝트의 모든 문서를 체계적으로 관리합니다.

**하위 디렉토리:**
- `development/`: 개발자를 위한 가이드
- `deployment/`: 배포 및 운영 가이드
- `api/`: API 문서 및 스펙
- `components/`: 컴포넌트 사용법
- `design/`: 디자인 시스템 및 가이드라인
- `architecture/`: 시스템 아키텍처 문서

**원칙:**
- 각 카테고리에는 `README.md` 필수
- 문서 간 크로스 레퍼런스 활용
- 코드 예제는 실제 동작하는 코드 사용

### `/src` - 소스 코드

애플리케이션의 모든 소스 코드를 포함합니다.

#### Frontend (`/src/app`, `/src/components`)

**구조:**
- `app/`: Next.js App Router 페이지
- `components/`: 재사용 가능한 React 컴포넌트
  - `ui/`: 기본 UI 컴포넌트 (Button, Input 등)
  - `layout/`: 레이아웃 컴포넌트
  - `features/`: 기능별 복합 컴포넌트

**네이밍:**
- 컴포넌트 파일: `PascalCase.tsx` (예: `RSVPForm.tsx`)
- 유틸리티 파일: `kebab-case.ts` (예: `api-client.ts`)
- 훅: `useHookName.ts` (예: `useRSVP.ts`)

#### Backend (`/src/backend`)

**구조:**
- `models/`: SQLAlchemy ORM 모델 (데이터베이스 테이블)
- `schemas/`: Pydantic 스키마 (요청/응답 검증)
- `routers/`: FastAPI 라우터 (엔드포인트 정의)
- `services/`: 비즈니스 로직 (재사용 가능한 서비스)
- `utils/`: 헬퍼 함수

**네이밍:**
- 파일: `snake_case.py` (예: `rsvp_service.py`)
- 클래스: `PascalCase` (예: `RSVPService`)
- 함수: `snake_case` (예: `create_rsvp`)

### `/public` - 정적 파일

브라우저에 직접 제공되는 정적 자산입니다.

**구조:**
- `images/`: 이미지 파일 (JPG, PNG, SVG)
- `fonts/`: 웹폰트 파일 (WOFF2 권장)

**최적화:**
- 이미지는 WebP 포맷 권장
- 폰트는 서브셋팅 및 압축
- Next.js Image 컴포넌트 활용

### `/tests` - 테스트

모든 테스트 코드를 포함합니다.

**Frontend 테스트:**
- `unit/`: 컴포넌트 단위 테스트 (Jest + RTL)
- `integration/`: 통합 테스트
- `e2e/`: End-to-End 테스트 (Playwright)

**Backend 테스트:**
- `test_*.py`: pytest 테스트 파일
- 파일명은 `test_` 접두사 필수

---

## 파일 네이밍 규칙

### Frontend (TypeScript/React)

| 파일 타입 | 네이밍 | 예시 |
|-----------|--------|------|
| React 컴포넌트 | PascalCase | `RSVPForm.tsx` |
| 페이지 | lowercase | `page.tsx` (Next.js App Router) |
| 훅 | useCamelCase | `useRSVP.ts` |
| 유틸리티 | kebab-case | `api-client.ts` |
| 타입 정의 | kebab-case | `rsvp.ts` |
| 스타일 | kebab-case | `globals.css` |

### Backend (Python)

| 파일 타입 | 네이밍 | 예시 |
|-----------|--------|------|
| 모듈 | snake_case | `rsvp_service.py` |
| 클래스 | PascalCase | `class RSVPService` |
| 함수 | snake_case | `def create_rsvp()` |
| 상수 | UPPER_CASE | `MAX_GUESTS = 100` |

### 문서 (Markdown)

| 문서 타입 | 네이밍 | 예시 |
|-----------|--------|------|
| 일반 문서 | UPPER_CASE | `SETUP.md` |
| ADR | 숫자 접두사 | `001-tech-stack.md` |
| README | README | `README.md` |

---

## 모듈 구조

### Frontend 모듈 조직

```typescript
// ✅ Good: 명확한 import 경로
import { Button } from '@/components/ui/Button'
import { useRSVP } from '@/hooks/useRSVP'
import { apiClient } from '@/lib/api-client'
import type { RSVP } from '@/types/rsvp'

// ❌ Bad: 상대 경로 과다 사용
import { Button } from '../../../components/ui/Button'
```

**Path Aliases (tsconfig.json):**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### Backend 모듈 조직

```python
# ✅ Good: 명확한 모듈 구조
from src.backend.models.rsvp import RSVP
from src.backend.schemas.rsvp import RSVPCreate
from src.backend.services.rsvp_service import RSVPService

# ❌ Bad: 순환 import, 상대 import 과다
from ..models import RSVP
from ...services import RSVPService
```

**Import 순서:**
1. 표준 라이브러리
2. 서드파티 라이브러리
3. 로컬 모듈

```python
# 1. 표준 라이브러리
from datetime import datetime
from typing import List, Optional

# 2. 서드파티
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

# 3. 로컬
from src.backend.models.rsvp import RSVP
from src.backend.schemas.rsvp import RSVPCreate
```

---

## 환경별 파일

### Development (개발)

```
.env.development
- DEBUG=true
- DATABASE_URL=sqlite:///./dev.db
- LOG_LEVEL=DEBUG
```

### Staging (스테이징)

```
.env.staging
- DEBUG=false
- DATABASE_URL=postgresql://staging-db
- LOG_LEVEL=INFO
```

### Production (프로덕션)

```
.env.production
- DEBUG=false
- DATABASE_URL=postgresql://prod-db
- LOG_LEVEL=WARNING
```

---

## 코드 조직 원칙

### 1. 단일 책임 원칙 (Single Responsibility)

각 파일/모듈은 하나의 명확한 책임을 가집니다.

```typescript
// ✅ Good: 하나의 컴포넌트
// RSVPForm.tsx
export function RSVPForm() { ... }

// ❌ Bad: 여러 컴포넌트를 한 파일에
// Forms.tsx
export function RSVPForm() { ... }
export function GuestbookForm() { ... }
export function ContactForm() { ... }
```

### 2. 명확한 의존성

의존성은 명시적으로 선언합니다.

```python
# ✅ Good: 의존성 주입
class RSVPService:
    def __init__(self, db: Session, email_service: EmailService):
        self.db = db
        self.email_service = email_service

# ❌ Bad: 글로벌 의존성
db = get_db()
class RSVPService:
    def create_rsvp(self):
        db.add(...)  # 어디서 온 db?
```

### 3. 재사용성

공통 로직은 재사용 가능하게 추출합니다.

```typescript
// ✅ Good: 재사용 가능한 훅
// hooks/useForm.ts
export function useForm(initialValues) { ... }

// RSVPForm.tsx
const form = useForm({ name: '', email: '' })

// GuestbookForm.tsx
const form = useForm({ message: '' })
```

---

## 관련 문서

- [개발 환경 설정](./development/SETUP.md)
- [코딩 컨벤션](./development/CONVENTIONS.md)
- [API 문서](./api/README.md)

---

**Navigation**: [Docs Home](./INDEX.md) | [README](../README.md)
