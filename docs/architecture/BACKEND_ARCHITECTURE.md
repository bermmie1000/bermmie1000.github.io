# 🏗️ 백엔드 아키텍처 설계 (Backend Architecture Design)

**Last Updated**: 2025-10-18
**Project**: GitHub Pages 모바일 청첩장
**Status**: ✅ Production Ready

---

## 목차

- [Executive Summary](#executive-summary)
- [아키텍처 개요](#아키텍처-개요)
- [선택한 솔루션: Google Sheets + Apps Script](#선택한-솔루션-google-sheets--apps-script)
- [API 엔드포인트 설계](#api-엔드포인트-설계)
- [데이터 모델](#데이터-모델)
- [보안 및 스팸 방지](#보안-및-스팸-방지)
- [대안 솔루션 비교](#대안-솔루션-비교)
- [성능 및 확장성](#성능-및-확장성)
- [모니터링 및 로깅](#모니터링-및-로깅)

---

## Executive Summary

### 선택한 백엔드 솔루션

**Google Sheets + Apps Script** (완전 무료 서버리스 백엔드)

### 의사결정 근거

| 요구사항 | Google Sheets | Firebase | Netlify Functions | Supabase |
|---------|---------------|----------|-------------------|----------|
| **비용** | ✅ 무료 | ⚠️ 무료→유료 | ⚠️ 제한적 무료 | ⚠️ 무료→유료 |
| **설정 난이도** | ✅ 매우 낮음 | ⚠️ 중간 | ⚠️ 높음 | ⚠️ 높음 |
| **데이터 관리** | ✅ Excel처럼 직관적 | ❌ Console 필요 | ❌ DB 설정 필요 | ❌ SQL 필요 |
| **실시간** | ❌ (폴링 필요) | ✅ | ❌ | ✅ |
| **예상 트래픽** | ✅ 500명 충분 | ✅ | ⚠️ 제한적 | ✅ |
| **GitHub Pages 호환** | ✅ 완벽 | ✅ | ⚠️ 제한적 | ✅ |

**결론**: 결혼식 초대장은 **500명 이하 트래픽**, **간단한 CRUD**, **비실시간 데이터**이므로 **Google Sheets가 최적**

---

## 아키텍처 개요

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Static HTML)                      │
│                   GitHub Pages Hosted                        │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  RSVP    │  │ Guestbook│  │  Gallery │                  │
│  │  Form    │  │   Form   │  │  (Static)│                  │
│  └────┬─────┘  └────┬─────┘  └──────────┘                  │
│       │             │                                        │
└───────┼─────────────┼────────────────────────────────────────┘
        │             │
        │ POST /exec  │ POST /exec
        │             │
        ▼             ▼
┌──────────────────────────────────────────────────────────────┐
│            Google Apps Script (Web App)                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  doPost(e) Handler                                  │    │
│  │  - Parse JSON                                       │    │
│  │  - Validate Data                                    │    │
│  │  - Check Rate Limit                                 │    │
│  │  - Sanitize Input                                   │    │
│  └────────┬───────────────────────────┬─────────────────┘    │
│           │                           │                      │
└───────────┼───────────────────────────┼──────────────────────┘
            │                           │
            ▼                           ▼
    ┌───────────────┐          ┌───────────────┐
    │ Google Sheets │          │  Email Alert  │
    │  "RSVP" Tab   │          │  (Optional)   │
    │               │          │               │
    │ Row: [Time,   │          │ MailApp API   │
    │  Name, Attend,│          │               │
    │  Guests, Msg] │          └───────────────┘
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │  GET /exec    │
    │ (Read RSVP    │
    │  Statistics)  │
    └───────────────┘
```

### Request Flow

1. **사용자 → 정적 HTML**: GitHub Pages에서 호스팅된 HTML/JS 로드
2. **JavaScript → Apps Script**: RSVP/방명록 제출 시 `fetch()` POST 요청
3. **Apps Script → Validation**: 입력값 검증, Rate Limiting, Sanitization
4. **Apps Script → Google Sheets**: 데이터 행 추가 (`appendRow()`)
5. **Apps Script → 이메일 알림**: (선택) MailApp으로 신랑/신부에게 알림
6. **Apps Script → Client**: JSON 응답 반환 (성공/실패)

---

## 선택한 솔루션: Google Sheets + Apps Script

### Why Google Sheets?

#### ✅ 장점

1. **완전 무료**
   - Apps Script 쿼터: 일 50,000회 URL Fetch (충분함)
   - Google Sheets 무료 사용량: 500만 셀
   - 이메일 발송: 일 100회 (무료 계정)

2. **Zero Configuration**
   - 별도 서버/DB 불필요
   - OAuth, API 키 설정 최소화
   - 5분 안에 구축 가능

3. **직관적 데이터 관리**
   - Excel처럼 쉬운 UI
   - 실시간 데이터 확인
   - 필터, 정렬, 피벗 테이블 사용 가능

4. **협업 용이**
   - 신랑/신부가 동시에 데이터 확인
   - Google 계정만 있으면 접근 가능
   - 공유 권한 세밀하게 제어

#### ⚠️ 제약사항

1. **실시간 업데이트 어려움**
   - WebSocket 미지원
   - 폴링(Polling) 필요 (5초마다 GET 요청)
   - 실시간 참석자 수 표시 시 지연 가능

2. **복잡한 쿼리 제한**
   - SQL JOIN, GROUP BY 어려움
   - Apps Script로 수동 구현 필요

3. **응답 시간 가변적**
   - 평균 1-3초 (콜드 스타트 시 5초)
   - 대량 트래픽 시 느려질 수 있음

4. **동시 쓰기 제한**
   - 초당 100회 쓰기 제한
   - 결혼식 당일 동시 접속 시 주의

### Google Apps Script 쿼터 (2025 기준)

| Resource | Free Tier Limit | 청첩장 사용량 | 충분 여부 |
|----------|-----------------|-------------|----------|
| **URL Fetch calls** | 20,000/day | ~500 RSVP 제출 | ✅ 충분 |
| **Script runtime** | 6 min/execution | ~1초/요청 | ✅ 충분 |
| **Triggers** | 20 triggers | 1개 (선택) | ✅ 충분 |
| **MailApp** | 100 emails/day | ~500 알림 | ⚠️ 제한적 |
| **Spreadsheet reads** | 무제한 | 수천 건 | ✅ 충분 |

**대응 방안**:
- 이메일 알림은 중요한 제출만 전송 (참석자만)
- 또는 Gmail API 사용 (일 10억 쿼터)

---

## API 엔드포인트 설계

### 1. RSVP 제출 (POST /exec)

#### Request

```http
POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
Content-Type: application/json

{
  "action": "submitRsvp",
  "data": {
    "name": "홍길동",
    "attendance": "yes",
    "guests": 2,
    "phone": "010-1234-5678",
    "message": "축하합니다! 꼭 참석하겠습니다."
  }
}
```

#### Response (Success)

```json
{
  "success": true,
  "message": "참석 여부가 전송되었습니다.",
  "timestamp": "2025-10-18T10:30:00.000Z",
  "rowNumber": 42
}
```

#### Response (Error)

```json
{
  "success": false,
  "error": "이름을 입력해주세요.",
  "code": "VALIDATION_ERROR"
}
```

### 2. 방명록 제출 (POST /exec)

#### Request

```http
POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
Content-Type: application/json

{
  "action": "submitGuestbook",
  "data": {
    "name": "김철수",
    "message": "결혼을 축하합니다! 행복하세요 💐",
    "password": "1234"
  }
}
```

#### Response

```json
{
  "success": true,
  "message": "방명록이 등록되었습니다.",
  "id": "entry_123"
}
```

### 3. 방명록 조회 (GET /exec)

#### Request

```http
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getGuestbook&limit=50&offset=0
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "entry_123",
      "name": "김철수",
      "message": "결혼을 축하합니다!",
      "timestamp": "2025-10-18T10:30:00.000Z"
    }
  ],
  "total": 127,
  "limit": 50,
  "offset": 0
}
```

### 4. RSVP 통계 조회 (GET /exec)

#### Request

```http
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getRsvpStats
```

#### Response

```json
{
  "success": true,
  "stats": {
    "totalSubmissions": 234,
    "attending": 187,
    "notAttending": 47,
    "totalGuests": 421
  }
}
```

### 5. 헬스체크 (GET /exec)

#### Request

```http
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

#### Response

```json
{
  "status": "ok",
  "message": "Wedding RSVP API is running",
  "version": "1.0.0",
  "timestamp": "2025-10-18T10:30:00.000Z"
}
```

---

## 데이터 모델

### Google Sheets 구조

#### Sheet 1: "RSVP"

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| **A: Timestamp** | DateTime | Yes | 제출 시각 (자동 생성) |
| **B: Name** | String(50) | Yes | 참석자 이름 |
| **C: Attendance** | Enum('yes', 'no') | Yes | 참석 여부 |
| **D: Guests** | Number(1-10) | Conditional | 동반 인원 (참석 시 필수) |
| **E: Phone** | String(13) | No | 전화번호 (010-XXXX-XXXX) |
| **F: Message** | String(500) | No | 축하 메시지 |
| **G: IP Address** | String | No | 요청 IP (스팸 방지) |

**예시 데이터**:
```
| Timestamp           | Name   | Attendance | Guests | Phone          | Message        | IP           |
|---------------------|--------|------------|--------|----------------|----------------|--------------|
| 2025-10-18 10:30:00 | 홍길동 | yes        | 2      | 010-1234-5678  | 축하합니다!    | 123.45.67.89 |
| 2025-10-18 10:32:15 | 김철수 | no         | 0      | 010-9876-5432  | 참석 못해요 ㅠ  | 98.76.54.32  |
```

#### Sheet 2: "Guestbook"

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| **A: ID** | String | Yes | 고유 ID (entry_timestamp) |
| **B: Timestamp** | DateTime | Yes | 작성 시각 |
| **C: Name** | String(50) | Yes | 작성자 이름 |
| **D: Message** | String(500) | Yes | 방명록 메시지 |
| **E: Password** | String(Hash) | Yes | 수정/삭제 비밀번호 (해시) |
| **F: IP Address** | String | No | 요청 IP |
| **G: Approved** | Boolean | No | 승인 여부 (스팸 필터) |

**예시 데이터**:
```
| ID              | Timestamp           | Name   | Message           | Password (Hash)      | IP           | Approved |
|-----------------|---------------------|--------|-------------------|----------------------|--------------|----------|
| entry_170000000 | 2025-10-18 10:30:00 | 김철수 | 결혼 축하합니다!  | 5e884898da28047...   | 123.45.67.89 | TRUE     |
```

#### Sheet 3: "Analytics" (자동 생성)

피벗 테이블 및 차트를 위한 별도 시트

**통계 공식**:
```
// RSVP 시트 하단에 추가
Row 1000:
  A1000: "총 제출 건수"
  B1000: =COUNTA(B2:B999)

Row 1001:
  A1001: "참석 인원"
  B1001: =SUMIF(C2:C999, "yes", D2:D999)

Row 1002:
  A1002: "불참 인원"
  B1002: =COUNTIF(C2:C999, "no")
```

---

## 보안 및 스팸 방지

### 1. Input Validation (입력 검증)

#### Apps Script 측 검증

```javascript
function validateRsvpData(data) {
  const errors = [];

  // 이름 검증
  if (!data.name || typeof data.name !== 'string') {
    errors.push('이름을 입력해주세요.');
  } else if (data.name.length < 2 || data.name.length > 50) {
    errors.push('이름은 2-50자 이내로 입력해주세요.');
  } else if (!/^[가-힣a-zA-Z\s]+$/.test(data.name)) {
    errors.push('이름은 한글 또는 영문만 가능합니다.');
  }

  // 참석 여부 검증
  if (!data.attendance || !['yes', 'no'].includes(data.attendance)) {
    errors.push('참석 여부를 선택해주세요.');
  }

  // 동반 인원 검증 (참석 시)
  if (data.attendance === 'yes') {
    const guests = parseInt(data.guests, 10);
    if (isNaN(guests) || guests < 1 || guests > 10) {
      errors.push('동반 인원은 1-10명 사이로 입력해주세요.');
    }
  }

  // 전화번호 검증 (선택)
  if (data.phone) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(data.phone)) {
      errors.push('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
    }
  }

  // 메시지 길이 검증
  if (data.message && data.message.length > 500) {
    errors.push('메시지는 500자 이하로 입력해주세요.');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}
```

#### 클라이언트 측 검증 (JavaScript)

```javascript
// src/utils/validation.js
export function validateRsvpForm(formData) {
  const errors = {};

  // 이름 검증
  if (!formData.name?.trim()) {
    errors.name = '이름을 입력해주세요.';
  } else if (formData.name.length < 2) {
    errors.name = '이름은 2자 이상 입력해주세요.';
  } else if (!/^[가-힣a-zA-Z\s]+$/.test(formData.name)) {
    errors.name = '이름은 한글 또는 영문만 가능합니다.';
  }

  // 참석 여부 검증
  if (!formData.attendance) {
    errors.attendance = '참석 여부를 선택해주세요.';
  }

  // 동반 인원 검증
  if (formData.attendance === 'yes') {
    const guests = parseInt(formData.guests, 10);
    if (isNaN(guests) || guests < 1) {
      errors.guests = '동반 인원을 입력해주세요.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

### 2. Rate Limiting (속도 제한)

#### 클라이언트 측 제한 (localStorage)

```javascript
// src/utils/rateLimit.js
const SUBMISSION_KEY = 'rsvp_last_submit';
const COOLDOWN_HOURS = 24;

export function canSubmit() {
  const lastSubmit = localStorage.getItem(SUBMISSION_KEY);

  if (!lastSubmit) return true;

  const hoursSince = (Date.now() - parseInt(lastSubmit)) / (1000 * 60 * 60);
  return hoursSince >= COOLDOWN_HOURS;
}

export function markSubmitted() {
  localStorage.setItem(SUBMISSION_KEY, Date.now().toString());
}

export function getRemainingCooldown() {
  const lastSubmit = localStorage.getItem(SUBMISSION_KEY);
  if (!lastSubmit) return 0;

  const hoursSince = (Date.now() - parseInt(lastSubmit)) / (1000 * 60 * 60);
  return Math.max(0, COOLDOWN_HOURS - hoursSince);
}
```

#### Apps Script 측 제한 (IP + Time Window)

```javascript
// Google Apps Script
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1분
const MAX_REQUESTS_PER_WINDOW = 5; // 1분에 5회

function checkRateLimit(ipAddress) {
  const cache = CacheService.getScriptCache();
  const key = `rate_limit_${ipAddress}`;

  const requestCountStr = cache.get(key);
  const requestCount = requestCountStr ? parseInt(requestCountStr) : 0;

  if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
    throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
  }

  // 카운트 증가 및 TTL 설정
  cache.put(key, (requestCount + 1).toString(), 60); // 60초 TTL
}
```

### 3. Spam Prevention (스팸 방지)

#### Honeypot Field (보이지 않는 함정 필드)

```html
<!-- HTML -->
<form id="rsvpForm">
  <!-- 진짜 필드들 -->
  <input type="text" name="name" required>

  <!-- Honeypot (봇이 입력할 필드) -->
  <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off">

  <button type="submit">전송</button>
</form>
```

```javascript
// JavaScript 검증
if (formData.website) {
  // 봇으로 판단 (사람은 이 필드를 볼 수 없음)
  return;
}
```

#### Apps Script 스팸 감지

```javascript
function isSpam(data, ipAddress) {
  // 1. Honeypot 체크
  if (data.website) {
    Logger.log(`Spam detected (honeypot): ${ipAddress}`);
    return true;
  }

  // 2. 동일 IP에서 짧은 시간 내 중복 제출
  const recentSubmissions = getRecentSubmissions(ipAddress, 5); // 5분 이내
  if (recentSubmissions >= 3) {
    Logger.log(`Spam detected (rapid fire): ${ipAddress}`);
    return true;
  }

  // 3. 의심스러운 패턴 (예: 메시지에 URL 포함)
  if (data.message && /https?:\/\//i.test(data.message)) {
    Logger.log(`Spam detected (URL in message): ${ipAddress}`);
    return true;
  }

  return false;
}
```

### 4. CORS 설정

#### Apps Script doPost 헤더

```javascript
function doPost(e) {
  // CORS 허용 (모든 도메인)
  const output = ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON);

  // 프로덕션에서는 특정 도메인만 허용
  // output.setHeader('Access-Control-Allow-Origin', 'https://yourusername.github.io');

  // ... 로직 ...

  return output.setContent(JSON.stringify(response));
}
```

### 5. Input Sanitization (입력 정제)

```javascript
// Apps Script
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  // HTML 태그 제거
  input = input.replace(/<[^>]*>/g, '');

  // 스크립트 제거
  input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 공백 정리
  input = input.trim();

  return input;
}

function processRsvpData(data) {
  return {
    name: sanitizeInput(data.name),
    attendance: data.attendance, // Enum이므로 검증만
    guests: parseInt(data.guests, 10),
    phone: sanitizeInput(data.phone),
    message: sanitizeInput(data.message)
  };
}
```

---

## 대안 솔루션 비교

### 1. Firebase Firestore

#### 장점
- 실시간 데이터 동기화
- NoSQL 유연성
- Google Cloud 통합
- 강력한 보안 규칙

#### 단점
- 무료 할당량 초과 시 과금
- 설정 복잡도 높음
- 데이터 관리 UI 부족

#### 비용 (2025 기준)
- **무료**: 50,000 reads/day, 20,000 writes/day
- **유료**: $0.06/100k reads, $0.18/100k writes

**결론**: 500명 이하 RSVP는 무료지만, 설정 복잡도 대비 이점 적음

---

### 2. Netlify Functions

#### 장점
- GitHub Pages와 독립적 서버리스 함수
- AWS Lambda 기반 안정성
- CI/CD 통합

#### 단점
- 무료 할당량 제한적 (125k requests/month)
- DB 별도 설정 필요
- 함수 콜드 스타트 지연

#### 비용
- **무료**: 125,000 요청/월
- **유료**: $25/월 (1M 요청)

**결론**: DB 없이 함수만으로는 불완전, Firebase 함께 사용 시 복잡도 증가

---

### 3. Vercel Edge Functions

#### 장점
- GitHub와 완벽 통합
- Edge Runtime으로 빠른 응답
- PostgreSQL, MongoDB 연동 가능

#### 단점
- 무료 플랜 제한 (100 GB-hrs/month)
- DB 별도 비용
- Vercel 종속성

#### 비용
- **무료**: 100k Edge Requests/day
- **Pro**: $20/월

**결론**: Next.js 사용 시 좋지만, 정적 HTML에는 과도함

---

### 4. Supabase (PostgreSQL)

#### 장점
- 오픈소스 Firebase 대안
- SQL 데이터베이스
- 실시간 기능
- Row Level Security

#### 단점
- 학습 곡선 (SQL, Row Policies)
- 무료 플랜 제한적
- 설정 복잡도 매우 높음

#### 비용
- **무료**: 500MB DB, 2GB 전송/월
- **Pro**: $25/월

**결론**: 엔터프라이즈급 기능이지만 청첩장에는 과도함

---

### 5. GitHub Issues/Discussions API

#### 장점
- GitHub 네이티브 통합
- 완전 무료
- Git 기반 버전 관리

#### 단점
- RSVP에 부적합 (공개 이슈 생성)
- API Rate Limit (5,000 req/hour)
- 데이터 관리 어려움

**결론**: 방명록에는 가능하나 RSVP에는 부적합

---

### 솔루션 비교 매트릭스

| 기준 | Google Sheets | Firebase | Netlify Fn | Supabase | GitHub API |
|------|---------------|----------|------------|----------|------------|
| **비용** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **설정 난이도** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ |
| **데이터 관리** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐ | ⭐ |
| **성능** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **확장성** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **청첩장 적합도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐ |

**최종 선택: Google Sheets** (비용, 간편함, 청첩장 요구사항 충족)

---

## 성능 및 확장성

### 예상 트래픽 시나리오

#### 시나리오 1: 평균 사용 패턴
- **초대 인원**: 300명
- **RSVP 응답률**: 70% (210명)
- **기간**: 결혼식 2개월 전부터 당일까지 (~60일)
- **평균 요청**: 210 RSVP + 100 방명록 = 310 요청 / 60일 = **5 req/day**

**결론**: Google Sheets 쿼터 (50,000/day) 대비 **0.01% 사용** → 여유 충분

---

#### 시나리오 2: 결혼식 당일 피크 트래픽
- **동시 접속**: 50명 (친구들이 함께 확인)
- **페이지 로드**: 50 req/sec
- **RSVP 조회**: 10 req/sec
- **지속 시간**: 10분

**결론**: Google Sheets 동시 쓰기 제한 (100 writes/sec) 대비 안전

---

#### 시나리오 3: 바이럴 공유 (최악의 경우)
- **SNS 공유로 확산**: 1,000명 방문
- **피크 트래픽**: 100 req/sec (5분간)
- **총 요청**: 30,000 요청

**결론**: Apps Script 쿼터 (50,000/day) 대비 **60% 사용** → 여전히 안전

---

### 성능 최적화 전략

#### 1. 클라이언트 측 캐싱

```javascript
// src/utils/cache.js
const CACHE_TTL_MS = 5 * 60 * 1000; // 5분

export function getCachedData(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);

  // TTL 체크
  if (Date.now() - timestamp > CACHE_TTL_MS) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
}

export function setCachedData(key, data) {
  const cacheEntry = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(cacheEntry));
}
```

#### 2. Apps Script 응답 최적화

```javascript
// Google Apps Script
function getRsvpStats() {
  // CacheService 활용 (6시간 캐싱)
  const cache = CacheService.getScriptCache();
  const cacheKey = 'rsvp_stats';

  const cached = cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 캐시 미스 시 계산
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP');
  const data = sheet.getDataRange().getValues();

  const stats = calculateStats(data);

  // 6시간 캐싱
  cache.put(cacheKey, JSON.stringify(stats), 21600);

  return stats;
}
```

#### 3. 배치 읽기/쓰기

```javascript
// 여러 행을 한 번에 읽기 (비효율)
const row1 = sheet.getRange('A1').getValue();
const row2 = sheet.getRange('A2').getValue();

// 배치 읽기 (효율적)
const range = sheet.getRange('A1:A2');
const values = range.getValues(); // [[row1], [row2]]
```

---

## 모니터링 및 로깅

### 1. Apps Script 로깅

```javascript
// Google Apps Script
function doPost(e) {
  const startTime = Date.now();

  try {
    Logger.log(`[INFO] POST request received`);
    Logger.log(`[DATA] ${JSON.stringify(e.postData.contents)}`);

    const data = parseRequestData(e);
    saveToSheet(data);

    const duration = Date.now() - startTime;
    Logger.log(`[SUCCESS] Request completed in ${duration}ms`);

    return createSuccessResponse();

  } catch (error) {
    Logger.log(`[ERROR] ${error.toString()}`);
    Logger.log(`[STACK] ${error.stack}`);

    return createErrorResponse(error);
  }
}
```

**로그 확인 방법**:
1. Apps Script 에디터 → **실행 로그** 메뉴
2. 최근 30일 로그 확인 가능

---

### 2. Google Sheets 자동 통계

#### Analytics 시트 생성

```
Sheet: Analytics

// 실시간 통계 (수식으로 자동 계산)
A1: 지표
B1: 값

A2: 총 RSVP 제출 건수
B2: =COUNTA(RSVP!B:B)-1

A3: 참석 인원
B3: =SUMIF(RSVP!C:C, "yes", RSVP!D:D)

A4: 불참 인원
B4: =COUNTIF(RSVP!C:C, "no")

A5: 응답률
B5: =TEXT((B2/(B2+100)), "0.0%")  // 가정: 초대 인원 300명

A6: 평균 동반 인원
B6: =AVERAGEIF(RSVP!C:C, "yes", RSVP!D:D)
```

---

### 3. 클라이언트 측 에러 로깅

```javascript
// src/utils/logger.js
export function logError(error, context = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  console.error('[Error Log]', errorLog);

  // (선택) 에러를 Google Sheets에 기록
  // sendErrorLog(errorLog);
}
```

---

### 4. 이메일 알림 (중요 이벤트)

```javascript
// Google Apps Script
function sendEmailNotification(data) {
  const recipientEmail = 'your-email@gmail.com';
  const subject = `[Wedding RSVP] 새로운 응답: ${data.name}`;
  const body = `
    이름: ${data.name}
    참석 여부: ${data.attendance === 'yes' ? '참석' : '불참'}
    동반 인원: ${data.guests || 0}명
    메시지: ${data.message || '(없음)'}

    시간: ${new Date().toLocaleString('ko-KR')}

    [Google Sheets에서 확인하기]
    https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID
  `;

  try {
    MailApp.sendEmail(recipientEmail, subject, body);
  } catch (error) {
    Logger.log(`Failed to send email: ${error.toString()}`);
  }
}
```

---

## 다음 단계

1. ✅ **Google Sheets 생성** → [GOOGLE_APPS_SCRIPT.md](../backend/GOOGLE_APPS_SCRIPT.md) 참고
2. ✅ **Apps Script 배포** → Webhook URL 발급
3. ✅ **프론트엔드 연동** → `src/utils/rsvp.js` 구현
4. ✅ **테스트** → cURL, Postman으로 API 테스트
5. ✅ **모니터링** → Google Sheets Analytics 시트 생성

---

## 참고 자료

### 공식 문서
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API Reference](https://developers.google.com/sheets/api)
- [Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)

### 대안 솔루션
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Supabase](https://supabase.com/docs)

### 보안 가이드
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [CORS Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Last Updated**: 2025-10-18
**Next Review**: Sprint 1 종료 시 (2025-11-03 예정)
**Document Owner**: Backend Engineer

---

**Navigation**: [← RSVP_API](../api/RSVP_API.md) | [GOOGLE_APPS_SCRIPT →](../backend/GOOGLE_APPS_SCRIPT.md)
