# 🚀 빠른 시작 가이드 (Quick Start Guide)

**Last Updated**: 2025-10-18
**Project**: GitHub Pages 모바일 청첩장
**Status**: ✅ Ready to Use

---

## 목차

- [시작하기 전에](#시작하기-전에)
- [1단계: 프로젝트 클론](#1단계-프로젝트-클론)
- [2단계: 환경 설정](#2단계-환경-설정)
- [3단계: 개인 정보 설정](#3단계-개인-정보-설정)
- [4단계: 로컬 실행](#4단계-로컬-실행)
- [5단계: 배포 준비](#5단계-배포-준비)
- [일반적인 문제 해결](#일반적인-문제-해결)

---

## 시작하기 전에

### 필요한 소프트웨어

| Software | Minimum Version | Download |
|----------|----------------|----------|
| **Node.js** | 18.17.0+ | [nodejs.org](https://nodejs.org) |
| **pnpm** | 8.0.0+ | `npm install -g pnpm` |
| **Git** | 2.30.0+ | [git-scm.com](https://git-scm.com) |
| **VS Code** (권장) | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

### 버전 확인

```bash
# Node.js 버전 확인
node --version
# 출력 예시: v22.0.0

# pnpm 버전 확인
pnpm --version
# 출력 예시: 8.15.0

# Git 버전 확인
git --version
# 출력 예시: git version 2.40.0
```

### 예상 소요 시간

- ⏱️ **설치**: 5-10분
- ⏱️ **설정**: 10-15분
- ⏱️ **로컬 실행**: 1분
- **총 소요 시간**: 약 20-30분

---

## 1단계: 프로젝트 클론

### 옵션 A: 템플릿 사용 (권장)

GitHub에서 "Use this template" 버튼 클릭:

1. [github.com/yourusername/wedding-invitation](https://github.com/yourusername/wedding-invitation)
2. **Use this template** 클릭
3. Repository name: `my-wedding` (원하는 이름)
4. **Create repository from template**

```bash
# 생성한 저장소 클론
git clone https://github.com/YOUR_USERNAME/my-wedding.git
cd my-wedding
```

### 옵션 B: Fork 사용

```bash
# Fork 후 클론
git clone https://github.com/YOUR_USERNAME/wedding-invitation.git
cd wedding-invitation
```

### 옵션 C: 직접 다운로드

```bash
# ZIP 다운로드 후 압축 해제
# 또는 Git 명령어로:
git clone https://github.com/original-author/wedding-invitation.git
cd wedding-invitation

# 원격 저장소 변경
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/my-wedding.git
```

---

## 2단계: 환경 설정

### 의존성 설치

```bash
# pnpm 설치 (아직 없다면)
npm install -g pnpm

# 프로젝트 의존성 설치
pnpm install
```

**설치되는 주요 패키지**:
- `astro` - 프레임워크
- `react`, `react-dom` - UI 라이브러리
- `tailwindcss` - 스타일링
- `typescript` - 타입 시스템
- `vitest` - 테스팅
- `@biomejs/biome` - 린터/포맷터

**설치 완료 확인**:
```bash
pnpm list
# 출력: 프로젝트 의존성 트리
```

### 환경 변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env
```

**`.env` 파일 편집** (VS Code 또는 텍스트 에디터):

```bash
# RSVP 기능을 위한 Google Apps Script URL (나중에 설정)
PUBLIC_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Kakao Maps API Key (나중에 설정)
PUBLIC_KAKAO_MAP_KEY=your_kakao_map_api_key

# 사이트 URL (배포 후 변경)
PUBLIC_SITE_URL=https://yourusername.github.io/wedding-invitation
```

> **참고**: API 키가 없어도 로컬 개발은 가능합니다. RSVP와 지도 기능만 작동하지 않습니다.

---

## 3단계: 개인 정보 설정

### `src/config/site.config.ts` 편집

```typescript
// src/config/site.config.ts
export const siteConfig = {
  // 신부 정보
  bride: {
    name: '김신부',              // ← 여기를 수정하세요
    fullName: '김신부',           // ← 여기를 수정하세요
    parents: {
      father: '김아버지',         // ← 여기를 수정하세요
      mother: '박어머니',         // ← 여기를 수정하세요
    },
    contact: {
      phone: '010-1234-5678',   // ← 여기를 수정하세요
    },
  },

  // 신랑 정보
  groom: {
    name: '이신랑',              // ← 여기를 수정하세요
    fullName: '이신랑',           // ← 여기를 수정하세요
    parents: {
      father: '이아버지',         // ← 여기를 수정하세요
      mother: '최어머니',         // ← 여기를 수정하세요
    },
    contact: {
      phone: '010-9876-5432',   // ← 여기를 수정하세요
    },
  },

  // 결혼식 정보
  event: {
    date: '2025-10-18T14:00:00',  // ← 날짜/시간 수정 (ISO 8601 형식)
    description: '평생을 함께할 두 사람의 첫 걸음에 참석해주세요.',
  },

  // 예식장 정보
  venue: {
    name: '서울 웨딩홀',           // ← 예식장 이름
    address: '서울특별시 강남구 테헤란로 123',  // ← 주소
    floor: '3층',
    hall: '그랜드볼룸',
    coordinates: {
      lat: 37.5665,              // ← 위도 (Kakao Maps에서 확인)
      lng: 126.9780,             // ← 경도
    },
    parking: '3시간 무료 (B1-B3)',
    public_transport: [
      '지하철 2호선 강남역 2번 출구 도보 5분',
      '버스 146, 740번 강남역 하차',
    ],
  },
};
```

### 좌표 찾는 방법

1. [Kakao Maps](https://map.kakao.com) 접속
2. 예식장 검색
3. 주소 클릭 → "공유" → "링크 복사"
4. URL에서 좌표 확인:
   ```
   https://map.kakao.com/link/map/서울웨딩홀,37.5665,126.9780
                                              ↑위도   ↑경도
   ```

---

## 4단계: 로컬 실행

### 개발 서버 시작

```bash
pnpm dev
```

**출력 예시**:
```
🚀 astro v5.0.0 started in 250ms

  ┃ Local    http://localhost:4321/
  ┃ Network  http://192.168.0.10:4321/
```

### 브라우저에서 확인

1. 브라우저 열기
2. `http://localhost:4321` 접속
3. 청첩장 페이지 확인 ✨

### Hot Module Replacement (HMR)

파일을 수정하면 **자동으로 브라우저에 반영**됩니다:

```typescript
// src/config/site.config.ts 수정
bride: {
  name: '새로운 이름',  // ← 저장하면 즉시 반영!
}
```

### 개발 서버 중지

터미널에서 `Ctrl + C`

---

## 5단계: 배포 준비

### 1. 이미지 추가

```bash
# 커버 이미지 (Hero 섹션)
public/images/cover.jpg

# 갤러리 이미지
public/images/gallery/photo-01.jpg
public/images/gallery/photo-02.jpg
# ...
```

**이미지 최적화 권장**:
- 크기: 1920x1080 이하
- 포맷: WebP (또는 JPEG)
- 용량: 500KB 이하

### 2. Google Sheets RSVP 설정 (선택 사항)

**2.1. Google Sheets 생성**:
1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트: "Wedding RSVP"
3. 시트 이름: "RSVP"
4. 헤더 행:
   ```
   Timestamp | Name | Attendance | Guests | Message | Phone
   ```

**2.2. Apps Script 설정**:
1. 확장 프로그램 → Apps Script
2. [RSVP_API.md](../api/RSVP_API.md)의 코드 붙여넣기
3. 배포 → 새 배포 → 웹 앱
4. 웹 앱 URL 복사

**2.3. 환경 변수 업데이트**:
```bash
# .env
PUBLIC_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/SCRIPT_ID/exec
```

### 3. Kakao Maps API 키 발급 (선택 사항)

**3.1. Kakao Developers 가입**:
1. [developers.kakao.com](https://developers.kakao.com)
2. 내 애플리케이션 → 애플리케이션 추가
3. 앱 이름: "My Wedding"

**3.2. API 키 발급**:
1. 앱 설정 → 요약 정보
2. JavaScript 키 복사

**3.3. 플랫폼 등록**:
1. 앱 설정 → 플랫폼
2. Web 플랫폼 등록:
   - 도메인: `https://yourusername.github.io`
   - 도메인: `http://localhost:4321` (개발용)

**3.4. 환경 변수 업데이트**:
```bash
# .env
PUBLIC_KAKAO_MAP_KEY=your_kakao_api_key_here
```

### 4. 빌드 테스트

```bash
# 프로덕션 빌드
pnpm build
```

**출력 예시**:
```
Building for production...
✓ Completed in 3.2s

Pages:
  └─ / (index.html)

Static assets:
  └─ assets/* (CSS, JS, images)

Output: dist/
```

**빌드 결과 미리보기**:
```bash
pnpm preview
```

브라우저에서 `http://localhost:4321` 접속하여 프로덕션 빌드 확인

---

## 일반적인 문제 해결

### 문제 1: `pnpm: command not found`

**원인**: pnpm이 설치되지 않음

**해결**:
```bash
npm install -g pnpm
```

### 문제 2: `Module not found` 에러

**원인**: 의존성 설치 실패

**해결**:
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 문제 3: 포트 4321이 이미 사용 중

**원인**: 다른 프로세스가 4321 포트 사용

**해결**:
```bash
# 다른 포트로 실행
pnpm dev --port 3000
```

### 문제 4: Hot Reload가 작동하지 않음

**원인**: 파일 감시 제한

**해결** (macOS/Linux):
```bash
# 파일 감시 제한 늘리기
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**해결** (Windows):
- 안티바이러스 예외 추가
- VS Code 재시작

### 문제 5: 이미지가 표시되지 않음

**원인**: 이미지 경로 오류

**해결**:
```astro
<!-- ❌ 잘못된 경로 -->
<img src="images/cover.jpg" />

<!-- ✅ 올바른 경로 -->
<img src="/images/cover.jpg" />
```

### 문제 6: Tailwind 스타일이 적용되지 않음

**원인**: Tailwind 설정 누락

**해결**:
```bash
# Tailwind 통합 재설치
pnpm astro add tailwind
```

---

## 다음 단계

### 개발 단계

1. ✅ **로컬 실행 성공** ← 현재 위치
2. ⏭️ **개인 정보 수정** → [site.config.ts](#3단계-개인-정보-설정)
3. ⏭️ **이미지 추가** → `public/images/`
4. ⏭️ **RSVP 설정** → [RSVP_API.md](../api/RSVP_API.md)
5. ⏭️ **배포** → [DEPLOYMENT.md](DEPLOYMENT.md)

### 추천 학습 경로

**초보자**:
1. [PROJECT_PLAN.md](../../PROJECT_PLAN.md) - 프로젝트 전체 이해
2. [TECH_STACK.md](../TECH_STACK.md) - 기술 스택 이해
3. [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md) - 디자인 수정 방법

**개발자**:
1. [OVERVIEW.md](../architecture/OVERVIEW.md) - 아키텍처 이해
2. [ADR-001](../architecture/ADR-001-astro-framework.md) - 기술 결정 배경
3. [CONTRIBUTING.md](../../CONTRIBUTING.md) - 기여 방법

---

## 도움이 필요하신가요?

### 공식 문서

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

### 커뮤니티

- [GitHub Issues](https://github.com/yourusername/wedding-invitation/issues)
- [GitHub Discussions](https://github.com/yourusername/wedding-invitation/discussions)
- [Discord Server](https://discord.gg/your-server) (선택 사항)

### 자주 묻는 질문 (FAQ)

**Q: 코딩을 전혀 모르는데 사용할 수 있나요?**
A: `site.config.ts` 파일만 수정하면 됩니다. 나머지는 그대로 두세요!

**Q: 비용이 얼마나 드나요?**
A: GitHub Pages는 완전 무료입니다. 커스텀 도메인 구매 시 연 1-2만원.

**Q: 모바일에서도 잘 보이나요?**
A: 네! 모바일 우선으로 디자인되었습니다.

**Q: 디자인을 바꿀 수 있나요?**
A: 네! [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md)를 참고하세요.

---

**Last Updated**: 2025-10-18
**Next**: [DEPLOYMENT.md](DEPLOYMENT.md) - 배포 가이드

---

**Navigation**: [← PROJECT_PLAN](../../PROJECT_PLAN.md) | [DEPLOYMENT →](DEPLOYMENT.md) | [README →](../../README.md)
