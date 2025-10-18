# GitHub Pages 모바일 청첩장 서비스 PRD (Product Requirements Document)

**Version**: 1.0
**Last Updated**: 2025-10-18
**Author**: Product Planning Team
**Status**: Draft

---

## Executive Summary

### Background & Context

2025년 디지털 청첩장 시장은 지속 가능성(sustainability)과 모바일 퍼스트(mobile-first) 경험을 중심으로 빠르게 성장하고 있습니다. 특히 GitHub Pages를 활용한 무료 호스팅과 정적 사이트 생성기(SSG) 기술의 발전으로 개발자 친화적이면서도 비용 효율적인 웨딩 웹사이트 구축이 가능해졌습니다.

기존 상용 모바일 청첩장 서비스는 월 구독료나 건당 비용이 발생하지만, GitHub Pages 기반 솔루션은 완전 무료이면서도 커스터마이징과 성능 면에서 우수한 대안을 제공할 수 있습니다.

### Core Value Proposition

**"개발자가 만드는, 무료이면서 아름다운 모바일 청첩장"**

- **Zero Cost**: GitHub Pages 무료 호스팅 + 무료 도메인 (github.io) 또는 커스텀 도메인 연결 가능
- **Full Control**: 코드 레벨의 완전한 커스터마이징, 디자인 자유도 100%
- **High Performance**: 정적 사이트 특성상 로딩 속도 극대화, PWA 적용 가능
- **Developer Experience**: Git 기반 버전 관리, 협업 용이, CI/CD 자동화
- **Privacy First**: 하객 데이터를 제3자 서비스에 의존하지 않고 Google Sheets/Forms로 직접 관리

### Target Success Metrics

| Metric | Target (MVP Launch) | Target (3 Months) |
|--------|---------------------|-------------------|
| 초기 로딩 시간 (3G 네트워크) | < 3초 | < 2초 |
| Lighthouse Performance Score | > 90 | > 95 |
| 모바일 RSVP 완료율 | > 60% | > 75% |
| 브라우저 호환성 | iOS Safari, Chrome, Samsung Internet 100% | 전체 브라우저 95%+ |
| GitHub 프로젝트 Star | - | 100+ |

---

## Problem Statement

### Problem Definition

1. **비용 문제**: 기존 모바일 청첩장 서비스는 건당 1만~5만원 비용 발생, 프리미엄 기능(RSVP, 방명록)은 추가 과금
2. **커스터마이징 제약**: 템플릿 기반 서비스는 디자인 자유도 낮음, 개발자의 창의성 발휘 불가
3. **성능 이슈**: 일부 상용 서비스는 광고/트래커로 인한 로딩 지연, 모바일 데이터 소모 과다
4. **데이터 프라이버시**: 하객 개인정보를 제3자 플랫폼에 저장, 데이터 소유권 불명확
5. **기술 부채**: 레거시 플랫폼은 최신 웹 표준(PWA, WebP, HTTP/2) 미지원

### Target Users

#### Primary User: 예비 부부 (신랑/신부) - 기술 친화적 세그먼트

**Persona 1: "개발자 신랑/신부"**
- **Demographics**: 25~35세, IT/스타트업 종사자, GitHub 사용 경험 보유
- **Goals**:
  - 비용 절감하면서 고품질 청첩장 제작
  - 자신만의 스타일을 코드로 표현
  - 친구들에게 "역시 개발자다운" 인상 주기
- **Pains**:
  - 상용 서비스의 천편일률적 디자인에 불만
  - 불필요한 기능에 대한 과금 거부감
  - Git으로 버전 관리하고 싶은데 방법이 없음
- **Tech Skills**: HTML/CSS 기본 이상, JavaScript 중급, Git 숙련

**Persona 2: "테크 사비 신랑/신부"**
- **Demographics**: 25~35세, 일반 직장인이지만 테크에 관심 많음
- **Goals**:
  - 무료로 멋진 청첩장 만들기
  - 친구(개발자)의 도움 받아 커스터마이징
  - SNS 공유 시 차별화된 경험 제공
- **Pains**:
  - 코드는 모르지만 설정만으로 사용하고 싶음
  - 기술적 문제 발생 시 누구에게 물어봐야 할지 모름
- **Tech Skills**: Git 기초, 설정 파일(YAML/JSON) 수정 가능

#### Secondary User: 하객 (Wedding Guests)

**Persona 3: "모바일 네이티브 하객"**
- **Demographics**: 20~40세, 스마트폰으로 모든 정보 확인
- **Goals**:
  - 빠르게 예식 정보 확인
  - 간편하게 참석 여부 응답
  - 길찾기/교통편 정보 즉시 접근
- **Pains**:
  - 로딩 느린 청첩장 사이트 답답함
  - RSVP 폼이 복잡하거나 에러 발생
  - 모바일에서 지도/캘린더 연동 안 됨
- **Tech Skills**: 일반 사용자 수준

**Persona 4: "시니어 하객"**
- **Demographics**: 50세 이상, 스마트폰 기본 사용 가능
- **Goals**:
  - 큰 글씨로 명확하게 정보 확인
  - 전화번호 클릭해서 바로 통화
  - 지도 앱으로 길찾기
- **Pains**:
  - 작은 글씨/복잡한 인터페이스 불편
  - 애니메이션 과다한 사이트 혼란
  - 버튼 위치 찾기 어려움
- **Tech Skills**: 모바일 기본 조작 가능

### Current Situation (As-Is)

- 개발자 부부들이 상용 서비스 사용 시 커스터마이징 욕구 미충족
- GitHub에 wedding-website 템플릿들이 산재되어 있으나 통합된 솔루션 부재
- Google Sheets를 RSVP DB로 사용하는 프로젝트들이 있으나 한국어 지원/UX 미흡
- 모바일 최적화는 대부분 반응형 수준에 그침 (PWA, 오프라인 지원 없음)

### Desired Future State (To-Be)

- **5분 내 배포**: Fork → 설정 파일 수정 → GitHub Pages 활성화 → 완료
- **한국 문화 최적화**: 한글 타이포그래피, 예식 문구, 축의금 계좌 안내 템플릿 제공
- **모바일 퍼스트**: 3G 환경에서도 2초 이내 로딩, PWA로 홈 화면 추가 가능
- **프라이버시 보호**: 하객 데이터는 본인 Google 계정의 Sheets에만 저장
- **커뮤니티 성장**: 오픈소스 기여자들이 다양한 테마/기능 추가

---

## Goals & Success Metrics

### Business Goals

1. **커뮤니티 확산**: GitHub Star 100+ 달성, 한국어 웨딩 테크 커뮤니티 형성
2. **레퍼런스 구축**: 실제 결혼식 20건 이상에서 사용 사례 확보
3. **기여자 확보**: 코드 기여자 10명 이상, 디자인 테마 5종 이상 확보

### User Goals

**예비 부부 (Creators)**
- 1시간 이내 청첩장 사이트 제작 완료
- 비용 0원으로 프로페셔널한 결과물 획득
- 친구/동료에게 자랑할 수 있는 기술적 차별화

**하객 (Visitors)**
- 3초 이내 핵심 정보(일시/장소) 확인
- 30초 이내 RSVP 완료
- 데이터 걱정 없이 사이트 방문 (< 1MB 로딩)

### KPIs & Measurement Methods

#### User Experience Metrics

| Metric | Measurement Method | Target |
|--------|-------------------|--------|
| Time to First Contentful Paint (FCP) | Lighthouse CI | < 1.5s |
| Largest Contentful Paint (LCP) | Lighthouse CI | < 2.5s |
| Cumulative Layout Shift (CLS) | Lighthouse CI | < 0.1 |
| First Input Delay (FID) | Real User Monitoring | < 100ms |
| Mobile Usability Score | Google Mobile-Friendly Test | 100/100 |
| RSVP Form Completion Rate | Google Analytics 4 Event | > 70% |
| Bounce Rate | Google Analytics 4 | < 30% |
| Avg. Session Duration | Google Analytics 4 | > 2 minutes |

#### Technical Performance Metrics

| Metric | Measurement Method | Target |
|--------|-------------------|--------|
| Total Page Size | Browser DevTools | < 1MB (initial load) |
| Number of HTTP Requests | Browser DevTools | < 20 requests |
| Lighthouse Performance Score | Lighthouse CI | > 90 |
| Lighthouse Accessibility Score | Lighthouse CI | > 95 |
| Lighthouse SEO Score | Lighthouse CI | > 90 |
| Core Web Vitals Pass Rate | Google Search Console | 100% |
| Browser Compatibility | BrowserStack | 95%+ (major browsers) |

#### Adoption Metrics

| Metric | Measurement Method | Target (3 Months) |
|--------|-------------------|-------------------|
| GitHub Stars | GitHub API | 100+ |
| GitHub Forks | GitHub API | 50+ |
| Active Deployments | GitHub Pages Analytics | 30+ |
| Contributors | GitHub Insights | 10+ |
| Issues/PRs Closed | GitHub Insights | 80%+ resolution rate |

### Success Criteria

**MVP Launch Success**
- ✅ 3개 언어(한국어/영어/일본어) 지원
- ✅ Lighthouse Performance 90+ 달성
- ✅ 5개 이상의 디자인 테마 제공
- ✅ Google Sheets 기반 RSVP 완전 작동
- ✅ 문서화(README, 설치 가이드) 완성도 90%+

**3개월 후 성공**
- ✅ 실사용 사례 20건 이상
- ✅ GitHub Star 100+ 달성
- ✅ 커뮤니티 기여 테마 3종 이상 추가
- ✅ 평균 Lighthouse Performance 95+ 유지
- ✅ 버그 리포트 평균 해결 시간 < 7일

---

## Market Research

### Industry Trends (2025)

1. **디지털 청첩장 주류화**: 종이 청첩장 대비 50% 이상이 디지털로 전환 (지속가능성 트렌드)
2. **AR/Interactive Elements**: QR 코드, AR 필터, 애니메이션 효과 활용 증가
3. **Micro-Wedding**: 소규모 결혼식 증가로 RSVP 관리 중요성 증대
4. **Video Invitations**: 개인화된 비디오 메시지 삽입 트렌드
5. **Privacy-First**: GDPR/개인정보보호법 강화로 데이터 자체 관리 선호

### Competitive Landscape

#### 기존 상용 서비스

**국내 서비스**
- **다디단프로젝트, 달팽, 잇츠카드**: 템플릿 기반, 건당 1~5만원, 제한적 커스터마이징
- **강점**: 예쁜 디자인, 비개발자도 쉽게 사용, 고객 지원
- **약점**: 비용 발생, 디자인 자유도 낮음, 광고 포함, 성능 최적화 부족

**해외 서비스**
- **Zola, The Knot, Joy**: 올인원 웨딩 플래닝 + 청첩장, 무료~유료 플랜
- **강점**: 풍부한 기능(레지스트리, 게스트 관리), 높은 완성도
- **약점**: 영어 중심, 한국 문화 미지원, 커스터마이징 제약

#### 오픈소스 경쟁자

**GitHub Wedding Templates**
- **rampatra/wedding-website** (2.9k stars): Jekyll 기반, Google Sheets RSVP
  - 강점: 잘 만들어진 구조, 커뮤니티 활성
  - 약점: 영어 전용, 디자인 옵션 단일, 한국 문화 미지원

- **archakNath/wedding-invitation-website**: 정적 HTML/CSS/JS, 반응형
  - 강점: 의존성 없음, 간단한 구조
  - 약점: 기능 제한적, RSVP 미지원, 유지보수 정체

**우리의 차별화 포인트**
- ✅ **한국어 우선**: 한글 타이포그래피, 예식 문구, 축의금 안내 최적화
- ✅ **모던 기술 스택**: Vite/React 또는 Astro 기반, 최신 웹 표준
- ✅ **PWA 지원**: 오프라인 접근, 홈 화면 추가, 푸시 알림(옵션)
- ✅ **다국어 기본 제공**: 한/영/일 3개 언어 즉시 전환
- ✅ **테마 시스템**: 5종 이상 테마, 커뮤니티 기여 구조
- ✅ **개발자 경험**: 명확한 문서, TypeScript 지원, 컴포넌트 재사용성

---

## User Research

### Personas (Detailed)

#### Persona 1: 개발자 신랑/신부 "민준 & 서연"

**Demographics**
- 나이: 31세 (민준), 29세 (서연)
- 직업: 프론트엔드 개발자 (민준), UX 디자이너 (서연)
- 거주지: 서울
- 연봉: 합산 1억 2천만원
- 기술 수준: Git 일상 사용, React 숙련, Figma 전문가

**Behavioral Patterns**
- 주말에 사이드 프로젝트로 함께 앱 만들기
- GitHub 프로필을 이력서처럼 관리
- 결혼 준비도 Notion으로 프로젝트 관리
- 비용보다 퀀티티와 의미 중시

**Goals**
- 친구들(대부분 개발자)에게 "역시!"라는 반응 얻기
- GitHub으로 결혼 준비 과정도 버전 관리
- 청첩장에 숨겨진 이스터에그 넣기
- 하객 데이터 프라이버시 철저히 보호

**Frustrations**
- 상용 서비스의 "촌스러운" 디자인
- 불필요한 배경음악/애니메이션 강제
- CSS 하나 못 만지는 제약
- 광고 트래커가 심어진 서비스 거부감

**User Journey**
1. Google 검색: "github pages wedding invitation"
2. Repository Fork
3. 설정 파일(config.yml)에서 정보 입력
4. 로컬에서 미리보기 → 수정 반복
5. 커스텀 CSS로 브랜드 컬러 적용
6. GitHub Pages 배포
7. 커스텀 도메인(wedding.example.com) 연결
8. 친구들에게 카톡으로 URL 공유
9. Google Analytics로 방문 추적
10. RSVP 응답 실시간 확인

**Preferred Features**
- Dark mode 토글
- Easter egg (Konami code로 숨겨진 사진 앨범)
- 애니메이션 커스터마이징
- TypeScript 타입 정의 제공
- Lighthouse 100점 달성 가능

#### Persona 2: 테크 사비 신랑/신부 "현우 & 지은"

**Demographics**
- 나이: 28세 (현우), 27세 (지은)
- 직업: 마케터 (현우), 초등교사 (지은)
- 거주지: 경기도
- 연봉: 합산 8천만원
- 기술 수준: Git 기초 사용 가능, 코드는 잘 모름

**Behavioral Patterns**
- 노션 템플릿 활용에 익숙
- 유튜브 보며 DIY 시도
- 비용 절감 중시 (허니문 예산 확보)
- 친구(개발자)에게 도움 요청 가능

**Goals**
- 무료로 예쁜 청첩장 만들기
- 친구 도움 받아 초기 세팅, 이후 혼자 관리
- 특별한 느낌 주기 (다른 사람과 차별화)
- 모바일에서 깔끔하게 보이기

**Frustrations**
- 코드 에러 메시지 이해 안 됨
- 터미널 명령어 무서움
- 설정 파일 형식(YAML) 낯섦
- 도움 받을 사람 찾기 어려움

**User Journey**
1. 친구에게 "무료 청첩장 만드는 법" 물어봄
2. 친구가 GitHub 링크 보내줌
3. 친구 도움으로 Fork & 초기 설정
4. 온라인 에디터(github.dev)로 텍스트만 수정
5. 사진 업로드 방법 README 참고
6. 친구가 배포해줌
7. URL 받아서 SNS 공유
8. RSVP 응답 Google Sheets에서 확인
9. 문제 생기면 친구에게 SOS

**Preferred Features**
- GUI 설정 도구 (코드 수정 없이)
- 명확한 단계별 가이드 (스크린샷 포함)
- 에러 시 친절한 메시지
- 템플릿 프리셋 (클릭 몇 번으로 완성)
- 카카오톡 미리보기 최적화

#### Persona 3: 모바일 네이티브 하객 "수진"

**Demographics**
- 나이: 26세
- 직업: 스타트업 마케터
- 기기: iPhone 14 Pro
- 네트워크: 5G, 가끔 지하철에서 3G

**Behavioral Patterns**
- 모든 정보를 스마트폰으로만 확인
- 카카오톡 링크 → 즉시 열기
- 긴 글 안 읽음, 시각적 정보 선호
- 캘린더/지도 앱 연동 적극 활용

**Goals**
- 3초 안에 언제/어디 파악
- 캘린더에 일정 추가
- 지도 앱으로 길찾기
- 참석 여부 빠르게 응답

**Frustrations**
- 로딩 느린 사이트 (닫아버림)
- 작은 버튼 (손가락으로 누르기 어려움)
- RSVP 폼 에러 (다시 입력 짜증)
- 과도한 애니메이션 (스크롤 답답)

**User Journey**
1. 카카오톡으로 청첩장 링크 수신
2. 링크 클릭 → 모바일 브라우저 오픈
3. 2초 내 로딩 (빠름!)
4. 신랑신부 이름, 날짜, 장소 확인
5. "캘린더 추가" 버튼 클릭 → 자동 등록
6. "길찾기" 버튼 → 카카오맵 앱 실행
7. 아래로 스크롤해서 RSVP 폼 작성
8. "참석합니다" 선택 + 이름 입력 → 제출
9. "응답이 저장되었습니다" 확인 메시지
10. 사이트 닫기

**Preferred Features**
- 초고속 로딩
- 큰 터치 타겟 (최소 44x44px)
- 원클릭 캘린더/지도 연동
- RSVP 자동 완성 (이름만 입력)
- 공유 버튼 (카톡/페북)

#### Persona 4: 시니어 하객 "영희 이모"

**Demographics**
- 나이: 58세
- 직업: 주부
- 기기: Samsung Galaxy A52
- 기술 수준: 기본 앱 사용 가능

**Behavioral Patterns**
- 작은 글씨 읽기 어려움
- 버튼이 어디 있는지 찾기 어려움
- 전화 거는 것을 선호
- 자녀가 도와줌

**Goals**
- 예식 정보 명확히 확인
- 전화번호 클릭해서 신랑신부에게 연락
- 지도 보고 길 찾기
- (가능하면) 참석 여부 전달

**Frustrations**
- 영어 메뉴 이해 안 됨
- 애니메이션 많으면 어지러움
- 버튼인지 아닌지 구분 안 됨
- 폼 작성 중 에러나면 포기

**User Journey**
1. 자녀가 카톡으로 링크 보내줌
2. 링크 클릭 → 사이트 열림
3. 글씨 크기 적당한지 확인 (크면 좋음)
4. 날짜, 장소, 시간 확인
5. 전화번호 클릭 → 통화 연결
6. "축하 전화" 후 종료
7. (나중에) 자녀에게 "참석한다고 전해줘" 요청

**Preferred Features**
- 18px 이상 본문 글씨
- 높은 명도 대비 (WCAG AAA)
- 클릭 가능 영역 명확한 시각적 표시
- 전화번호 자동 링크
- 복잡한 인터랙션 최소화

### Customer Journey Map

| Stage | Actor | Actions | Touchpoints | Emotions | Pain Points | Opportunities |
|-------|-------|---------|-------------|----------|-------------|---------------|
| **Discovery** | 예비 부부 | Google 검색, 친구 추천, GitHub 탐색 | 검색엔진, 개발자 커뮤니티, SNS | 호기심, 기대감 | 어떤 솔루션이 좋을지 모름, 비교 정보 부족 | SEO 최적화, 비교표 제공, 데모 사이트 |
| **Evaluation** | 예비 부부 | 데모 확인, README 읽기, 다른 템플릿과 비교 | GitHub Repository, Live Demo | 탐색적, 비교중 | 기술 난이도 불명확, 설정 복잡도 우려 | 명확한 난이도 표시, 5분 퀵스타트 가이드 |
| **Setup** | 예비 부부 | Fork, 설정 파일 수정, 로컬 실행 | GitHub, VS Code, 터미널 | 설렘, 약간 긴장 | 에러 메시지 이해 안 됨, 디버깅 어려움 | 친절한 에러 메시지, 트러블슈팅 FAQ |
| **Customization** | 예비 부부 | 텍스트 수정, 사진 업로드, 테마 변경 | 에디터, 이미지 최적화 도구 | 창의적, 즐거움 | 이미지 최적화 방법 모름, CSS 수정 두려움 | 이미지 자동 최적화 스크립트, CSS 변수 문서화 |
| **Deployment** | 예비 부부 | GitHub Pages 활성화, 도메인 설정 | GitHub Settings, DNS 관리 | 성취감, 기대감 | 도메인 연결 복잡, HTTPS 설정 혼란 | 배포 자동화 가이드, 도메인 연결 체크리스트 |
| **Distribution** | 예비 부부 | URL 공유, SNS 포스팅, 카톡 발송 | 카카오톡, 인스타그램, 문자 | 뿌듯함, 기대감 | 카톡 미리보기 안 나옴, 이미지 깨짐 | Open Graph 최적화, 미리보기 테스트 도구 |
| **Guest Visit** | 하객 | 링크 클릭, 정보 확인, 스크롤 | 모바일 브라우저 | 축하, 관심 | 로딩 느림, 정보 찾기 어려움 | 초고속 로딩, 정보 계층 최적화 |
| **RSVP** | 하객 | 폼 작성, 참석 여부 선택, 제출 | RSVP Form | 참여, 약간 귀찮음 | 폼 긴장, 입력 에러 | 최소 입력 항목, 자동 완성, 즉시 피드백 |
| **Confirmation** | 하객 | 제출 완료 확인, 캘린더 추가 | 확인 메시지, 캘린더 앱 | 안도, 만족 | 응답 저장됐는지 불확실 | 명확한 성공 메시지, 이메일 확인 (옵션) |
| **Pre-Event** | 하객 | 일정 알림 확인, 길찾기 | 캘린더 알림, 지도 앱 | 준비, 기대 | 장소 찾기 어려움, 주차 정보 부족 | 상세 교통 가이드, 주차장 정보, 실시간 연락처 |
| **Post-Event** | 예비 부부 | RSVP 데이터 분석, 감사 메시지 | Google Sheets, Analytics | 만족, 감사 | 데이터 정리 번거로움 | 자동 통계 대시보드, 감사 메시지 템플릿 |
| **Sharing** | 예비 부부 | GitHub에 피드백, 별점, 포크 공유 | GitHub Issues, SNS | 뿌듯함, 기여 욕구 | 기여 방법 모름 | 기여 가이드, 쇼케이스 페이지 |

---

## User Stories & Use Cases

### Epic 1: 프로젝트 설정 및 배포

**US-001**: Fork 및 초기 설정
- **As a** 예비 신랑/신부 (개발자)
- **I want** GitHub Repository를 Fork하고 기본 설정을 완료하고 싶다
- **So that** 나만의 청첩장 사이트를 빠르게 시작할 수 있다
- **Acceptance Criteria**:
  - [ ] README에 "Fork" 버튼 클릭 가이드 명시
  - [ ] `config.yml` 파일에 모든 설정 항목 주석으로 설명
  - [ ] 필수 설정 항목과 선택 항목 구분 표시
  - [ ] 샘플 데이터가 미리 채워져 있어 구조 이해 가능
  - [ ] 설정 검증 스크립트 제공 (npm run validate-config)

**US-002**: 로컬 개발 환경 구축
- **As a** 예비 신랑/신부 (개발자)
- **I want** 로컬에서 사이트를 실행하고 미리보기하고 싶다
- **So that** 배포 전에 변경사항을 확인할 수 있다
- **Acceptance Criteria**:
  - [ ] `npm install` 또는 `uv pip install` 한 번으로 의존성 설치
  - [ ] `npm run dev` 실행 시 3초 이내 개발 서버 시작
  - [ ] Hot Module Replacement(HMR)로 수정 즉시 반영
  - [ ] 모바일 시뮬레이터 URL 제공 (예: http://localhost:5173?mobile=true)
  - [ ] 에러 발생 시 브라우저에 친절한 오버레이 표시

**US-003**: GitHub Pages 배포
- **As a** 예비 신랑/신부
- **I want** 클릭 몇 번으로 사이트를 온라인에 배포하고 싶다
- **So that** 하객들에게 공유할 수 있다
- **Acceptance Criteria**:
  - [ ] GitHub Actions 워크플로우 자동 실행
  - [ ] Settings → Pages 에서 브랜치만 선택하면 배포
  - [ ] 배포 완료 시간 < 3분
  - [ ] 배포 성공/실패 이메일 알림
  - [ ] https://{username}.github.io/{repo-name} 형식 URL 생성

**US-004**: 커스텀 도메인 연결
- **As a** 예비 신랑/신부 (고급)
- **I want** 내가 소유한 도메인을 연결하고 싶다
- **So that** 더 멋진 URL(wedding.example.com)을 공유할 수 있다
- **Acceptance Criteria**:
  - [ ] CNAME 파일 설정 가이드 제공
  - [ ] DNS 설정 체크리스트 (A record, CNAME)
  - [ ] HTTPS 자동 활성화 확인
  - [ ] 도메인 연결 검증 스크립트 제공
  - [ ] 문제 해결 FAQ (DNS 전파 시간 등)

### Epic 2: 콘텐츠 커스터마이징

**US-005**: 기본 정보 입력
- **As a** 예비 신랑/신부
- **I want** 신랑신부 이름, 예식 일시, 장소를 쉽게 입력하고 싶다
- **So that** 하객들에게 정확한 정보를 전달할 수 있다
- **Acceptance Criteria**:
  - [ ] config.yml에서 한글 입력 완벽 지원
  - [ ] 날짜/시간 형식 자동 검증 (ISO 8601)
  - [ ] 장소 정보에 위도/경도 자동 계산 (주소 입력 시)
  - [ ] 미리보기에서 실시간 반영 확인 가능
  - [ ] 이모지 입력 지원 (💒 ❤️ 등)

**US-006**: 사진 업로드 및 최적화
- **As a** 예비 신랑/신부
- **I want** 예쁜 사진들을 업로드하고 자동으로 최적화하고 싶다
- **So that** 모바일에서 빠르게 로딩되면서도 고화질을 유지할 수 있다
- **Acceptance Criteria**:
  - [ ] `/public/images` 폴더에 원본 이미지 업로드
  - [ ] 빌드 시 자동으로 WebP 변환
  - [ ] 여러 해상도 생성 (srcset)
  - [ ] 이미지 크기 가이드 (권장: 가로 1200px)
  - [ ] Lazy loading 자동 적용

**US-007**: 테마 선택 및 색상 커스터마이징
- **As a** 예비 신랑/신부
- **I want** 여러 테마 중 선택하고 브랜드 색상을 변경하고 싶다
- **So that** 우리만의 스타일을 표현할 수 있다
- **Acceptance Criteria**:
  - [ ] 최소 5개 프리셋 테마 제공 (Classic, Modern, Minimal, Romantic, Playful)
  - [ ] config.yml에서 theme: "modern" 한 줄로 변경
  - [ ] CSS 변수로 primary/secondary 색상 커스터마이징
  - [ ] 컬러 피커 URL 제공 (coolors.co 등)
  - [ ] 다크 모드 지원 (선택 사항)

**US-008**: 다국어 콘텐츠 작성
- **As a** 예비 신랑/신부 (국제 결혼 또는 외국인 하객 다수)
- **I want** 한국어/영어/일본어로 청첩장 내용을 제공하고 싶다
- **So that** 모든 하객이 편하게 정보를 확인할 수 있다
- **Acceptance Criteria**:
  - [ ] 언어 선택 토글 버튼 (우측 상단)
  - [ ] 선택한 언어 로컬 스토리지 저장
  - [ ] 모든 UI 문구 다국어 파일 분리 (/locales)
  - [ ] 날짜/시간 형식 자동 로케일 적용
  - [ ] 번역 파일 예시 제공 (en.json, ja.json)

### Epic 3: 하객 경험 (Mobile UX)

**US-009**: 초고속 초기 로딩
- **As a** 하객
- **I want** 링크 클릭 후 2초 이내에 핵심 정보를 보고 싶다
- **So that** 데이터 걱정 없이 빠르게 확인할 수 있다
- **Acceptance Criteria**:
  - [ ] Total Page Size < 500KB (initial load)
  - [ ] Critical CSS 인라인 삽입
  - [ ] 폰트 preload, subset 최적화
  - [ ] 이미지 압축 및 WebP 제공
  - [ ] Lighthouse Performance Score > 90

**US-010**: 모바일 최적화 레이아웃
- **As a** 하객 (모바일)
- **I want** 세로 화면에 최적화된 깔끔한 레이아웃을 보고 싶다
- **So that** 스크롤하며 정보를 편하게 읽을 수 있다
- **Acceptance Criteria**:
  - [ ] 세로 스크롤 원페이지 구조
  - [ ] 섹션별 명확한 구분 (여백, 배경색)
  - [ ] 최소 터치 타겟 44x44px (iOS HIG 기준)
  - [ ] 텍스트 본문 최소 16px (가독성)
  - [ ] 가로 스크롤 절대 발생 안 함

**US-011**: 캘린더 일정 추가
- **As a** 하객
- **I want** 버튼 클릭 한 번으로 내 캘린더에 일정을 추가하고 싶다
- **So that** 예식 날짜를 잊지 않을 수 있다
- **Acceptance Criteria**:
  - [ ] "캘린더에 추가" 버튼 제공
  - [ ] Google Calendar, Apple Calendar, Outlook 지원
  - [ ] .ics 파일 다운로드 옵션
  - [ ] 일정 정보: 제목, 날짜, 장소, 메모 자동 입력
  - [ ] 모바일에서 네이티브 캘린더 앱 실행

**US-012**: 길찾기 및 지도 연동
- **As a** 하객
- **I want** 버튼 클릭으로 지도 앱을 열어 길찾기를 하고 싶다
- **So that** 예식장까지 길을 잃지 않고 갈 수 있다
- **Acceptance Criteria**:
  - [ ] 지도 API 임베드 (Kakao Map 또는 Google Maps)
  - [ ] "길찾기" 버튼 클릭 시 네이티브 지도 앱 실행
  - [ ] iOS: Apple Maps, Android: Kakao Map/Naver Map 우선
  - [ ] 주소 복사 버튼 제공
  - [ ] 주차 정보, 대중교통 안내 텍스트 추가 가능

**US-013**: 연락처 원클릭 통화
- **As a** 하객 (특히 시니어)
- **I want** 신랑/신부 전화번호를 클릭해 바로 통화하고 싶다
- **So that** 급한 문의를 빠르게 할 수 있다
- **Acceptance Criteria**:
  - [ ] 전화번호 자동 `tel:` 링크 변환
  - [ ] 클릭 시 네이티브 전화 앱 실행
  - [ ] 전화번호 포맷팅 (010-1234-5678)
  - [ ] 신랑측/신부측 연락처 구분 표시
  - [ ] 부모님 연락처 옵션 (선택적 표시)

### Epic 4: RSVP 기능

**US-014**: RSVP 폼 작성
- **As a** 하객
- **I want** 간단한 폼으로 참석 여부를 빠르게 응답하고 싶다
- **So that** 신랑신부에게 내 의사를 전달할 수 있다
- **Acceptance Criteria**:
  - [ ] 필수 항목: 이름, 참석 여부 (참석/불참)
  - [ ] 선택 항목: 동행인 수, 식사 선호, 메시지
  - [ ] 입력 필드 최소화 (< 5개)
  - [ ] 자동 완성 활성화 (name="name", autocomplete)
  - [ ] 실시간 유효성 검사 (이름 필수)

**US-015**: RSVP 데이터 저장
- **As a** 예비 신랑/신부
- **I want** RSVP 응답을 내 Google Sheets에 자동으로 저장하고 싶다
- **So that** 실시간으로 참석자를 파악하고 관리할 수 있다
- **Acceptance Criteria**:
  - [ ] Google Apps Script 연동 가이드 제공
  - [ ] 폼 제출 시 Sheets에 새 행 추가
  - [ ] 타임스탬프, IP 주소(옵션) 자동 기록
  - [ ] 중복 제출 방지 (쿠키 또는 로컬 스토리지)
  - [ ] 제출 성공/실패 명확한 피드백

**US-016**: RSVP 응답 확인 및 수정
- **As a** 하객
- **I want** 내가 제출한 RSVP를 확인하고 필요 시 수정하고 싶다
- **So that** 계획이 변경되어도 대응할 수 있다
- **Acceptance Criteria**:
  - [ ] 제출 완료 후 확인 메시지 표시
  - [ ] "이미 응답하셨습니다" 안내 (쿠키 기반)
  - [ ] 수정 링크 제공 (이메일 또는 고유 토큰)
  - [ ] 수정 시 기존 데이터 불러오기
  - [ ] 수정 이력 Sheets에 별도 기록

**US-017**: RSVP 통계 대시보드
- **As a** 예비 신랑/신부
- **I want** RSVP 응답 통계를 한눈에 보고 싶다
- **So that** 예식 준비 (좌석, 식사)를 효율적으로 할 수 있다
- **Acceptance Criteria**:
  - [ ] Google Sheets 자동 피벗 테이블 템플릿 제공
  - [ ] 참석/불참 비율 차트
  - [ ] 총 인원 수 (동행인 포함)
  - [ ] 일별 응답 추이 그래프
  - [ ] 데이터 내보내기 (CSV, Excel)

### Epic 5: 부가 기능

**US-018**: 갤러리 (사진 앨범)
- **As a** 예비 신랑/신부
- **I want** 우리의 사진들을 갤러리로 보여주고 싶다
- **So that** 하객들이 우리의 스토리를 즐길 수 있다
- **Acceptance Criteria**:
  - [ ] Lightbox 또는 Carousel UI
  - [ ] 이미지 레이지 로딩
  - [ ] 스와이프 제스처 지원 (모바일)
  - [ ] 사진 설명 캡션 추가 가능
  - [ ] 전체 화면 모드 지원

**US-019**: 방명록 (Guest Book)
- **As a** 하객
- **I want** 축하 메시지를 남기고 다른 사람들의 메시지도 보고 싶다
- **So that** 축하 분위기를 함께 만들 수 있다
- **Acceptance Criteria**:
  - [ ] 메시지 작성 폼 (이름, 메시지)
  - [ ] Google Sheets 또는 Firebase 저장
  - [ ] 실시간 또는 새로고침 시 메시지 목록 표시
  - [ ] 욕설 필터링 (선택 사항)
  - [ ] 관리자 승인 후 표시 (옵션)

**US-020**: 라이브 스트리밍 링크
- **As a** 예비 신랑/신부
- **I want** 온라인으로 예식을 시청할 수 있는 링크를 제공하고 싶다
- **So that** 참석하지 못하는 하객들도 함께할 수 있다
- **Acceptance Criteria**:
  - [ ] YouTube Live 또는 Zoom 링크 임베드
  - [ ] 예식 시작 1시간 전부터 링크 표시
  - [ ] "라이브 시청하기" 버튼 (예식 당일만 활성화)
  - [ ] 타임존 자동 변환 (해외 하객)
  - [ ] 라이브 종료 후 다시보기 링크 (옵션)

**US-021**: 축의금 계좌 안내
- **As a** 예비 신랑/신부
- **I want** 축의금 계좌번호를 깔끔하게 안내하고 싶다
- **So that** 하객들이 편리하게 송금할 수 있다
- **Acceptance Criteria**:
  - [ ] 신랑측/신부측 계좌 구분 표시
  - [ ] 계좌번호 복사 버튼 (클립보드)
  - [ ] 카카오페이/토스 송금 링크 (선택 사항)
  - [ ] "마음만 받겠습니다" 문구 옵션
  - [ ] 민감 정보로 기본 숨김, 클릭 시 표시

**US-022**: PWA 설치 (홈 화면 추가)
- **As a** 하객
- **I want** 청첩장을 홈 화면에 추가하고 싶다
- **So that** 예식 당일 빠르게 접근할 수 있다
- **Acceptance Criteria**:
  - [ ] manifest.json 자동 생성
  - [ ] Service Worker로 오프라인 지원
  - [ ] "홈 화면에 추가" 프롬프트
  - [ ] 앱 아이콘 512x512px 제공
  - [ ] 오프라인 시 캐시된 페이지 표시

**US-023**: 소셜 미디어 공유 최적화
- **As a** 예비 신랑/신부
- **I want** 카카오톡/페이스북 공유 시 예쁜 미리보기가 보이길 원한다
- **So that** 더 많은 사람들이 클릭하고 방문할 수 있다
- **Acceptance Criteria**:
  - [ ] Open Graph 메타 태그 자동 생성
  - [ ] og:image 최적 크기 (1200x630px)
  - [ ] og:title, og:description 커스터마이징
  - [ ] Twitter Card 지원
  - [ ] 카카오톡 미리보기 테스트 도구 링크 제공

**US-024**: 애니메이션 및 인터랙션
- **As a** 예비 신랑/신부
- **I want** 세련된 애니메이션으로 사이트를 돋보이게 하고 싶다
- **So that** 하객들에게 특별한 경험을 선사할 수 있다
- **Acceptance Criteria**:
  - [ ] Scroll-triggered fade-in 애니메이션
  - [ ] 부드러운 스크롤 (smooth scroll)
  - [ ] 로딩 애니메이션 (초기 로드 시)
  - [ ] 애니메이션 on/off 토글 (접근성)
  - [ ] 과도하지 않은 적절한 타이밍

---

## Feature Requirements

### Priority Framework: MoSCoW + RICE Score

#### Must Have (P0) - MVP Critical

| Feature ID | Feature | Description | User Value | Success Metric | RICE Score |
|------------|---------|-------------|------------|----------------|------------|
| F-001 | 반응형 레이아웃 | 모바일/태블릿/데스크톱 완벽 대응 | 모든 기기에서 접근 가능 | Mobile Usability 100/100 | 900 |
| F-002 | 기본 정보 표시 | 신랑신부 이름, 날짜, 시간, 장소 | 하객이 필수 정보 확인 | 정보 접근 시간 < 5초 | 1000 |
| F-003 | 지도 연동 | Kakao/Google Maps 임베드 + 길찾기 | 예식장까지 쉽게 도착 | 길찾기 클릭률 > 50% | 800 |
| F-004 | RSVP 기본 폼 | 이름, 참석/불참 선택 | 참석자 수 파악 | RSVP 완료율 > 60% | 850 |
| F-005 | Google Sheets 연동 | RSVP 데이터 자동 저장 | 실시간 응답 수집 | 데이터 손실률 0% | 750 |
| F-006 | 캘린더 추가 | .ics 파일 생성 및 다운로드 | 일정 관리 편의성 | 캘린더 추가율 > 40% | 600 |
| F-007 | 전화 연결 | tel: 링크로 원클릭 통화 | 긴급 연락 편의성 | 전화 클릭률 측정 | 400 |
| F-008 | 성능 최적화 | 이미지 압축, Lazy Loading, 코드 스플리팅 | 빠른 로딩 속도 | LCP < 2.5s | 950 |
| F-009 | SEO & OG 태그 | 메타 태그, Open Graph, sitemap | 검색 노출 & 공유 최적화 | SNS 공유 CTR 측정 | 500 |
| F-010 | 다크 모드 없음 (MVP) | 라이트 모드만 지원 (간소화) | 개발 시간 단축 | - | - |

**RICE Score 계산 예시 (F-002)**
- Reach: 100% (모든 방문자) = 1000명/월
- Impact: 3 (Massive - 없으면 서비스 불가)
- Confidence: 100%
- Effort: 3 person-days
- **RICE = (1000 × 3 × 1.0) / 3 = 1000**

#### Should Have (P1) - High Priority (Post-MVP)

| Feature ID | Feature | Description | User Value | Success Metric | RICE Score |
|------------|---------|-------------|------------|----------------|------------|
| F-101 | 갤러리 | 사진 앨범 + Lightbox | 감성적 스토리텔링 | 갤러리 조회율 > 30% | 450 |
| F-102 | 방명록 | 축하 메시지 작성/조회 | 커뮤니티 참여 유도 | 방명록 작성률 > 15% | 350 |
| F-103 | 축의금 안내 | 계좌번호 + 복사 버튼 | 송금 편의성 | 계좌 복사율 측정 | 550 |
| F-104 | 다국어 지원 | 한/영/일 3개 언어 | 외국인 하객 접근성 | 언어 전환율 측정 | 400 |
| F-105 | PWA 지원 | Service Worker + Manifest | 오프라인 접근, 홈 화면 추가 | PWA 설치율 > 10% | 300 |
| F-106 | 애니메이션 | Scroll reveal, Fade-in | 시각적 매력 증대 | 체류 시간 > 2분 | 250 |
| F-107 | RSVP 확장 | 동행인 수, 식사 선호, 메시지 | 상세 정보 수집 | 확장 항목 입력률 > 50% | 400 |
| F-108 | 테마 시스템 | 5종 프리셋 테마 | 디자인 다양성 | 테마 변경률 측정 | 600 |
| F-109 | 이미지 최적화 도구 | 자동 WebP 변환 + Resize | 성능 향상 | 이미지 크기 50% 감소 | 500 |
| F-110 | 음악 플레이어 (옵션) | 배경 음악 자동/수동 재생 | 감성 연출 | 음악 재생률 측정 | 200 |

#### Could Have (P2) - Nice to Have

| Feature ID | Feature | Description | User Value | Success Metric | RICE Score |
|------------|---------|-------------|------------|----------------|------------|
| F-201 | 라이브 스트리밍 | YouTube/Zoom 임베드 | 원격 참석 지원 | 라이브 시청자 수 | 250 |
| F-202 | 카운트다운 타이머 | D-Day 표시 | 기대감 조성 | 재방문율 측정 | 150 |
| F-203 | 우리 이야기 타임라인 | 연애 스토리 연표 | 스토리텔링 강화 | 타임라인 조회율 | 180 |
| F-204 | 방명록 관리자 모드 | 메시지 승인/삭제 | 스팸 방지 | 스팸 차단율 | 120 |
| F-205 | RSVP 리마인더 | 이메일/SMS 자동 발송 | 응답률 향상 | RSVP 응답률 +10% | 300 |
| F-206 | QR 코드 생성 | URL QR 코드 자동 생성 | 종이 청첩장 연계 | QR 스캔율 측정 | 100 |
| F-207 | 이스터에그 | Konami code로 숨은 콘텐츠 | 재미 요소 | 발견율 측정 | 80 |
| F-208 | 다크 모드 | 라이트/다크 테마 토글 | 시각적 선호 대응 | 다크 모드 사용률 | 220 |
| F-209 | Google Analytics | 방문자 추적 및 분석 | 데이터 기반 개선 | - | 150 |
| F-210 | 접근성 강화 | WCAG 2.1 AAA 준수 | 시니어/장애인 접근성 | Lighthouse A11y > 95 | 350 |

#### Won't Have (Scope 제외)

- **실시간 채팅**: 복잡도 높음, 모더레이션 필요
- **온라인 결제 통합**: 법적/기술적 리스크
- **모바일 앱(네이티브)**: 웹으로 충분, 앱 개발 과중
- **AI 챗봇 안내**: 오버 엔지니어링
- **VR/AR 예식장 투어**: 제작 비용 대비 효과 낮음

---

## Technical Considerations

### Recommended Technology Stack

#### Core Framework: Astro (권장) 또는 Vite + React

**Astro를 선택한 이유**
1. **Zero JS by Default**: 정적 HTML 생성, 필요한 곳만 JS 하이드레이션
2. **Ultra-Fast Performance**: Lighthouse 100점 달성 용이
3. **Component Islands**: React/Vue/Svelte 혼용 가능 (유연성)
4. **Built-in Optimizations**: 이미지 최적화, CSS 번들링 자동화
5. **SSG Perfect Fit**: GitHub Pages 배포에 최적화

**대안: Vite + React**
- 익숙한 개발자 많음, 컴포넌트 재사용성 높음
- 하지만 번들 크기 증가 우려 → React 없이 Vanilla JS도 고려

#### Styling: Tailwind CSS + CSS Variables

- **Tailwind CSS**: 빠른 개발, 일관된 디자인 시스템
- **CSS Variables**: 테마 색상 동적 변경 용이
- **Responsive Utilities**: 모바일 퍼스트 설계 지원

#### State Management: 없음 (단순 정적 사이트)

- 복잡한 상태 관리 불필요
- 필요 시 로컬 스토리지로 충분 (RSVP 중복 방지)

#### Form Handling: Google Apps Script

**장점**
- 무료, 서버리스
- Google Sheets 직접 연동
- 커스텀 로직 추가 가능 (이메일 알림 등)

**단점**
- 초기 설정 복잡도 (가이드 필요)
- 응답 속도 제한 (초당 1-2건)

**대안**
- Netlify Forms (무료 100건/월, 초과 시 유료)
- Formspree (무료 50건/월)
- Firebase Firestore (무료 할당량 충분)

#### Map Integration: Kakao Map API (한국) + Google Maps (국제)

**Kakao Map 선택 이유**
- 한국 내 정확도 최고
- 길찾기 앱 연동 우수 (Kakao Navi)
- 무료 할당량 충분 (월 300,000회)

**Google Maps**
- 해외 하객용 대체
- 다국어 지원 우수

#### Analytics: Google Analytics 4 (선택 사항)

- 방문자 추적, RSVP 전환율 분석
- 프라이버시 정책 명시 필요

#### CI/CD: GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Architecture Requirements

#### Project Structure

```
wedding-invitation/
├── public/
│   ├── images/
│   │   ├── couple.jpg          # 신랑신부 사진
│   │   ├── venue.jpg           # 예식장 사진
│   │   └── gallery/            # 갤러리 이미지들
│   ├── favicon.ico
│   └── manifest.json           # PWA manifest
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── EventInfo.astro
│   │   ├── Map.astro
│   │   ├── RSVP.astro
│   │   ├── Gallery.astro
│   │   ├── GuestBook.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   ├── global.css
│   │   └── themes/
│   │       ├── classic.css
│   │       ├── modern.css
│   │       └── minimal.css
│   ├── locales/
│   │   ├── ko.json
│   │   ├── en.json
│   │   └── ja.json
│   └── utils/
│       ├── config.ts           # 설정 파일 파싱
│       └── analytics.ts        # GA4 헬퍼
├── config.yml                  # 사용자 설정 파일
├── astro.config.mjs
├── tailwind.config.cjs
├── package.json
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml
```

#### config.yml 예시

```yaml
# 기본 정보
groom:
  name: 김민준
  englishName: Minjun Kim
  father: 김아버지
  mother: 이어머니
  phone: 010-1234-5678
bride:
  name: 박서연
  englishName: Seoyeon Park
  father: 박아버지
  mother: 최어머니
  phone: 010-8765-4321

# 예식 정보
wedding:
  date: 2025-06-15
  time: 14:00
  venue:
    name: 더컨벤션 웨딩홀
    address: 서울시 강남구 테헤란로 123
    floor: 3층 그랜드볼룸
    latitude: 37.5012
    longitude: 127.0396
    subway: 강남역 2번 출구 도보 5분
    parking: 3시간 무료 (B1-B3)

# 테마 설정
theme: modern # classic, modern, minimal, romantic, playful
colors:
  primary: "#D4A574"  # 골드
  secondary: "#5C4033" # 브라운

# 기능 활성화
features:
  rsvp: true
  gallery: true
  guestbook: true
  music: false
  livestream: false
  account: true # 축의금 안내

# 다국어
defaultLanguage: ko
enabledLanguages:
  - ko
  - en

# 외부 서비스
google:
  analyticsId: G-XXXXXXXXXX
  sheetsWebAppUrl: https://script.google.com/macros/s/.../exec
kakao:
  mapApiKey: YOUR_KAKAO_API_KEY
```

### Performance Requirements

| Metric | Target | Critical Path |
|--------|--------|---------------|
| **First Contentful Paint (FCP)** | < 1.5s | Critical CSS inline, Font preload |
| **Largest Contentful Paint (LCP)** | < 2.5s | Hero image WebP, 이미지 preload |
| **Cumulative Layout Shift (CLS)** | < 0.1 | 이미지 width/height 명시, 폰트 fallback |
| **Time to Interactive (TTI)** | < 3.5s | JS 코드 스플리팅, Defer non-critical scripts |
| **Total Blocking Time (TBT)** | < 200ms | 긴 작업 분할, Web Worker 활용 (필요 시) |
| **Speed Index** | < 3.0s | Above-the-fold 우선 렌더링 |
| **Total Page Size** | < 1MB | 이미지 압축, tree shaking, minify |

**최적화 체크리스트**
- [ ] 이미지: WebP + AVIF, srcset, lazy loading
- [ ] 폰트: subset (한글 2,350자), preload, font-display: swap
- [ ] CSS: Critical CSS inline, unused CSS 제거
- [ ] JS: 코드 스플리팅, tree shaking, minify + compress
- [ ] HTTP: HTTP/2, Brotli compression
- [ ] Caching: Service Worker, Cache-Control 헤더
- [ ] CDN: jsDelivr for libraries (선택 사항)

### Security & Privacy Requirements

1. **HTTPS 필수**: GitHub Pages 기본 제공
2. **CORS 정책**: Google Apps Script CORS 허용 설정
3. **XSS 방지**: 사용자 입력 sanitize (방명록, RSVP 메시지)
4. **개인정보 처리방침**:
   - Google Sheets 데이터 수집 명시
   - GA4 사용 시 쿠키 동의 배너 (GDPR 대응)
5. **Rate Limiting**: Google Apps Script 요청 제한 (초당 1건)
6. **데이터 최소화**: RSVP 필수 항목 최소화 (이름, 참석 여부만)

### Integration Points

#### Google Sheets RSVP Flow

```
[Web Form]
   ↓ (POST)
[Google Apps Script Web App]
   ↓
[Validation & Sanitization]
   ↓
[Append Row to Google Sheets]
   ↓ (Optional)
[Send Email Notification]
   ↓
[Return Success Response]
   ↓
[Display Confirmation Message]
```

#### Kakao Map Integration

```javascript
// src/components/Map.astro
<script>
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(37.5012, 127.0396),
    level: 3
  };
  const map = new kakao.maps.Map(container, options);

  // 마커 추가
  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(37.5012, 127.0396)
  });
  marker.setMap(map);
</script>
```

#### Calendar Integration (.ics file)

```javascript
// src/utils/calendar.ts
export function generateICS(eventData) {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
UID:${eventData.id}@wedding.example.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(eventData.date)}
SUMMARY:${eventData.title}
LOCATION:${eventData.venue}
DESCRIPTION:${eventData.description}
END:VEVENT
END:VCALENDAR`;

  return new Blob([ics], { type: 'text/calendar' });
}
```

### Technical Constraints

1. **GitHub Pages 제약**
   - 정적 파일만 호스팅 가능 (서버사이드 불가)
   - 1GB 저장소 크기 제한
   - 월 100GB 트래픽 제한 (소프트)
   - 시간당 10회 빌드 제한

2. **브라우저 호환성**
   - 최신 2개 버전 지원 (Chrome, Safari, Firefox, Edge)
   - iOS Safari 12+ (iPhone 6s 이상)
   - Samsung Internet 10+
   - IE 11 지원 안 함 (Polyfill 미제공)

3. **외부 API 의존성**
   - Kakao Map API: 월 300,000회 무료
   - Google Sheets API: 일일 500,000 reads, 50,000 writes
   - GitHub Actions: 월 2,000분 무료 (public repo는 무제한)

4. **성능 제약**
   - Google Apps Script 응답 속도: 평균 200-500ms
   - Kakao Map 로딩: ~100KB 추가 번들
   - 폰트 로딩: 한글 subset ~100KB

---

## Design & UX Requirements

### Design Principles

1. **Mobile First**: 모바일 화면 우선 설계, 태블릿/데스크톱은 확장
2. **Minimalism**: 꼭 필요한 정보만, 시각적 잡음 최소화
3. **Accessibility**: WCAG 2.1 AA 이상 준수 (색상 대비, 키보드 탐색)
4. **Performance as Design**: 빠른 로딩도 UX의 일부
5. **Emotional Connection**: 사진과 타이포그래피로 감성 전달

### UI/UX Guidelines

#### Typography

**한글 폰트**
- **Primary**: Noto Serif KR (세리프, 우아함) - 신랑신부 이름, 제목
- **Secondary**: Noto Sans KR (산세리프, 가독성) - 본문
- **Fallback**: system-ui, -apple-system, sans-serif

**영문 폰트**
- **Primary**: Playfair Display (세리프) - 제목
- **Secondary**: Inter (산세리프) - 본문

**크기 가이드**
- H1 (신랑신부 이름): 32px (모바일), 48px (데스크톱)
- H2 (섹션 제목): 24px (모바일), 32px (데스크톱)
- Body: 16px (모바일), 18px (데스크톱)
- Small: 14px (캡션, 부가 정보)

**행간**
- 한글: 1.7 (가독성 최적)
- 영문: 1.5

#### Color System

**Classic 테마**
- Primary: #C9A96E (골드)
- Secondary: #2C3E50 (네이비)
- Background: #FFFFFF
- Text: #333333
- Accent: #D4AF37 (밝은 골드)

**Modern 테마**
- Primary: #FF6B6B (코랄)
- Secondary: #4ECDC4 (터키블루)
- Background: #F7F7F7
- Text: #1A1A1A
- Accent: #FFE66D (옐로우)

**Minimal 테마**
- Primary: #000000
- Secondary: #808080
- Background: #FFFFFF
- Text: #333333
- Accent: #E0E0E0

**Accessibility**
- 모든 텍스트-배경 조합: 최소 4.5:1 대비 (WCAG AA)
- 중요 정보: 7:1 대비 목표 (WCAG AAA)

#### Spacing System (Tailwind 기반)

- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)

#### Component Design

**버튼**
- 최소 크기: 44x44px (iOS HIG)
- 모서리: 8px border-radius (rounded-lg)
- Primary 버튼: 배경 primary 색상, 흰색 텍스트
- Secondary 버튼: 테두리만, primary 색상 텍스트
- Hover: 투명도 80%, 부드러운 전환

**카드**
- 배경: 흰색 (또는 테마 배경)
- 그림자: shadow-lg (부드러운 입체감)
- 패딩: p-6 (24px)
- 모서리: rounded-xl (12px)

**폼 요소**
- Input: 높이 48px, 패딩 16px, border-gray-300
- Focus: ring-2 ring-primary (접근성)
- Error: border-red-500, 에러 메시지 14px red

**이미지**
- aspect-ratio 유지 (Layout Shift 방지)
- object-fit: cover (일관된 크기)
- rounded-lg (모서리 둥글게)
- Lazy loading (loading="lazy")

### Accessibility Standards

#### WCAG 2.1 AA Compliance

**색상 & 대비**
- [ ] 텍스트 대비 4.5:1 이상
- [ ] 중요 정보 (날짜, 장소) 7:1 목표
- [ ] 색상만으로 정보 전달 금지 (아이콘 병행)

**키보드 탐색**
- [ ] 모든 인터랙티브 요소 Tab으로 접근 가능
- [ ] Focus 상태 명확히 표시 (outline 또는 ring)
- [ ] Skip to content 링크 제공
- [ ] 논리적 Tab 순서 유지

**스크린 리더**
- [ ] 모든 이미지에 alt 텍스트
- [ ] ARIA 레이블 적절히 사용
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] 폼 요소 label 연결

**모바일 접근성**
- [ ] 터치 타겟 최소 44x44px
- [ ] 핀치 줌 활성화 (viewport meta)
- [ ] 가로 스크롤 절대 금지
- [ ] 세로/가로 모드 모두 지원

**시각 장애**
- [ ] 폰트 크기 최소 16px
- [ ] 명도 대비 충분
- [ ] 다크 모드 지원 (선택 사항)

**청각 장애**
- [ ] 배경 음악 자동 재생 금지
- [ ] 음소거 버튼 제공

**운동 장애**
- [ ] 큰 버튼, 넓은 클릭 영역
- [ ] 정밀한 제스처 불필요
- [ ] 시간 제한 없음 (폼 제출)

### Responsive Behavior

#### Breakpoints (Tailwind 기본)

- `sm`: 640px (큰 스마트폰)
- `md`: 768px (태블릿)
- `lg`: 1024px (작은 데스크톱)
- `xl`: 1280px (데스크톱)
- `2xl`: 1536px (큰 모니터)

#### 레이아웃 전략

**모바일 (< 768px)**
- 단일 컬럼 레이아웃
- 전체 너비 섹션
- 스택 형태 (세로 배치)
- 네비게이션: 햄버거 메뉴 또는 하단 고정

**태블릿 (768px - 1023px)**
- 2컬럼 레이아웃 (일부 섹션)
- 그리드: grid-cols-2
- 사이드바 가능

**데스크톱 (1024px+)**
- 최대 너비 제한 (max-w-6xl, 1152px)
- 중앙 정렬 (mx-auto)
- 3컬럼 레이아웃 (갤러리 등)
- 고정 네비게이션 (sticky header)

### Wireframe/Mockup References

#### Mobile Layout (375px 기준)

```
┌─────────────────────┐
│  [Header]           │ ← 고정, 반투명 배경
├─────────────────────┤
│                     │
│   [Hero Image]      │ ← 전체 화면 높이
│  신랑 ❤️ 신부       │
│  2025.06.15         │
│                     │
├─────────────────────┤
│  [Event Info]       │
│  📅 날짜 & 시간     │
│  📍 장소            │
│  [캘린더 추가]      │
│  [길찾기]           │
├─────────────────────┤
│  [Map]              │
│  [지도 임베드]      │
│  교통 안내          │
├─────────────────────┤
│  [RSVP]             │
│  참석 여부 폼       │
│  [제출]             │
├─────────────────────┤
│  [Gallery]          │
│  사진들 (2열)       │
├─────────────────────┤
│  [Account Info]     │
│  💰 축의금 안내     │
│  [계좌 복사]        │
├─────────────────────┤
│  [Footer]           │
│  Contact, Copyright │
└─────────────────────┘
```

#### Desktop Layout (1280px 기준)

```
┌─────────────────────────────────────────┐
│  [Header - Sticky]                      │
├─────────────────────────────────────────┤
│                                         │
│         [Hero - Full Width]             │
│       신랑 ❤️ 신부 (큰 폰트)           │
│                                         │
├─────────────────────────────────────────┤
│  ┌───────────┬───────────┬───────────┐ │
│  │Event Info │   Map     │  RSVP     │ │ ← 3컬럼
│  │           │           │           │ │
│  └───────────┴───────────┴───────────┘ │
├─────────────────────────────────────────┤
│  [Gallery - 4 Column Grid]              │
│  [img][img][img][img]                   │
│  [img][img][img][img]                   │
├─────────────────────────────────────────┤
│  [Footer]                               │
└─────────────────────────────────────────┘
```

**디자인 참고 자료**
- [Behance Wedding Website Designs](https://www.behance.net/search/projects?search=wedding+website)
- [Dribbble Wedding Invitations](https://dribbble.com/tags/wedding-invitation)
- 실제 구현 예시: https://rampatra.com/wedding (rampatra/wedding-website)

---

## Timeline & Milestones

### Development Phases

#### Phase 1: MVP (Milestone 1) - 2 Weeks

**목표**: 핵심 기능만 포함한 배포 가능한 첫 버전

| 주차 | 작업 | 담당 | 완료 기준 |
|-----|------|------|----------|
| Week 1 | 프로젝트 설정 & 레이아웃 | Dev | Astro 프로젝트 생성, 기본 컴포넌트 구조 |
| | 기본 정보 섹션 (Hero, Event Info) | Dev | 신랑신부 이름, 날짜, 장소 표시 |
| | 반응형 레이아웃 구현 | Dev | 모바일/데스크톱 완벽 대응 |
| | 지도 통합 (Kakao Map) | Dev | 지도 표시 + 길찾기 버튼 작동 |
| Week 2 | RSVP 폼 개발 | Dev | 기본 폼 (이름, 참석 여부) |
| | Google Sheets 연동 | Dev | 폼 제출 시 데이터 저장 확인 |
| | 성능 최적화 1차 | Dev | Lighthouse Performance > 85 |
| | README & 문서화 | Dev | 설치 가이드, config.yml 설명 |
| | 배포 자동화 (GitHub Actions) | Dev | Push 시 자동 배포 |

**Deliverables**
- ✅ 배포 가능한 최소 기능 청첩장
- ✅ config.yml 설정 파일
- ✅ README 설치 가이드
- ✅ 1개 테마 (Modern)
- ✅ Lighthouse Performance > 85

**Success Criteria**
- 실제 결혼식 1건 이상 사용 가능
- 모바일에서 RSVP 완료율 > 50%
- 배포 시간 < 5분

---

#### Phase 2: Enhancement (Milestone 2) - 2 Weeks

**목표**: 갤러리, 테마, 다국어 등 부가 기능 추가

| 주차 | 작업 | 담당 | 완료 기준 |
|-----|------|------|----------|
| Week 3 | 갤러리 컴포넌트 | Dev | Lightbox + 레이지 로딩 |
| | 테마 시스템 구축 | Dev | 5개 테마 완성 (Classic, Modern, Minimal, Romantic, Playful) |
| | 축의금 안내 섹션 | Dev | 계좌 복사 기능 |
| | 캘린더 통합 (.ics) | Dev | Google/Apple/Outlook 캘린더 추가 |
| Week 4 | 다국어 지원 (i18n) | Dev | 한/영/일 3개 언어 |
| | 애니메이션 추가 | Dev | Scroll reveal, Fade-in |
| | 이미지 최적화 도구 | Dev | WebP 자동 변환 스크립트 |
| | 성능 최적화 2차 | Dev | Lighthouse Performance > 90 |
| | 문서 업데이트 | Dev | 테마 가이드, 다국어 가이드 |

**Deliverables**
- ✅ 갤러리 기능
- ✅ 5개 테마 선택 가능
- ✅ 다국어 지원 (한/영/일)
- ✅ Lighthouse Performance > 90

**Success Criteria**
- 실사용 사례 5건 이상
- 갤러리 조회율 > 30%
- 다국어 전환율 측정 가능

---

#### Phase 3: Community & Polish (Milestone 3) - 2 Weeks

**목표**: 오픈소스 커뮤니티 구축, 고급 기능 추가

| 주차 | 작업 | 담당 | 완료 기준 |
|-----|------|------|----------|
| Week 5 | 방명록 기능 | Dev | 메시지 작성/조회 |
| | PWA 지원 | Dev | Service Worker, Manifest |
| | 접근성 개선 | Dev | Lighthouse Accessibility > 95 |
| | SEO 최적화 | Dev | sitemap.xml, robots.txt, structured data |
| | 에러 처리 강화 | Dev | 친절한 에러 메시지, Fallback UI |
| Week 6 | 커뮤니티 가이드 작성 | PM | CONTRIBUTING.md, CODE_OF_CONDUCT.md |
| | 쇼케이스 페이지 | PM | 실사용 사례 수집 및 전시 |
| | 이슈 템플릿 | PM | Bug report, Feature request 템플릿 |
| | 테스트 코드 작성 | Dev | 주요 기능 단위 테스트 |
| | 최종 문서화 | PM/Dev | 전체 문서 리뷰 및 완성 |

**Deliverables**
- ✅ 방명록 기능
- ✅ PWA 지원 (오프라인 접근)
- ✅ 쇼케이스 페이지
- ✅ 기여 가이드

**Success Criteria**
- GitHub Star 50+ 달성
- 실사용 사례 10건 이상
- Lighthouse 모든 항목 > 90
- 외부 기여자 PR 1건 이상

---

### Estimated Timeline

```
Week 1-2:   MVP Development          [██████████░░░░░░░░░░]
Week 3-4:   Enhancement               [░░░░░░░░░░██████████░░░░░░]
Week 5-6:   Community & Polish        [░░░░░░░░░░░░░░░░░░░░██████████]
Week 7+:    Maintenance & Growth      [░░░░░░░░░░░░░░░░░░░░░░░░░░░░→]
```

**Total Estimated Time**: 6주 (1.5개월)

**Team Composition** (예상)
- 1명 풀타임 개발자 (또는 2명 파트타임)
- 1명 PM/디자이너 (파트타임)

---

## Risks & Mitigation

| Risk | Category | Probability | Impact | Mitigation Strategy | Owner | Status |
|------|----------|-------------|--------|---------------------|-------|--------|
| Google Apps Script 설정 어려움 | Technical | High | Medium | 상세한 스크린샷 가이드, 비디오 튜토리얼 제작 | Dev | Open |
| 한글 폰트 로딩 느림 | Performance | Medium | High | subset 최적화, preload, FOIT 방지 | Dev | Open |
| 브라우저 호환성 이슈 | Technical | Medium | Medium | BrowserStack 테스트, Polyfill 제공 | Dev | Open |
| RSVP 스팸 제출 | Security | Medium | Low | Rate limiting (Google Apps Script), reCAPTCHA (옵션) | Dev | Open |
| Kakao Map API 할당량 초과 | External | Low | Medium | 사용량 모니터링, Google Maps 대체 옵션 | Dev | Open |
| GitHub Pages 트래픽 제한 | Infrastructure | Low | High | CloudFlare CDN 활용, 이미지 외부 호스팅 (Imgur) | DevOps | Open |
| 사용자 설정 오류 (config.yml) | UX | High | Medium | Validation 스크립트, 명확한 에러 메시지 | Dev | Open |
| 커뮤니티 기여 저조 | Community | Medium | Low | 이슈 라벨링, Good First Issue, Hacktoberfest 참여 | PM | Open |
| 모바일 구형 기기 성능 | Performance | Medium | Medium | 경량 모드 옵션, 애니메이션 비활성화 토글 | Dev | Open |
| 개인정보 보호 규정 위반 | Legal | Low | High | 개인정보 처리방침 명시, 최소 데이터 수집 | PM | Open |

---

## Success Metrics & KPI Dashboard

### 3개월 목표 (MVP 출시 후)

| Category | Metric | Current | Target (1M) | Target (3M) | Measurement |
|----------|--------|---------|-------------|-------------|-------------|
| **Adoption** | GitHub Stars | 0 | 30 | 100 | GitHub API |
| | GitHub Forks | 0 | 15 | 50 | GitHub API |
| | Active Deployments | 0 | 10 | 30 | Google Analytics (unique hosts) |
| | Contributors | 0 | 3 | 10 | GitHub Insights |
| **Performance** | Lighthouse Performance | - | 90 | 95 | Lighthouse CI |
| | Lighthouse Accessibility | - | 90 | 95 | Lighthouse CI |
| | Avg. LCP | - | 2.5s | 2.0s | Real User Monitoring |
| | Total Page Size | - | 800KB | 500KB | Chrome DevTools |
| **Engagement** | RSVP Completion Rate | - | 60% | 75% | GA4 Events |
| | Bounce Rate | - | 35% | 25% | GA4 |
| | Avg. Session Duration | - | 1.5min | 2.5min | GA4 |
| | Gallery View Rate | - | 20% | 35% | GA4 Events |
| **Community** | Issues Opened | 0 | 10 | 30 | GitHub Insights |
| | Issues Resolved Rate | - | 70% | 85% | GitHub Insights |
| | PRs Merged | 0 | 5 | 15 | GitHub Insights |
| | Discord/Community Members | 0 | - | 50 | (If created) |

### North Star Metric

**"실제 결혼식에 사용된 건수"**
- 목표: 3개월 내 30건 이상
- 측정: Showcase 페이지 제출 + Google Analytics (고유 도메인)

---

## Appendix

### Competitive Analysis Matrix

| Feature | 우리 (GitHub Pages) | 다디단프로젝트 | Zola | rampatra/wedding |
|---------|---------------------|--------------|------|------------------|
| **가격** | 무료 | 1~5만원 | 무료~$19/월 | 무료 |
| **커스터마이징** | 100% (코드 레벨) | 제한적 (템플릿) | 중간 (빌더) | 80% (Jekyll) |
| **한국어 지원** | ✅ 최적화 | ✅ 네이티브 | ❌ | ❌ |
| **RSVP** | ✅ Google Sheets | ✅ (유료) | ✅ | ✅ |
| **갤러리** | ✅ | ✅ | ✅ | ✅ |
| **지도** | ✅ Kakao | ✅ Kakao | ✅ Google | ✅ Google |
| **다국어** | ✅ 3개 | ❌ | ✅ | ❌ |
| **PWA** | ✅ | ❌ | ❌ | ❌ |
| **성능** | Lighthouse 95+ | 70~80 | 80~90 | 85+ |
| **기술 장벽** | 중 (개발자) | 하 (GUI) | 하 (빌더) | 중 (Jekyll) |
| **호스팅** | GitHub Pages | 자체 | Zola 호스팅 | GitHub Pages |
| **데이터 소유권** | 100% (본인) | 제3자 | 제3자 | 100% (본인) |

### Market Sizing (한국 시장 기준)

**TAM (Total Addressable Market)**
- 연간 결혼 건수 (한국): ~190,000건 (2024년 기준, 통계청)
- 디지털 청첩장 침투율 가정: 60%
- TAM = 190,000 × 0.6 = **114,000건/년**

**SAM (Serviceable Addressable Market)**
- 타겟: 개발자 또는 테크 사비 신랑/신부
- IT 종사자 비율: ~5% (보수적 추정)
- SAM = 114,000 × 0.05 = **5,700건/년**

**SOM (Serviceable Obtainable Market)**
- 3개월 목표: 30건 → 연간 120건
- 시장 점유율: 120 / 5,700 = **2.1%** (현실적 목표)

### User Interview Insights (가상 시나리오)

**인터뷰 1: 개발자 커플 (민준 & 서연)**
- "상용 서비스는 디자인이 너무 뻔해요. 우리만의 색깔을 넣고 싶어요."
- "GitHub으로 관리하면 변경 이력도 남고, 친구들과 협업도 가능하잖아요."
- "비용보다 퀀티티가 중요해요. 무료면서 성능 좋은 게 최고죠."

**인터뷰 2: 마케터 (현우)**
- "코드는 잘 모르지만 노션 템플릿처럼 쉽게 쓸 수 있으면 좋겠어요."
- "친구(개발자)가 초기 세팅만 도와주면 나머지는 혼자 할 수 있을 것 같아요."
- "무료가 정말 중요해요. 허니문 예산을 아껴야 하거든요."

**인터뷰 3: 하객 (수진)**
- "로딩 느린 청첩장은 바로 닫아버려요. 3초 안에 안 뜨면 짜증나요."
- "RSVP 폼이 복잡하거나 에러 나면 그냥 안 해요. 나중에 카톡으로 보내죠."
- "캘린더 추가 버튼 있으면 정말 편해요. 안 그러면 까먹거든요."

**인터뷰 4: 시니어 하객 (영희 이모)**
- "글씨가 작으면 잘 안 보여요. 돋보기 써야 해요."
- "전화번호 누르면 바로 전화 걸리는 게 제일 편해요."
- "지도는 잘 모르겠고, 주소만 있으면 자녀에게 물어봐요."

### References & Sources

1. **Industry Reports**
   - The Knot 2024 Wedding Trends Report
   - Statista: Digital Wedding Invitation Market Size 2025
   - 통계청: 혼인 통계 (2024)

2. **Technical Documentation**
   - [Astro Docs](https://docs.astro.build/)
   - [Tailwind CSS Docs](https://tailwindcss.com/docs)
   - [Google Apps Script Guide](https://developers.google.com/apps-script)
   - [Kakao Map API](https://apis.map.kakao.com/)

3. **Design Resources**
   - [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
   - [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
   - [Material Design](https://material.io/design)

4. **Competitor Research**
   - 다디단프로젝트: https://www.dddproject.com/
   - 달팽: https://dalpeng.com/
   - Zola: https://www.zola.com/
   - rampatra/wedding-website: https://github.com/rampatra/wedding-website

5. **Web Search Results**
   - "2025 digital wedding invitation trends mobile" (2025-10-18)
   - "GitHub Pages wedding invitation templates popular features" (2025-10-18)
   - "모바일 청첩장 트렌드 2025 RSVP 기능" (2025-10-18)
   - "wedding website best practices UX 2025" (2025-10-18)

---

## Next Steps

### Immediate Actions (이번 주)

1. **기술 스택 최종 확정**
   - [ ] Astro vs Vite+React 결정
   - [ ] Tailwind CSS 설정
   - [ ] Google Apps Script 테스트 계정 생성

2. **프로젝트 초기화**
   - [ ] GitHub Repository 생성
   - [ ] 프로젝트 구조 설정
   - [ ] 기본 컴포넌트 scaffolding

3. **디자인 시스템 정의**
   - [ ] 5개 테마 색상 팔레트 확정
   - [ ] 타이포그래피 규칙 문서화
   - [ ] Figma 와이어프레임 (선택 사항)

### Short-term (2주 내)

1. **MVP 개발 시작**
   - Hero, Event Info, Map, RSVP 컴포넌트
   - Google Sheets 연동 구현
   - 반응형 레이아웃 완성

2. **문서 작성**
   - README 초안
   - config.yml 가이드
   - Google Apps Script 설정 가이드

3. **성능 최적화 1차**
   - Lighthouse CI 설정
   - 이미지 최적화 파이프라인

### Mid-term (1개월 내)

1. **MVP 배포**
   - GitHub Pages 첫 배포
   - 실사용 테스트 (자체 결혼식 또는 친구)
   - 피드백 수집 및 버그 수정

2. **Enhancement 기능 개발**
   - 갤러리, 테마 시스템, 다국어

3. **커뮤니티 준비**
   - 기여 가이드 작성
   - 이슈 템플릿 생성

### Long-term (3개월 내)

1. **커뮤니티 성장**
   - GitHub Star 100+ 목표
   - 쇼케이스 20건 수집
   - 외부 기여자 유치

2. **고급 기능 추가**
   - PWA, 방명록, 라이브 스트리밍 (우선순위에 따라)

3. **지속적인 개선**
   - 성능 모니터링
   - 사용자 피드백 반영
   - 새로운 테마 추가

---

**Document End**

---

## 추가 제안: 구현 시작 가이드

이 PRD를 바탕으로 바로 구현을 시작하시려면:

### Option 1: Astro 기반 (권장)

```bash
# 프로젝트 생성
npm create astro@latest wedding-invitation

# 의존성 설치
cd wedding-invitation
npm install -D tailwindcss @astrojs/tailwind
npx astro add tailwind

# 개발 서버 실행
npm run dev
```

### Option 2: Vite + React

```bash
# 프로젝트 생성
npm create vite@latest wedding-invitation -- --template react-ts
cd wedding-invitation
npm install

# Tailwind CSS 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 개발 서버 실행
npm run dev
```

### 다음 단계

1. **이 PRD를 팀과 공유**하여 피드백 받기
2. **기술 스택 확정** 후 프로젝트 초기화
3. **GitHub Project Board** 생성하여 User Story 트래킹
4. **첫 커밋**: README와 config.yml 템플릿 작성

**질문이나 추가 요구사항이 있으시면 언제든 말씀해주세요!**
