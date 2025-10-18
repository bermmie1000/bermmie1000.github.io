# 📡 RSVP API 명세 (RSVP API Specification)

**Last Updated**: 2025-10-18
**Project**: GitHub Pages 모바일 청첩장
**Backend**: Google Sheets + Apps Script
**Status**: ✅ Specification Complete

---

## 목차

- [개요](#개요)
- [Google Sheets 연동 방법](#google-sheets-연동-방법)
- [Apps Script Webhook 구조](#apps-script-webhook-구조)
- [API 엔드포인트](#api-엔드포인트)
- [요청/응답 포맷](#요청응답-포맷)
- [에러 핸들링](#에러-핸들링)
- [보안](#보안)
- [테스트](#테스트)

---

## 개요

### Architecture

```
┌──────────────────┐
│  Wedding Site    │
│  (Static HTML)   │
└────────┬─────────┘
         │ POST /exec
         │ { name, attendance, guests }
         │
         ▼
┌──────────────────────────────────┐
│  Google Apps Script              │
│  (Web App Endpoint)              │
│                                  │
│  doPost(e) → parse → validate    │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Google Sheets                   │
│  (Database)                      │
│                                  │
│  [ Timestamp | Name | ... ]      │
└──────────────────────────────────┘
```

### 왜 Google Sheets인가?

**장점**:
- ✅ **완전 무료**: 별도 서버 불필요
- ✅ **간편한 관리**: 엑셀처럼 직관적인 UI
- ✅ **협업 용이**: 신랑/신부가 함께 데이터 확인
- ✅ **API 쿼터**: 일 50,000 요청 (충분함)
- ✅ **Apps Script**: 간단한 Webhook 구현

**제약사항**:
- ⚠️ 실시간 업데이트 어려움 (폴링 필요)
- ⚠️ 복잡한 쿼리 제한적
- ⚠️ 응답 시간 가변적 (1-3초)

---

## Google Sheets 연동 방법

### 1단계: Google Sheets 생성

1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 생성: "Wedding RSVP"
3. 시트 이름: "RSVP" (Apps Script에서 참조)

**컬럼 구조**:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **Timestamp** | **Name** | **Attendance** | **Guests** | **Message** | **Phone** |
| 2025-10-18 10:30:00 | 홍길동 | yes | 2 | 축하합니다! | 010-1234-5678 |

**헤더 행 (Row 1)**:
```
Timestamp | Name | Attendance | Guests | Message | Phone
```

### 2단계: Apps Script 프로젝트 생성

1. 스프레드시트에서 **확장 프로그램 > Apps Script**
2. 새 프로젝트 생성: "RSVP Webhook"
3. `Code.gs` 파일에 아래 코드 붙여넣기

### 3단계: Apps Script 배포

1. Apps Script 에디터에서 **배포 > 새 배포**
2. 유형: **웹 앱**
3. 설정:
   - 설명: "RSVP API v1"
   - 실행 권한: **나** (스프레드시트 소유자)
   - 액세스 권한: **모든 사용자** (인증 없이 접근 가능)
4. **배포** 클릭
5. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/SCRIPT_ID/exec`)

### 4단계: 환경 변수 설정

```bash
# .env
PUBLIC_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**GitHub Secrets 추가**:
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. **New repository secret**
3. Name: `RSVP_WEBHOOK_URL`
4. Value: (위의 웹 앱 URL)

---

## Apps Script Webhook 구조

### 전체 코드 (Code.gs)

```javascript
/**
 * Wedding RSVP Webhook
 * POST 요청을 받아 Google Sheets에 저장
 */

// 스프레드시트 설정
const SHEET_NAME = 'RSVP';
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

/**
 * POST 요청 핸들러
 * @param {Object} e - 요청 이벤트 객체
 * @returns {ContentService.TextOutput} JSON 응답
 */
function doPost(e) {
  try {
    // 1. 요청 데이터 파싱
    const data = parseRequestData(e);

    // 2. 유효성 검사
    validateData(data);

    // 3. 스프레드시트에 저장
    saveToSheet(data);

    // 4. 성공 응답
    return createJsonResponse({
      success: true,
      message: '참석 여부가 전송되었습니다.',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    // 에러 응답
    Logger.log('Error: ' + error.toString());

    return createJsonResponse({
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.',
    }, 400);
  }
}

/**
 * GET 요청 핸들러 (헬스체크용)
 */
function doGet(e) {
  return createJsonResponse({
    status: 'ok',
    message: 'Wedding RSVP API is running',
    version: '1.0.0',
  });
}

/**
 * 요청 데이터 파싱
 */
function parseRequestData(e) {
  if (!e.postData || !e.postData.contents) {
    throw new Error('요청 데이터가 없습니다.');
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error('잘못된 JSON 형식입니다.');
  }
}

/**
 * 데이터 유효성 검사
 */
function validateData(data) {
  // 필수 필드 확인
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('이름을 입력해주세요.');
  }

  if (!data.attendance || !['yes', 'no'].includes(data.attendance)) {
    throw new Error('참석 여부를 선택해주세요.');
  }

  // 이름 길이 검증
  if (data.name.length < 2 || data.name.length > 50) {
    throw new Error('이름은 2-50자 이내로 입력해주세요.');
  }

  // 동반 인원 검증 (참석 시)
  if (data.attendance === 'yes') {
    const guests = parseInt(data.guests, 10);
    if (isNaN(guests) || guests < 1 || guests > 10) {
      throw new Error('동반 인원은 1-10명 사이로 입력해주세요.');
    }
  }

  // 메시지 길이 검증 (선택 사항)
  if (data.message && data.message.length > 500) {
    throw new Error('메시지는 500자 이내로 입력해주세요.');
  }

  // 전화번호 형식 검증 (선택 사항)
  if (data.phone) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(data.phone)) {
      throw new Error('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
    }
  }
}

/**
 * 스프레드시트에 데이터 저장
 */
function saveToSheet(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('스프레드시트를 찾을 수 없습니다.');
  }

  // 중복 제출 방지 (선택 사항)
  if (isDuplicate(sheet, data.name, data.phone)) {
    throw new Error('이미 제출하신 내역이 있습니다.');
  }

  // 행 추가
  const row = [
    new Date(),                     // Timestamp
    data.name,                      // Name
    data.attendance,                // Attendance (yes/no)
    data.attendance === 'yes' ? parseInt(data.guests, 10) : 0,  // Guests
    data.message || '',             // Message
    data.phone || '',               // Phone
  ];

  sheet.appendRow(row);

  // 선택 사항: 이메일 알림 전송
  // sendEmailNotification(data);
}

/**
 * 중복 제출 확인
 */
function isDuplicate(sheet, name, phone) {
  if (!phone) return false;  // 전화번호 없으면 중복 체크 안 함

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  // 헤더 행 제외하고 검색 (row 1은 헤더)
  for (let i = 1; i < values.length; i++) {
    const rowName = values[i][1];   // B열: Name
    const rowPhone = values[i][5];  // F열: Phone

    if (rowName === name && rowPhone === phone) {
      return true;  // 중복 발견
    }
  }

  return false;
}

/**
 * JSON 응답 생성
 */
function createJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  // CORS 헤더 추가 (모든 도메인 허용)
  // 프로덕션에서는 특정 도메인만 허용 권장
  return output;
}

/**
 * 이메일 알림 전송 (선택 사항)
 */
function sendEmailNotification(data) {
  const recipientEmail = 'your-email@gmail.com';  // 알림 받을 이메일
  const subject = `[Wedding] 새로운 RSVP: ${data.name}`;
  const body = `
    이름: ${data.name}
    참석 여부: ${data.attendance === 'yes' ? '참석' : '불참'}
    동반 인원: ${data.guests || 0}명
    메시지: ${data.message || '(없음)'}
    전화번호: ${data.phone || '(없음)'}

    시간: ${new Date().toLocaleString('ko-KR')}
  `;

  try {
    MailApp.sendEmail(recipientEmail, subject, body);
  } catch (error) {
    Logger.log('Failed to send email: ' + error.toString());
  }
}
```

---

## API 엔드포인트

### POST /exec (RSVP 제출)

**URL**: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

**Method**: `POST`

**Headers**:
```http
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "홍길동",
  "attendance": "yes",
  "guests": 2,
  "message": "축하합니다! 꼭 참석하겠습니다.",
  "phone": "010-1234-5678"
}
```

**Response (Success - 200 OK)**:
```json
{
  "success": true,
  "message": "참석 여부가 전송되었습니다.",
  "timestamp": "2025-10-18T10:30:00.000Z"
}
```

**Response (Error - 400 Bad Request)**:
```json
{
  "success": false,
  "error": "이름을 입력해주세요."
}
```

---

### GET /exec (헬스체크)

**URL**: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

**Method**: `GET`

**Response (200 OK)**:
```json
{
  "status": "ok",
  "message": "Wedding RSVP API is running",
  "version": "1.0.0"
}
```

---

## 요청/응답 포맷

### Request Schema

```typescript
interface RsvpRequest {
  // 필수 필드
  name: string;              // 이름 (2-50자)
  attendance: 'yes' | 'no';  // 참석 여부

  // 조건부 필수 (attendance === 'yes' 시)
  guests?: number;           // 동반 인원 (1-10)

  // 선택 사항
  message?: string;          // 메시지 (최대 500자)
  phone?: string;            // 전화번호 (010-XXXX-XXXX)
}
```

**유효성 검사 규칙**:

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| `name` | ✅ Yes | string | 2-50자, 공백 불가 |
| `attendance` | ✅ Yes | 'yes' \| 'no' | 열거형 |
| `guests` | ⚠️ Conditional | number | 1-10, attendance='yes' 시 필수 |
| `message` | ❌ No | string | 최대 500자 |
| `phone` | ❌ No | string | `010-XXXX-XXXX` 형식 |

### Response Schema

#### Success Response

```typescript
interface RsvpSuccessResponse {
  success: true;
  message: string;
  timestamp: string;  // ISO 8601 format
}
```

**예시**:
```json
{
  "success": true,
  "message": "참석 여부가 전송되었습니다.",
  "timestamp": "2025-10-18T10:30:00.000Z"
}
```

#### Error Response

```typescript
interface RsvpErrorResponse {
  success: false;
  error: string;
}
```

**예시**:
```json
{
  "success": false,
  "error": "이름을 입력해주세요."
}
```

---

## 에러 핸들링

### 에러 코드 및 메시지

| HTTP Status | Error Type | Message | Cause |
|-------------|-----------|---------|-------|
| **400** | Bad Request | "요청 데이터가 없습니다." | POST body 없음 |
| **400** | Bad Request | "잘못된 JSON 형식입니다." | JSON parse 실패 |
| **400** | Validation Error | "이름을 입력해주세요." | `name` 필드 누락 |
| **400** | Validation Error | "참석 여부를 선택해주세요." | `attendance` 필드 누락 |
| **400** | Validation Error | "이름은 2-50자 이내로 입력해주세요." | `name` 길이 초과 |
| **400** | Validation Error | "동반 인원은 1-10명 사이로 입력해주세요." | `guests` 범위 초과 |
| **400** | Validation Error | "메시지는 500자 이내로 입력해주세요." | `message` 길이 초과 |
| **400** | Validation Error | "전화번호 형식이 올바르지 않습니다." | `phone` 형식 오류 |
| **409** | Conflict | "이미 제출하신 내역이 있습니다." | 중복 제출 |
| **500** | Internal Error | "스프레드시트를 찾을 수 없습니다." | 시트 이름 오류 |
| **500** | Internal Error | "알 수 없는 오류가 발생했습니다." | 기타 서버 오류 |

### 프론트엔드 에러 처리

```typescript
// src/utils/rsvp.ts
export async function submitRsvp(data: RsvpRequest): Promise<RsvpResponse> {
  const webhookUrl = import.meta.env.PUBLIC_RSVP_WEBHOOK_URL;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
    }

    return result;

  } catch (error) {
    // 네트워크 에러
    if (error instanceof TypeError) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }

    // API 에러
    throw error;
  }
}
```

**React 컴포넌트 사용 예시**:
```tsx
const handleSubmit = async (formData: RsvpRequest) => {
  try {
    setIsSubmitting(true);
    setError(null);

    await submitRsvp(formData);

    // 성공
    alert('참석 여부가 전송되었습니다!');
    resetForm();

  } catch (err) {
    // 에러 표시
    setError(err.message);

  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 보안

### 1. CORS (Cross-Origin Resource Sharing)

**Apps Script는 기본적으로 모든 도메인 허용**:
- 배포 시 "모든 사용자" 선택하면 CORS 자동 처리
- 특정 도메인만 허용하려면 `doPost`에서 검증 추가

```javascript
function doPost(e) {
  // Referer 확인 (선택 사항)
  const allowedDomains = [
    'https://yourusername.github.io',
    'http://localhost:4321',  // 개발 환경
  ];

  const referer = e.parameter.referer || '';
  const isAllowed = allowedDomains.some(domain => referer.startsWith(domain));

  if (!isAllowed) {
    return createJsonResponse({
      success: false,
      error: 'Unauthorized domain',
    }, 403);
  }

  // ... 나머지 로직
}
```

### 2. Rate Limiting (속도 제한)

**Apps Script 쿼터**:
- URL Fetch 호출: 일 20,000회
- 스크립트 실행 시간: 호출당 6분
- MailApp 호출: 일 100회 (무료 계정)

**클라이언트 측 제한**:
```typescript
// 중복 제출 방지 (로컬 스토리지)
const SUBMISSION_KEY = 'rsvp_submitted';
const COOLDOWN_HOURS = 24;

export function canSubmit(): boolean {
  const lastSubmit = localStorage.getItem(SUBMISSION_KEY);

  if (!lastSubmit) return true;

  const hoursSince = (Date.now() - parseInt(lastSubmit)) / (1000 * 60 * 60);
  return hoursSince >= COOLDOWN_HOURS;
}

export function markSubmitted(): void {
  localStorage.setItem(SUBMISSION_KEY, Date.now().toString());
}
```

### 3. Input Sanitization (입력 정제)

**Apps Script 측**:
```javascript
function sanitizeInput(input) {
  // HTML 태그 제거
  return input.replace(/<[^>]*>/g, '');
}

function validateData(data) {
  // 입력값 정제
  data.name = sanitizeInput(data.name).trim();
  data.message = sanitizeInput(data.message || '').trim();

  // ... 유효성 검사
}
```

**React 측** (Zod 스키마):
```typescript
import { z } from 'zod';

export const rsvpSchema = z.object({
  name: z.string()
    .min(2, '이름은 2자 이상 입력해주세요.')
    .max(50, '이름은 50자 이하로 입력해주세요.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글 또는 영문만 가능합니다.'),

  attendance: z.enum(['yes', 'no']),

  guests: z.number()
    .int()
    .min(1, '최소 1명 이상이어야 합니다.')
    .max(10, '최대 10명까지 가능합니다.')
    .optional(),

  message: z.string()
    .max(500, '메시지는 500자 이하로 입력해주세요.')
    .optional(),

  phone: z.string()
    .regex(/^010-\d{4}-\d{4}$/, '전화번호 형식이 올바르지 않습니다.')
    .optional(),
});

export type RsvpRequest = z.infer<typeof rsvpSchema>;
```

### 4. 데이터 프라이버시

**개인정보 보호**:
- ✅ HTTPS 전송 (GitHub Pages 기본 제공)
- ✅ Google Sheets 접근 권한 제한 (소유자만)
- ✅ 전화번호는 선택 사항
- ⚠️ 개인정보 처리방침 명시 (사이트 하단)

**개인정보 처리방침 예시**:
```markdown
### 개인정보 처리방침

본 웹사이트는 결혼식 참석 여부 확인을 위해 최소한의 정보를 수집합니다.

**수집 항목**: 이름, 참석 여부, 동반 인원, 메시지, 전화번호 (선택)
**수집 목적**: 결혼식 참석 인원 파악 및 식사 준비
**보유 기간**: 결혼식 종료 후 30일 이내 파기
**제3자 제공**: 없음 (Google Sheets에만 저장)
```

---

## 테스트

### 1. Apps Script 테스트

**Apps Script 에디터에서 직접 테스트**:
```javascript
function testDoPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: '홍길동',
        attendance: 'yes',
        guests: 2,
        message: '축하합니다!',
        phone: '010-1234-5678',
      })
    }
  };

  const response = doPost(mockEvent);
  Logger.log(response.getContent());
}
```

**실행 방법**:
1. 함수 선택: `testDoPost`
2. 실행 버튼 클릭
3. 로그 확인: `보기 > 로그`

### 2. cURL 테스트

```bash
# 성공 케이스
curl -X POST \
  https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "홍길동",
    "attendance": "yes",
    "guests": 2,
    "message": "축하합니다!",
    "phone": "010-1234-5678"
  }'

# 예상 응답
# {"success":true,"message":"참석 여부가 전송되었습니다.","timestamp":"..."}
```

```bash
# 실패 케이스 (이름 누락)
curl -X POST \
  https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec \
  -H 'Content-Type: application/json' \
  -d '{
    "attendance": "yes",
    "guests": 2
  }'

# 예상 응답
# {"success":false,"error":"이름을 입력해주세요."}
```

### 3. Playwright E2E 테스트

```typescript
// tests/e2e/rsvp.spec.ts
import { test, expect } from '@playwright/test';

test('should submit RSVP successfully', async ({ page }) => {
  await page.goto('/');

  // RSVP 섹션으로 이동
  await page.click('text=참석 여부');

  // 폼 작성
  await page.fill('input[name="name"]', '홍길동');
  await page.check('input[value="yes"]');
  await page.selectOption('select[name="guests"]', '2');
  await page.fill('textarea[name="message"]', '축하합니다!');

  // 제출
  await page.click('button[type="submit"]');

  // 성공 메시지 확인
  await expect(page.locator('text=전송되었습니다')).toBeVisible({ timeout: 5000 });
});

test('should show error for empty name', async ({ page }) => {
  await page.goto('/');

  // 이름 입력하지 않고 제출
  await page.click('text=참석 여부');
  await page.check('input[value="yes"]');
  await page.click('button[type="submit"]');

  // 에러 메시지 확인
  await expect(page.locator('text=이름을 입력해주세요')).toBeVisible();
});
```

### 4. 부하 테스트 (선택 사항)

```bash
# Apache Bench
ab -n 100 -c 10 -p rsvp.json -T application/json \
  https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# rsvp.json 파일 내용
# {"name":"Test User","attendance":"yes","guests":1}
```

**예상 결과**:
- 동시 요청 10개
- 총 100개 요청
- 평균 응답 시간: 1-3초
- 성공률: 100%

---

## 모니터링

### Google Sheets에서 데이터 확인

**자동 집계 공식** (시트 하단에 추가):

```
// D열: 총 참석 인원
=SUMIF(C:C, "yes", D:D)

// E열: 총 불참 인원
=COUNTIF(C:C, "no")

// F열: 총 RSVP 건수
=COUNTA(B:B)-1
```

**피벗 테이블** (데이터 분석):
1. 데이터 → 피벗 테이블
2. 행: Attendance
3. 값: COUNT of Name

---

## 트러블슈팅

### 문제 1: "요청이 거부되었습니다" (403 Forbidden)

**원인**: 배포 설정 오류

**해결**:
1. Apps Script 에디터 → 배포 → 배포 관리
2. 액세스 권한: "모든 사용자" 확인
3. 새 배포 생성

### 문제 2: "스프레드시트를 찾을 수 없습니다" (500 Error)

**원인**: 시트 이름 불일치

**해결**:
1. 스프레드시트 시트 이름 확인: "RSVP" (대소문자 정확히)
2. Apps Script `SHEET_NAME` 변수 확인

### 문제 3: 응답 시간이 너무 느림 (>5초)

**원인**: Apps Script 콜드 스타트, 많은 데이터

**해결**:
1. 인덱싱 최적화 (중복 체크 로직 간소화)
2. 별도 시트로 아카이빙 (과거 데이터 이동)

---

## 참고 자료

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Sheets API Reference](https://developers.google.com/sheets/api)
- [Apps Script Best Practices](https://developers.google.com/apps-script/guides/services/quotas)

---

**Last Updated**: 2025-10-18
**Next Review**: Sprint 1 종료 시 (2025-11-03 예정)
**Document Owner**: Backend Engineer

---

**Navigation**: [← DESIGN_SYSTEM](../design/DESIGN_SYSTEM.md) | [QUICK_START →](../development/QUICK_START.md) | [PROJECT_PLAN →](../../PROJECT_PLAN.md)
