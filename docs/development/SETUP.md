# 개발 환경 설정

> Last updated: 2025-10-18

로컬 개발 환경을 설정하는 방법을 단계별로 안내합니다.

## 📋 목차

- [사전 요구사항](#사전-요구사항)
- [설치 단계](#설치-단계)
- [환경 변수 설정](#환경-변수-설정)
- [개발 서버 실행](#개발-서버-실행)
- [문제 해결](#문제-해결)

---

## 사전 요구사항

개발을 시작하기 전에 다음 도구들을 설치하세요.

### 필수 도구

| 도구 | 최소 버전 | 권장 버전 | 설치 방법 |
|------|-----------|-----------|-----------|
| **Node.js** | 18.0.0 | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.11 | 3.12 | [python.org](https://python.org/) |
| **uv** | - | latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| **Git** | 2.30 | latest | [git-scm.com](https://git-scm.com/) |

### 선택적 도구

- **VS Code**: 권장 에디터 ([다운로드](https://code.visualstudio.com/))
- **PostgreSQL**: 프로덕션 DB 사용 시 ([다운로드](https://www.postgresql.org/))
- **Docker**: 컨테이너 환경 사용 시 ([다운로드](https://www.docker.com/))

### 설치 확인

터미널에서 버전을 확인하여 올바르게 설치되었는지 검증하세요:

```bash
node --version    # v20.x.x
python --version  # Python 3.12.x
uv --version      # uv 0.x.x
git --version     # git version 2.x.x
```

---

## 설치 단계

### 1. 저장소 클론

```bash
# HTTPS
git clone https://github.com/YOUR_USERNAME/wedding_invitation.git

# SSH (권장 - GitHub SSH 키 설정 필요)
git clone git@github.com:YOUR_USERNAME/wedding_invitation.git

cd wedding_invitation
```

### 2. Frontend 의존성 설치

```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install

# 또는 pnpm 사용 (더 빠름)
pnpm install
```

**설치되는 주요 패키지:**
- `next`: React 프레임워크
- `react`, `react-dom`: UI 라이브러리
- `tailwindcss`: CSS 프레임워크
- `typescript`: 타입 시스템
- `framer-motion`: 애니메이션

### 3. Backend 의존성 설치 (uv 사용)

```bash
# Python 가상 환경 생성
uv venv

# 가상 환경 활성화
# macOS/Linux:
source .venv/bin/activate

# Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Windows (CMD):
.venv\Scripts\activate.bat

# 의존성 설치
uv pip install -r requirements.txt

# 개발 의존성 설치 (테스트, 린팅 등)
uv pip install -r requirements-dev.txt
```

**설치되는 주요 패키지:**
- `fastapi`: 웹 프레임워크
- `uvicorn`: ASGI 서버
- `sqlalchemy`: ORM
- `pydantic`: 데이터 검증
- `python-dotenv`: 환경 변수 로딩

### 4. VS Code 설정 (선택)

프로젝트 루트에서 VS Code를 엽니다:

```bash
code .
```

**권장 확장 프로그램:**

설치를 위해 Extensions 패널에서 검색:

- `dbaeumer.vscode-eslint` - ESLint
- `esbenp.prettier-vscode` - Prettier
- `ms-python.python` - Python
- `ms-python.vscode-pylance` - Python 언어 서버
- `bradlc.vscode-tailwindcss` - Tailwind CSS IntelliSense
- `charliermarsh.ruff` - Ruff (Python linter/formatter)

프로젝트에 `.vscode/extensions.json`이 있다면 자동으로 설치 권장됩니다.

---

## 환경 변수 설정

### 1. `.env` 파일 생성

```bash
cp .env.example .env
```

### 2. 환경 변수 수정

`.env` 파일을 에디터로 열어 다음 값들을 설정하세요:

```bash
# === Application ===
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# === Database ===
# Development: SQLite (간편)
DATABASE_URL=sqlite:///./wedding.db

# Production: PostgreSQL (권장)
# DATABASE_URL=postgresql://user:password@localhost:5432/wedding_db

# === External Services ===

# Google Maps API (지도 표시)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
# 발급: https://console.cloud.google.com/

# Email Service (RSVP 알림)
EMAIL_SERVICE_PROVIDER=sendgrid  # sendgrid | resend | smtp
EMAIL_API_KEY=your_email_api_key_here
EMAIL_FROM=noreply@your-domain.com
EMAIL_TO=your-email@example.com

# Image Storage (갤러리)
STORAGE_PROVIDER=cloudinary  # cloudinary | s3 | local
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# === Security ===
SECRET_KEY=your-secret-key-here-change-in-production
# 생성: python -c "import secrets; print(secrets.token_urlsafe(32))"

# === Optional ===
LOG_LEVEL=DEBUG  # DEBUG | INFO | WARNING | ERROR
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. API 키 발급

**Google Maps API:**
1. [Google Cloud Console](https://console.cloud.google.com/) 방문
2. 새 프로젝트 생성
3. "APIs & Services" → "Enable APIs" → "Maps JavaScript API" 활성화
4. "Credentials" → "Create Credentials" → API 키 생성
5. `.env`의 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`에 입력

**SendGrid (Email):**
1. [SendGrid](https://sendgrid.com/) 계정 생성
2. "Settings" → "API Keys" → "Create API Key"
3. `.env`의 `EMAIL_API_KEY`에 입력

**Cloudinary (Image Storage):**
1. [Cloudinary](https://cloudinary.com/) 계정 생성
2. Dashboard에서 Cloud Name, API Key, API Secret 확인
3. `.env`에 입력

---

## 개발 서버 실행

### 방법 1: 분리 실행 (권장)

**터미널 1 - Frontend:**
```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

Frontend는 `http://localhost:3000`에서 실행됩니다.

**터미널 2 - Backend:**
```bash
# 가상 환경 활성화 (필요시)
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate    # Windows

# 개발 서버 실행
uv run uvicorn src.backend.main:app --reload --port 8000
```

Backend는 `http://localhost:8000`에서 실행됩니다.
- API 문서: `http://localhost:8000/docs` (Swagger UI)
- Alternative API 문서: `http://localhost:8000/redoc`

### 방법 2: 통합 실행 (package.json 스크립트)

```bash
# Frontend + Backend 동시 실행
npm run dev:all

# Backend만 실행
npm run dev:backend

# Frontend만 실행
npm run dev:frontend
```

### 데이터베이스 초기화

최초 실행 시 데이터베이스를 초기화하세요:

```bash
# 마이그레이션 실행
uv run alembic upgrade head

# 샘플 데이터 삽입 (선택)
uv run python scripts/seed-db.py
```

---

## 개발 환경 검증

모든 것이 올바르게 설정되었는지 확인:

### 1. Frontend 체크

브라우저에서 `http://localhost:3000` 방문:
- [ ] 페이지가 정상적으로 로드됨
- [ ] 콘솔에 에러가 없음
- [ ] Hot reload 동작 (파일 수정 시 자동 새로고침)

### 2. Backend 체크

브라우저에서 `http://localhost:8000/docs` 방문:
- [ ] Swagger UI가 표시됨
- [ ] API 엔드포인트 목록이 보임
- [ ] "Try it out" 기능 동작

터미널에서 API 호출 테스트:
```bash
# Health check
curl http://localhost:8000/health

# 응답 예시:
# {"status": "ok", "version": "1.0.0"}
```

### 3. 테스트 실행

```bash
# Frontend 테스트
npm run test

# Backend 테스트
uv run pytest

# 모든 테스트
npm run test:all
```

모든 테스트가 통과하면 설정 완료!

---

## 문제 해결

### 일반적인 문제

#### 1. `npm install` 실패

**증상:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**해결:**
```bash
# 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 또는 --legacy-peer-deps 플래그 사용
npm install --legacy-peer-deps
```

#### 2. Python 가상 환경 활성화 실패

**증상 (Windows PowerShell):**
```
... cannot be loaded because running scripts is disabled on this system.
```

**해결:**
```powershell
# PowerShell을 관리자 권한으로 실행
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 그 후 다시 활성화
.venv\Scripts\Activate.ps1
```

#### 3. 포트 이미 사용 중

**증상:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결:**
```bash
# 해당 포트를 사용하는 프로세스 찾기
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 또는 다른 포트 사용
npm run dev -- -p 3001
```

#### 4. 데이터베이스 연결 실패

**증상:**
```
sqlalchemy.exc.OperationalError: unable to open database file
```

**해결:**
```bash
# SQLite: 디렉토리 권한 확인
mkdir -p data
chmod 755 data

# 데이터베이스 파일 재생성
rm wedding.db
uv run alembic upgrade head
```

#### 5. 환경 변수 로딩 안 됨

**증상:**
- API 키가 `undefined`로 표시
- "Missing environment variable" 에러

**해결:**
```bash
# .env 파일이 존재하는지 확인
ls -la .env

# .env 파일 권한 확인
chmod 600 .env

# 서버 재시작 (환경 변수는 시작 시 로드됨)
```

### 로그 확인

**Frontend 로그:**
- 브라우저 개발자 도구 Console
- 터미널에서 Next.js 서버 로그 확인

**Backend 로그:**
- 터미널에서 uvicorn 서버 로그 확인
- 로그 레벨 변경: `.env`의 `LOG_LEVEL=DEBUG`

### 추가 도움

문제가 해결되지 않으면:
1. [Troubleshooting Guide](./DEBUGGING.md) 참고
2. [GitHub Issues](https://github.com/yourproject/issues) 검색
3. [Discussions](https://github.com/yourproject/discussions)에 질문 등록

---

## 다음 단계

환경 설정이 완료되었다면:

1. [개발 워크플로우](./WORKFLOW.md) - Git 브랜치 전략 학습
2. [코딩 컨벤션](./CONVENTIONS.md) - 코드 스타일 가이드 숙지
3. [컴포넌트 문서](../components/README.md) - UI 컴포넌트 살펴보기
4. [API 문서](../api/README.md) - API 구조 이해

---

**Navigation**: [Docs Home](../INDEX.md) | [Development Guide](./README.md)
