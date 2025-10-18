# 💒 GitHub Pages 모바일 청첩장

> 개발자가 만드는, 무료이면서 아름다운 모바일 청첩장

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Sprint 0 Complete](https://img.shields.io/badge/Status-Sprint%200%20Complete-green.svg)]()
[![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01.svg)](https://astro.build)
[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub%20Pages-222222.svg)](https://pages.github.com)

## ✨ 핵심 가치

- **💰 Zero Cost**: GitHub Pages 무료 호스팅, Google Sheets RSVP
- **⚡ High Performance**: Lighthouse 95+ 목표, Islands Architecture
- **🎯 Developer Friendly**: Astro 5.0 + React 18 + Tailwind CSS
- **🔧 Full Control**: 코드 레벨 완전 커스터마이징
- **🔒 Privacy First**: 자체 데이터 관리, 제3자 서비스 의존 없음

## 🚀 5분 빠른 시작

### 사전 요구사항

- Node.js 18.17.0+ (권장: 22.0.0)
- pnpm 8.0.0+
- Git

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/wedding-invitation.git
cd wedding-invitation

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 설정
cp .env.example .env

# 4. 개발 서버 실행
pnpm dev
# → http://localhost:4321 열기
```

**👉 상세 가이드**: [QUICK_START.md](docs/development/QUICK_START.md)

## 📚 주요 문서

| 문서 | 설명 | 대상 |
|------|------|------|
| **[MASTER_PLAN.md](MASTER_PLAN.md)** | 프로젝트 통합 가이드 (시작점) | 전체 |
| [QUICK_START.md](docs/development/QUICK_START.md) | 빠른 시작 가이드 | 개발자 |
| [DEPLOYMENT.md](docs/development/DEPLOYMENT.md) | GitHub Pages 배포 가이드 | DevOps |
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | Sprint 계획 및 실행 계획 | PM |
| [TECH_STACK.md](docs/TECH_STACK.md) | 기술 스택 상세 설명 | 개발자 |
| [DESIGN_SYSTEM.md](docs/design/DESIGN_SYSTEM.md) | 디자인 시스템 (색상, 타이포) | 디자이너 |
| [RSVP_API.md](docs/api/RSVP_API.md) | RSVP API 명세 (Google Sheets) | 백엔드 |

**📖 전체 문서**: [docs/INDEX.md](docs/INDEX.md)

## 🎨 주요 기능

### MVP (Sprint 1)
- ✅ **Hero 섹션**: 신랑신부 이름, 결혼식 날짜
- ✅ **Event Info**: 예식장 정보, 안내사항
- ✅ **지도**: Kakao Maps 연동, 길찾기
- ✅ **RSVP**: 참석 여부 응답 (Google Sheets 저장)
- ✅ **Contact**: 전화/문자 바로 연결

### 추가 기능 (Sprint 2-3)
- 📋 **갤러리**: 사진 그리드, Lightbox
- 📋 **테마 전환**: 3가지 컬러 테마
- 📋 **다국어**: 한/영 지원
- 📋 **방명록**: 축하 메시지
- 📋 **PWA**: 오프라인 모드

## 🚀 빠른 시작

### 사전 요구사항

개발 환경 설정을 위해 다음이 필요합니다:

- **Node.js**: v18.0.0 이상
- **Python**: 3.11 이상 (백엔드 사용 시)
- **uv**: Python 패키지 관리 (권장)
- **Git**: 버전 관리

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd wedding_invitation

# 의존성 설치 (프론트엔드)
npm install

# 의존성 설치 (백엔드 - uv 사용)
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

### 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정하세요.

```bash
cp .env.example .env
```

주요 환경 변수:
- `DATABASE_URL`: 데이터베이스 연결 URL
- `GOOGLE_MAPS_API_KEY`: 지도 API 키
- `EMAIL_SERVICE_API_KEY`: 이메일 발송 API 키

### 개발 서버 실행

```bash
# 프론트엔드 개발 서버
npm run dev

# 백엔드 개발 서버 (별도 터미널)
uv run uvicorn main:app --reload
```

브라우저에서 `http://localhost:3000` 을 열어 확인하세요.

## 📁 프로젝트 구조

```
wedding_invitation/
├── docs/                    # 프로젝트 문서
│   ├── development/         # 개발 가이드
│   ├── deployment/          # 배포 가이드
│   ├── api/                 # API 문서
│   └── design/              # 디자인 시스템
├── src/                     # 소스 코드
│   ├── components/          # React 컴포넌트
│   ├── pages/               # 페이지 컴포넌트
│   ├── styles/              # 스타일시트
│   ├── utils/               # 유틸리티 함수
│   └── api/                 # API 클라이언트
├── public/                  # 정적 파일
│   ├── images/              # 이미지 자산
│   └── fonts/               # 폰트 파일
├── tests/                   # 테스트 코드
├── .env.example             # 환경 변수 예시
├── package.json             # Node.js 의존성
├── pyproject.toml           # Python 프로젝트 설정
└── README.md                # 프로젝트 소개 (이 파일)
```

자세한 구조는 [프로젝트 구조 문서](docs/PROJECT_STRUCTURE.md)를 참고하세요.

## 🛠️ 기술 스택

### Frontend
- **Framework**: Astro 5.0 (Islands Architecture)
- **UI Library**: React 18 (인터랙티브 컴포넌트)
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript 5.0
- **Performance**: Lighthouse 95+ 목표

### Backend & Services
- **Hosting**: GitHub Pages (무료)
- **RSVP Database**: Google Sheets + Apps Script
- **Map**: Kakao Maps API
- **CDN**: Fastly (GitHub Pages 기본 제공)

### Development Tools
- **Package Manager**: pnpm 8.15
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Linter/Formatter**: Biome
- **CI/CD**: GitHub Actions
- **Performance**: Lighthouse CI

**👉 자세한 설명**: [TECH_STACK.md](docs/TECH_STACK.md)

## 📖 문서 구조

```
docs/
├── MASTER_PLAN.md          # ⭐ 프로젝트 통합 가이드 (시작점)
├── PROJECT_PLAN.md         # Sprint 계획 및 실행 계획
├── TECH_STACK.md          # 기술 스택 상세 설명
│
├── architecture/
│   ├── OVERVIEW.md        # 아키텍처 개요
│   └── ADR-001-astro-framework.md  # 기술 결정 기록
│
├── design/
│   └── DESIGN_SYSTEM.md   # 디자인 시스템 (색상, 타이포)
│
├── api/
│   └── RSVP_API.md        # RSVP API 명세 (Google Sheets)
│
└── development/
    ├── QUICK_START.md     # ⭐ 빠른 시작 가이드
    └── DEPLOYMENT.md      # ⭐ 배포 가이드
```

**전체 문서 목록**: [docs/INDEX.md](docs/INDEX.md)

## 🤝 기여하기

프로젝트 기여를 환영합니다! 기여 방법은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

### 개발 워크플로우

1. 이슈 생성 또는 기존 이슈 선택
2. Feature 브랜치 생성: `git checkout -b feature/amazing-feature`
3. 변경사항 커밋: `git commit -m 'feat: add amazing feature'`
4. 브랜치 푸시: `git push origin feature/amazing-feature`
5. Pull Request 생성

### 커밋 컨벤션

Conventional Commits 스펙을 따릅니다:

```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅 (기능 변경 없음)
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 도구 변경
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👥 제작자

- **개발**: [Your Name](https://github.com/yourusername)

## 🙏 감사의 말

- 디자인 영감: [Wedding Website Templates](https://github.com/topics/wedding-website)
- 아이콘: [Heroicons](https://heroicons.com/)
- 폰트: [Google Fonts](https://fonts.google.com/)

## 📞 문의

질문이나 제안사항이 있으시면 이슈를 생성하거나 이메일로 연락주세요.

---

**만든 이의 마음**: 이 프로젝트는 특별한 날을 더욱 특별하게 만들기 위해 제작되었습니다 💝
