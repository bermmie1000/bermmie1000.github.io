# 기여 가이드

Wedding Invitation 프로젝트에 기여해 주셔서 감사합니다! 🎉

이 문서는 프로젝트에 효과적으로 기여하는 방법을 안내합니다.

## 📋 목차

- [행동 강령](#행동-강령)
- [시작하기](#시작하기)
- [개발 환경 설정](#개발-환경-설정)
- [개발 워크플로우](#개발-워크플로우)
- [코딩 컨벤션](#코딩-컨벤션)
- [커밋 메시지 가이드](#커밋-메시지-가이드)
- [Pull Request 프로세스](#pull-request-프로세스)
- [테스트](#테스트)
- [문서화](#문서화)

## 행동 강령

프로젝트 참여자는 다음을 준수해야 합니다:

- 존중과 배려로 소통하기
- 건설적인 피드백 제공하기
- 다양한 관점과 경험 존중하기
- 커뮤니티 이익을 우선시하기

## 시작하기

### 기여 유형

다음과 같은 방법으로 기여할 수 있습니다:

- 🐛 **버그 리포트**: 버그를 발견하면 이슈로 보고
- 💡 **기능 제안**: 새로운 기능 아이디어 제안
- 📝 **문서 개선**: 문서 오타 수정, 예제 추가
- 💻 **코드 기여**: 버그 수정, 기능 구현
- 🎨 **디자인**: UI/UX 개선 제안
- 🧪 **테스트**: 테스트 커버리지 향상

### 이슈 생성

버그 리포트 또는 기능 요청 시 다음을 포함하세요:

**버그 리포트:**
- 명확하고 설명적인 제목
- 재현 단계
- 예상 동작 vs 실제 동작
- 스크린샷 (해당되는 경우)
- 환경 정보 (OS, 브라우저, Node.js 버전)

**기능 요청:**
- 명확한 제목
- 기능이 필요한 이유
- 제안하는 구현 방법
- 대안 고려사항

## 개발 환경 설정

### 1. 저장소 Fork 및 Clone

```bash
# 저장소 Fork (GitHub 웹에서)
# 그 다음 Clone
git clone https://github.com/YOUR_USERNAME/wedding_invitation.git
cd wedding_invitation

# 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/ORIGINAL_OWNER/wedding_invitation.git
```

### 2. 의존성 설치

```bash
# Frontend 의존성
npm install

# Backend 의존성 (uv 사용)
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
uv pip install -r requirements-dev.txt  # 개발 의존성
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 값 설정
```

### 4. 개발 서버 실행

```bash
# Frontend
npm run dev

# Backend (별도 터미널)
uv run uvicorn main:app --reload
```

## 개발 워크플로우

### Git Flow

브랜치 전략:

- `main`: 프로덕션 코드
- `develop`: 개발 통합 브랜치
- `feature/*`: 새 기능 개발
- `fix/*`: 버그 수정
- `docs/*`: 문서 변경
- `refactor/*`: 리팩토링

### 작업 흐름

```bash
# 1. develop 브랜치에서 최신 코드 받기
git checkout develop
git pull upstream develop

# 2. Feature 브랜치 생성
git checkout -b feature/my-awesome-feature

# 3. 코드 작성 및 테스트
# ... 코딩 ...
npm run test
npm run lint

# 4. 변경사항 커밋
git add .
git commit -m "feat: add awesome feature"

# 5. Push to your fork
git push origin feature/my-awesome-feature

# 6. GitHub에서 Pull Request 생성
```

## 코딩 컨벤션

### JavaScript/TypeScript

```javascript
// ESLint + Prettier 설정 준수

// 1. Named exports 사용 (default export 지양)
export function calculateAge(birthDate) { ... }

// 2. 명확한 함수/변수명
// Bad
const d = new Date();
function calc() { ... }

// Good
const currentDate = new Date();
function calculateTotalPrice() { ... }

// 3. Early return 패턴
function processUser(user) {
  if (!user) return null;
  if (!user.isActive) return null;

  // 실제 로직
  return processedUser;
}

// 4. 타입 안정성 (TypeScript)
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User | null {
  // ...
}
```

### Python

```python
# PEP 8 + Black formatter 준수

# 1. Type hints 사용
from typing import Optional, List

def get_user(user_id: int) -> Optional[User]:
    """사용자 정보를 조회합니다."""
    pass

# 2. Docstrings
def calculate_age(birth_date: date) -> int:
    """
    생년월일로부터 나이를 계산합니다.

    Args:
        birth_date: 생년월일

    Returns:
        만 나이

    Raises:
        ValueError: 미래 날짜가 입력된 경우
    """
    pass

# 3. 명확한 변수명 (snake_case)
user_email = "user@example.com"
is_active = True

# 4. List comprehension 활용
# Bad
squares = []
for i in range(10):
    squares.append(i ** 2)

# Good
squares = [i ** 2 for i in range(10)]
```

### CSS/Styling

```css
/* Tailwind CSS 우선 사용 */
/* Custom CSS는 BEM 네이밍 */

/* Block__Element--Modifier */
.invitation-card { }
.invitation-card__header { }
.invitation-card__header--highlighted { }

/* 변수 사용 */
:root {
  --color-primary: #4f46e5;
  --color-secondary: #ec4899;
  --spacing-unit: 8px;
}
```

### 파일/디렉토리 네이밍

```
✅ kebab-case: components/rsvp-form.tsx
✅ PascalCase: components/RSVPForm.tsx (React 컴포넌트)
✅ snake_case: utils/date_formatter.py (Python)
❌ camelCase: utils/dateFormatter.py (Python에서는 지양)
```

## 커밋 메시지 가이드

Conventional Commits 스펙을 따릅니다.

### 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 패키지 관리자 설정
- `perf`: 성능 개선
- `ci`: CI/CD 설정 변경

### Scope (선택)

변경된 모듈이나 컴포넌트:
- `rsvp`: RSVP 관련
- `gallery`: 갤러리 관련
- `auth`: 인증 관련
- `api`: API 관련

### 예시

```bash
feat(rsvp): add email validation to RSVP form

- Add email format validation
- Add duplicate email check
- Add error message display

Closes #123
```

```bash
fix(gallery): resolve image loading issue on mobile

The gallery images were not loading properly on iOS Safari
due to lazy loading configuration.

Fixes #456
```

```bash
docs: update installation guide for uv package manager

- Add uv installation instructions
- Update virtual environment setup steps
- Add troubleshooting section
```

### 규칙

1. **제목은 50자 이내**
2. **제목은 명령형** ("added" ❌, "add" ✅)
3. **제목 끝에 마침표 금지**
4. **본문은 72자에서 줄바꿈**
5. **본문에는 "무엇을", "왜" 설명** ("어떻게"는 코드에서 확인)

## Pull Request 프로세스

### PR 생성 전 체크리스트

- [ ] 코드가 컨벤션을 준수하는가?
- [ ] 모든 테스트가 통과하는가?
- [ ] Lint 에러가 없는가?
- [ ] 새 기능에 대한 테스트를 추가했는가?
- [ ] 문서를 업데이트했는가?
- [ ] 커밋 메시지가 컨벤션을 따르는가?

### PR 템플릿

```markdown
## 변경 사항

간단한 변경 사항 설명

## 변경 타입

- [ ] 버그 수정
- [ ] 새 기능
- [ ] Breaking change
- [ ] 문서 업데이트

## 테스트

어떻게 테스트했는지 설명

## 스크린샷 (해당되는 경우)

Before / After 스크린샷

## 체크리스트

- [ ] 코드가 스타일 가이드를 준수함
- [ ] 자체 코드 리뷰 완료
- [ ] 코드에 명확한 주석 추가
- [ ] 문서 업데이트 완료
- [ ] 경고 없이 빌드 성공
- [ ] 테스트 추가 및 통과
- [ ] 의존성 테스트도 통과

## 관련 이슈

Closes #(issue number)
```

### 리뷰 프로세스

1. PR 생성 후 자동 CI/CD 체크 통과 대기
2. 최소 1명의 리뷰어 승인 필요
3. 리뷰어 피드백에 대응
4. 승인 후 `develop` 브랜치로 merge

## 테스트

### 실행 방법

```bash
# 전체 테스트
npm run test

# 특정 파일 테스트
npm run test -- rsvp-form.test.tsx

# 커버리지 확인
npm run test:coverage

# Python 테스트
uv run pytest
uv run pytest --cov=src tests/
```

### 테스트 작성

```javascript
// Jest + React Testing Library

import { render, screen, fireEvent } from '@testing-library/react';
import { RSVPForm } from './RSVPForm';

describe('RSVPForm', () => {
  it('should render form fields', () => {
    render(<RSVPForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(<RSVPForm />);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

```python
# pytest

import pytest
from app.services.rsvp import RSVPService

def test_create_rsvp():
    """RSVP 생성 테스트"""
    service = RSVPService()
    rsvp = service.create_rsvp(
        name="홍길동",
        email="hong@example.com",
        attendance=True
    )

    assert rsvp.name == "홍길동"
    assert rsvp.email == "hong@example.com"
    assert rsvp.attendance is True

def test_duplicate_email_validation():
    """중복 이메일 검증 테스트"""
    service = RSVPService()
    service.create_rsvp("홍길동", "hong@example.com", True)

    with pytest.raises(ValueError, match="이미 등록된 이메일"):
        service.create_rsvp("김철수", "hong@example.com", True)
```

## 문서화

### 코드 문서화

```javascript
/**
 * 사용자의 RSVP 응답을 처리합니다.
 *
 * @param {Object} rsvpData - RSVP 데이터
 * @param {string} rsvpData.name - 참석자 이름
 * @param {string} rsvpData.email - 이메일 주소
 * @param {boolean} rsvpData.attendance - 참석 여부
 * @returns {Promise<RSVP>} 생성된 RSVP 객체
 * @throws {ValidationError} 유효하지 않은 데이터인 경우
 *
 * @example
 * const rsvp = await submitRSVP({
 *   name: "홍길동",
 *   email: "hong@example.com",
 *   attendance: true
 * });
 */
async function submitRSVP(rsvpData) {
  // ...
}
```

### 문서 업데이트

새로운 기능을 추가하면:

1. `docs/api/` - API 엔드포인트 문서화
2. `docs/components/` - 컴포넌트 사용법 추가
3. `docs/INDEX.md` - 인덱스 업데이트
4. `README.md` - 필요 시 메인 README 업데이트

## 질문이 있으신가요?

- **이슈**: 기술적 질문은 GitHub Issues에 `question` 라벨로 등록
- **토론**: GitHub Discussions 활용
- **긴급**: 메인테이너에게 직접 연락

---

**감사합니다!** 여러분의 기여가 프로젝트를 더욱 훌륭하게 만듭니다 🙏
