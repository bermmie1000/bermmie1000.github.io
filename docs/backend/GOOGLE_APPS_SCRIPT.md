# 📜 Google Apps Script 전체 코드 (Complete Code)

**Last Updated**: 2025-10-18
**Project**: Wedding Invitation Backend
**Status**: ✅ Production Ready

---

## 목차

- [설정 방법](#설정-방법)
- [전체 코드 (Code.gs)](#전체-코드-codegs)
- [배포 방법](#배포-방법)
- [테스트 방법](#테스트-방법)
- [트러블슈팅](#트러블슈팅)

---

## 설정 방법

### 1단계: Google Sheets 생성

1. [Google Sheets](https://sheets.google.com) 접속
2. **새 스프레드시트 생성**: "Wedding RSVP & Guestbook"
3. 3개 시트 생성:
   - `RSVP` (참석 여부)
   - `Guestbook` (방명록)
   - `Analytics` (통계)

---

### 2단계: 시트 헤더 설정

#### RSVP 시트

**A1:G1 헤더**:
```
Timestamp | Name | Attendance | Guests | Phone | Message | IP
```

#### Guestbook 시트

**A1:G1 헤더**:
```
ID | Timestamp | Name | Message | Password | IP | Approved
```

#### Analytics 시트

**A1:B1 헤더**:
```
Metric | Value
```

**통계 공식** (A2:B10에 입력):
```
A2: 총 RSVP 제출
B2: =COUNTA(RSVP!B:B)-1

A3: 참석 인원
B3: =SUMIF(RSVP!C:C,"yes",RSVP!D:D)

A4: 불참 인원
B4: =COUNTIF(RSVP!C:C,"no")

A5: 응답률
B5: =TEXT(B2/300,"0.0%")

A6: 평균 동반 인원
B6: =AVERAGEIF(RSVP!C:C,"yes",RSVP!D:D)

A7: 총 방명록 작성
B7: =COUNTA(Guestbook!B:B)-1

A8: 승인된 방명록
B8: =COUNTIF(Guestbook!G:G,TRUE)
```

---

### 3단계: Apps Script 프로젝트 생성

1. 스프레드시트에서 **확장 프로그램 > Apps Script**
2. 기본 `Code.gs` 파일에 아래 코드 붙여넣기
3. **저장** (Ctrl+S)

---

## 전체 코드 (Code.gs)

```javascript
/**
 * Wedding Invitation Backend
 * Google Apps Script Web App
 *
 * Features:
 * - RSVP submission
 * - Guestbook submission & retrieval
 * - Statistics API
 * - Rate limiting
 * - Spam prevention
 *
 * @author Wedding Dev Team
 * @version 1.0.0
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  SHEETS: {
    RSVP: 'RSVP',
    GUESTBOOK: 'Guestbook',
    ANALYTICS: 'Analytics'
  },
  RATE_LIMIT: {
    WINDOW_MS: 60 * 1000,      // 1분
    MAX_REQUESTS: 5             // 1분에 5회
  },
  GUESTBOOK: {
    PAGE_SIZE: 50,              // 페이지당 항목 수
    AUTO_APPROVE: true          // 자동 승인 여부
  },
  EMAIL: {
    ENABLED: true,
    RECIPIENT: 'your-email@gmail.com',  // 알림 받을 이메일
    SEND_ON_RSVP: true,
    SEND_ON_GUESTBOOK: false
  }
};

// ============================================================================
// MAIN HANDLERS
// ============================================================================

/**
 * POST 요청 핸들러
 * @param {Object} e - 이벤트 객체
 * @returns {ContentService.TextOutput} JSON 응답
 */
function doPost(e) {
  const startTime = Date.now();

  try {
    // IP 주소 가져오기
    const ipAddress = getClientIp(e);

    // Rate limiting 체크
    checkRateLimit(ipAddress);

    // 요청 데이터 파싱
    const requestData = parsePostData(e);
    const action = requestData.action;

    Logger.log(`[POST] Action: ${action}, IP: ${ipAddress}`);

    let response;

    // 액션별 분기
    switch (action) {
      case 'submitRsvp':
        response = handleSubmitRsvp(requestData.data, ipAddress);
        break;

      case 'submitGuestbook':
        response = handleSubmitGuestbook(requestData.data, ipAddress);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const duration = Date.now() - startTime;
    Logger.log(`[SUCCESS] Completed in ${duration}ms`);

    return createJsonResponse(response);

  } catch (error) {
    Logger.log(`[ERROR] ${error.toString()}`);
    return createJsonResponse({
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.',
      code: 'SERVER_ERROR'
    }, 400);
  }
}

/**
 * GET 요청 핸들러
 * @param {Object} e - 이벤트 객체
 * @returns {ContentService.TextOutput} JSON 응답
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'healthcheck';

    Logger.log(`[GET] Action: ${action}`);

    let response;

    switch (action) {
      case 'healthcheck':
        response = handleHealthCheck();
        break;

      case 'getRsvpStats':
        response = handleGetRsvpStats();
        break;

      case 'getGuestbook':
        const limit = parseInt(e.parameter.limit) || CONFIG.GUESTBOOK.PAGE_SIZE;
        const offset = parseInt(e.parameter.offset) || 0;
        response = handleGetGuestbook(limit, offset);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return createJsonResponse(response);

  } catch (error) {
    Logger.log(`[ERROR] ${error.toString()}`);
    return createJsonResponse({
      success: false,
      error: error.message
    }, 400);
  }
}

// ============================================================================
// RSVP HANDLERS
// ============================================================================

/**
 * RSVP 제출 처리
 * @param {Object} data - RSVP 데이터
 * @param {string} ipAddress - 클라이언트 IP
 * @returns {Object} 응답 객체
 */
function handleSubmitRsvp(data, ipAddress) {
  // 유효성 검사
  validateRsvpData(data);

  // 스팸 체크
  if (isSpam(data, ipAddress)) {
    throw new Error('스팸으로 감지되었습니다.');
  }

  // 입력값 정제
  const sanitizedData = sanitizeRsvpData(data);

  // 스프레드시트에 저장
  const rowNumber = saveRsvpToSheet(sanitizedData, ipAddress);

  // 이메일 알림 전송 (선택)
  if (CONFIG.EMAIL.ENABLED && CONFIG.EMAIL.SEND_ON_RSVP) {
    sendRsvpEmailNotification(sanitizedData);
  }

  return {
    success: true,
    message: '참석 여부가 전송되었습니다.',
    timestamp: new Date().toISOString(),
    rowNumber: rowNumber
  };
}

/**
 * RSVP 데이터 유효성 검사
 * @param {Object} data - RSVP 데이터
 * @throws {Error} 유효성 검사 실패 시
 */
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

/**
 * RSVP 데이터 정제
 * @param {Object} data - 원본 데이터
 * @returns {Object} 정제된 데이터
 */
function sanitizeRsvpData(data) {
  return {
    name: sanitizeInput(data.name),
    attendance: data.attendance,
    guests: data.attendance === 'yes' ? parseInt(data.guests, 10) : 0,
    phone: sanitizeInput(data.phone || ''),
    message: sanitizeInput(data.message || '')
  };
}

/**
 * RSVP 데이터를 시트에 저장
 * @param {Object} data - RSVP 데이터
 * @param {string} ipAddress - IP 주소
 * @returns {number} 저장된 행 번호
 */
function saveRsvpToSheet(data, ipAddress) {
  const sheet = getSheet(CONFIG.SHEETS.RSVP);

  const row = [
    new Date(),           // Timestamp
    data.name,           // Name
    data.attendance,     // Attendance
    data.guests,         // Guests
    data.phone,          // Phone
    data.message,        // Message
    ipAddress            // IP
  ];

  sheet.appendRow(row);

  // 마지막 행 번호 반환
  return sheet.getLastRow();
}

/**
 * RSVP 통계 조회
 * @returns {Object} 통계 데이터
 */
function handleGetRsvpStats() {
  // 캐시 확인
  const cache = CacheService.getScriptCache();
  const cacheKey = 'rsvp_stats';
  const cached = cache.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  // 캐시 미스 시 계산
  const sheet = getSheet(CONFIG.SHEETS.RSVP);
  const data = sheet.getDataRange().getValues();

  // 헤더 제외
  const rows = data.slice(1);

  const stats = {
    totalSubmissions: rows.length,
    attending: rows.filter(row => row[2] === 'yes').length,
    notAttending: rows.filter(row => row[2] === 'no').length,
    totalGuests: rows
      .filter(row => row[2] === 'yes')
      .reduce((sum, row) => sum + (row[3] || 0), 0)
  };

  const response = {
    success: true,
    stats: stats
  };

  // 5분 캐싱
  cache.put(cacheKey, JSON.stringify(response), 300);

  return response;
}

// ============================================================================
// GUESTBOOK HANDLERS
// ============================================================================

/**
 * 방명록 제출 처리
 * @param {Object} data - 방명록 데이터
 * @param {string} ipAddress - 클라이언트 IP
 * @returns {Object} 응답 객체
 */
function handleSubmitGuestbook(data, ipAddress) {
  // 유효성 검사
  validateGuestbookData(data);

  // 스팸 체크
  if (isSpam(data, ipAddress)) {
    throw new Error('스팸으로 감지되었습니다.');
  }

  // 입력값 정제
  const sanitizedData = sanitizeGuestbookData(data);

  // 비밀번호 해시화
  const passwordHash = hashPassword(sanitizedData.password);

  // 고유 ID 생성
  const entryId = `entry_${Date.now()}`;

  // 스프레드시트에 저장
  saveGuestbookToSheet(entryId, sanitizedData, passwordHash, ipAddress);

  // 이메일 알림 (선택)
  if (CONFIG.EMAIL.ENABLED && CONFIG.EMAIL.SEND_ON_GUESTBOOK) {
    sendGuestbookEmailNotification(sanitizedData);
  }

  return {
    success: true,
    message: '방명록이 등록되었습니다.',
    id: entryId,
    timestamp: new Date().toISOString()
  };
}

/**
 * 방명록 데이터 유효성 검사
 * @param {Object} data - 방명록 데이터
 */
function validateGuestbookData(data) {
  const errors = [];

  // 이름 검증
  if (!data.name || typeof data.name !== 'string') {
    errors.push('이름을 입력해주세요.');
  } else if (data.name.length < 2 || data.name.length > 50) {
    errors.push('이름은 2-50자 이내로 입력해주세요.');
  }

  // 메시지 검증
  if (!data.message || typeof data.message !== 'string') {
    errors.push('메시지를 입력해주세요.');
  } else if (data.message.length < 5 || data.message.length > 500) {
    errors.push('메시지는 5-500자 이내로 입력해주세요.');
  }

  // 비밀번호 검증
  if (!data.password || typeof data.password !== 'string') {
    errors.push('비밀번호를 입력해주세요.');
  } else if (data.password.length < 4 || data.password.length > 20) {
    errors.push('비밀번호는 4-20자 이내로 입력해주세요.');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

/**
 * 방명록 데이터 정제
 * @param {Object} data - 원본 데이터
 * @returns {Object} 정제된 데이터
 */
function sanitizeGuestbookData(data) {
  return {
    name: sanitizeInput(data.name),
    message: sanitizeInput(data.message),
    password: data.password // 해시화는 별도 처리
  };
}

/**
 * 방명록 데이터를 시트에 저장
 * @param {string} entryId - 고유 ID
 * @param {Object} data - 방명록 데이터
 * @param {string} passwordHash - 비밀번호 해시
 * @param {string} ipAddress - IP 주소
 */
function saveGuestbookToSheet(entryId, data, passwordHash, ipAddress) {
  const sheet = getSheet(CONFIG.SHEETS.GUESTBOOK);

  const row = [
    entryId,                              // ID
    new Date(),                           // Timestamp
    data.name,                            // Name
    data.message,                         // Message
    passwordHash,                         // Password (hashed)
    ipAddress,                            // IP
    CONFIG.GUESTBOOK.AUTO_APPROVE         // Approved
  ];

  sheet.appendRow(row);
}

/**
 * 방명록 조회
 * @param {number} limit - 조회 개수
 * @param {number} offset - 시작 위치
 * @returns {Object} 방명록 데이터
 */
function handleGetGuestbook(limit, offset) {
  const sheet = getSheet(CONFIG.SHEETS.GUESTBOOK);
  const data = sheet.getDataRange().getValues();

  // 헤더 제외 및 승인된 항목만
  const allRows = data.slice(1).filter(row => row[6] === true);

  // 최신순 정렬 (Timestamp 기준 역순)
  allRows.sort((a, b) => new Date(b[1]) - new Date(a[1]));

  // 페이지네이션
  const total = allRows.length;
  const paginatedRows = allRows.slice(offset, offset + limit);

  // 응답 포맷
  const entries = paginatedRows.map(row => ({
    id: row[0],
    name: row[2],
    message: row[3],
    timestamp: new Date(row[1]).toISOString()
  }));

  return {
    success: true,
    data: entries,
    total: total,
    limit: limit,
    offset: offset
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * 헬스체크
 * @returns {Object} 상태 정보
 */
function handleHealthCheck() {
  return {
    status: 'ok',
    message: 'Wedding RSVP API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };
}

/**
 * POST 데이터 파싱
 * @param {Object} e - 이벤트 객체
 * @returns {Object} 파싱된 데이터
 */
function parsePostData(e) {
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
 * 클라이언트 IP 주소 가져오기
 * @param {Object} e - 이벤트 객체
 * @returns {string} IP 주소
 */
function getClientIp(e) {
  // Apps Script에서 IP 가져오기 (제한적)
  // 실제 환경에서는 Proxy 헤더 확인 필요
  return e.parameter.userip || 'unknown';
}

/**
 * Rate limiting 체크
 * @param {string} ipAddress - IP 주소
 */
function checkRateLimit(ipAddress) {
  const cache = CacheService.getScriptCache();
  const key = `rate_limit_${ipAddress}`;

  const requestCountStr = cache.get(key);
  const requestCount = requestCountStr ? parseInt(requestCountStr) : 0;

  if (requestCount >= CONFIG.RATE_LIMIT.MAX_REQUESTS) {
    throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
  }

  // 카운트 증가 및 TTL 설정
  cache.put(key, (requestCount + 1).toString(), 60); // 60초 TTL
}

/**
 * 스팸 감지
 * @param {Object} data - 요청 데이터
 * @param {string} ipAddress - IP 주소
 * @returns {boolean} 스팸 여부
 */
function isSpam(data, ipAddress) {
  // 1. Honeypot 체크
  if (data.website) {
    Logger.log(`[SPAM] Honeypot triggered: ${ipAddress}`);
    return true;
  }

  // 2. URL 포함 체크
  if (data.message && /https?:\/\//i.test(data.message)) {
    Logger.log(`[SPAM] URL detected: ${ipAddress}`);
    return true;
  }

  // 3. 동일 이름 중복 체크 (간단한 예시)
  // 실제 환경에서는 더 정교한 로직 필요

  return false;
}

/**
 * 입력값 정제 (HTML 태그 제거)
 * @param {string} input - 원본 입력
 * @returns {string} 정제된 입력
 */
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

/**
 * 비밀번호 해시화 (간단한 해시)
 * @param {string} password - 원본 비밀번호
 * @returns {string} 해시 값
 */
function hashPassword(password) {
  // 프로덕션에서는 더 강력한 해시 알고리즘 사용 권장
  // 예: SHA-256, bcrypt 등
  return Utilities.base64Encode(Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  ));
}

/**
 * 시트 가져오기
 * @param {string} sheetName - 시트 이름
 * @returns {Sheet} 시트 객체
 */
function getSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`시트를 찾을 수 없습니다: ${sheetName}`);
  }

  return sheet;
}

/**
 * JSON 응답 생성
 * @param {Object} data - 응답 데이터
 * @param {number} statusCode - HTTP 상태 코드
 * @returns {ContentService.TextOutput} JSON 응답
 */
function createJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  // CORS 헤더 추가 (모든 도메인 허용)
  // 프로덕션에서는 특정 도메인만 허용 권장
  // output.setHeader('Access-Control-Allow-Origin', 'https://yourusername.github.io');

  return output;
}

/**
 * RSVP 이메일 알림 전송
 * @param {Object} data - RSVP 데이터
 */
function sendRsvpEmailNotification(data) {
  const subject = `[Wedding RSVP] 새로운 응답: ${data.name}`;
  const body = `
    이름: ${data.name}
    참석 여부: ${data.attendance === 'yes' ? '✅ 참석' : '❌ 불참'}
    동반 인원: ${data.guests || 0}명
    전화번호: ${data.phone || '(미입력)'}
    메시지: ${data.message || '(없음)'}

    시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

    [Google Sheets에서 확인하기]
    ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;

  try {
    MailApp.sendEmail(CONFIG.EMAIL.RECIPIENT, subject, body);
    Logger.log(`[EMAIL] Sent to ${CONFIG.EMAIL.RECIPIENT}`);
  } catch (error) {
    Logger.log(`[EMAIL ERROR] ${error.toString()}`);
  }
}

/**
 * 방명록 이메일 알림 전송
 * @param {Object} data - 방명록 데이터
 */
function sendGuestbookEmailNotification(data) {
  const subject = `[Wedding Guestbook] 새로운 방명록: ${data.name}`;
  const body = `
    이름: ${data.name}
    메시지: ${data.message}

    시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

    [Google Sheets에서 확인하기]
    ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;

  try {
    MailApp.sendEmail(CONFIG.EMAIL.RECIPIENT, subject, body);
    Logger.log(`[EMAIL] Sent to ${CONFIG.EMAIL.RECIPIENT}`);
  } catch (error) {
    Logger.log(`[EMAIL ERROR] ${error.toString()}`);
  }
}

// ============================================================================
// TEST FUNCTIONS (개발 환경에서만 사용)
// ============================================================================

/**
 * doPost 테스트 함수
 */
function testSubmitRsvp() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        action: 'submitRsvp',
        data: {
          name: '홍길동',
          attendance: 'yes',
          guests: 2,
          phone: '010-1234-5678',
          message: '축하합니다! 꼭 참석하겠습니다.'
        }
      })
    },
    parameter: {
      userip: '127.0.0.1'
    }
  };

  const response = doPost(mockEvent);
  Logger.log(response.getContent());
}

/**
 * doGet 테스트 함수
 */
function testGetRsvpStats() {
  const mockEvent = {
    parameter: {
      action: 'getRsvpStats'
    }
  };

  const response = doGet(mockEvent);
  Logger.log(response.getContent());
}
```

---

## 배포 방법

### 1단계: Apps Script 저장

1. 위의 코드를 `Code.gs`에 붙여넣기
2. **파일 > 저장** (Ctrl+S)
3. 프로젝트 이름: "Wedding RSVP Backend"

---

### 2단계: 웹 앱으로 배포

1. **배포 > 새 배포** 클릭
2. 유형 선택: **웹 앱**
3. 설정:
   - **설명**: "Wedding RSVP API v1.0"
   - **실행 권한**: **나** (스프레드시트 소유자)
   - **액세스 권한**: **모든 사용자** (인증 없이 접근 가능)
4. **배포** 클릭
5. **웹 앱 URL** 복사

**URL 형식**:
```
https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

---

### 3단계: 환경 변수 설정

#### `.env` 파일

```bash
# 로컬 개발용
PUBLIC_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

#### GitHub Secrets

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `RSVP_WEBHOOK_URL`
4. Value: (위에서 복사한 웹 앱 URL)
5. **Add secret**

---

### 4단계: CONFIG 수정

`Code.gs`의 `CONFIG` 객체에서 이메일 주소 변경:

```javascript
const CONFIG = {
  // ...
  EMAIL: {
    ENABLED: true,
    RECIPIENT: 'your-actual-email@gmail.com',  // 👈 여기 수정
    SEND_ON_RSVP: true,
    SEND_ON_GUESTBOOK: false
  }
};
```

---

## 테스트 방법

### 1. Apps Script 에디터에서 테스트

#### RSVP 제출 테스트

1. 함수 선택: `testSubmitRsvp`
2. **실행** 버튼 클릭
3. **로그 확인**: **보기 > 로그**

**예상 출력**:
```json
{
  "success": true,
  "message": "참석 여부가 전송되었습니다.",
  "timestamp": "2025-10-18T10:30:00.000Z",
  "rowNumber": 2
}
```

#### 통계 조회 테스트

1. 함수 선택: `testGetRsvpStats`
2. **실행** 버튼 클릭
3. **로그 확인**

**예상 출력**:
```json
{
  "success": true,
  "stats": {
    "totalSubmissions": 1,
    "attending": 1,
    "notAttending": 0,
    "totalGuests": 2
  }
}
```

---

### 2. cURL 테스트

#### RSVP 제출

```bash
curl -X POST \
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "submitRsvp",
    "data": {
      "name": "홍길동",
      "attendance": "yes",
      "guests": 2,
      "phone": "010-1234-5678",
      "message": "축하합니다!"
    }
  }'
```

#### 방명록 제출

```bash
curl -X POST \
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "submitGuestbook",
    "data": {
      "name": "김철수",
      "message": "결혼을 축하합니다! 💐",
      "password": "1234"
    }
  }'
```

#### 방명록 조회

```bash
curl -X GET \
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getGuestbook&limit=10&offset=0'
```

#### 통계 조회

```bash
curl -X GET \
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getRsvpStats'
```

---

### 3. Postman 테스트

1. **Postman** 다운로드 및 설치
2. 새 Collection 생성: "Wedding API"
3. Request 추가:
   - POST Submit RSVP
   - POST Submit Guestbook
   - GET Get Guestbook
   - GET Get RSVP Stats

---

## 트러블슈팅

### 문제 1: "요청이 거부되었습니다" (403 Forbidden)

**원인**: 배포 설정 오류

**해결**:
1. Apps Script 에디터 → **배포** → **배포 관리**
2. 액세스 권한: **모든 사용자** 확인
3. 새 배포 생성 (기존 배포는 삭제)

---

### 문제 2: "스프레드시트를 찾을 수 없습니다" (500 Error)

**원인**: 시트 이름 불일치

**해결**:
1. Google Sheets에서 시트 이름 확인:
   - `RSVP` (대소문자 정확히)
   - `Guestbook`
   - `Analytics`
2. `CONFIG.SHEETS` 변수와 일치하는지 확인

---

### 문제 3: CORS 에러

**원인**: CORS 헤더 미설정

**해결**:
`createJsonResponse` 함수에 CORS 헤더 추가:

```javascript
function createJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  // CORS 허용 (특정 도메인만)
  output.setHeader('Access-Control-Allow-Origin', 'https://yourusername.github.io');

  return output;
}
```

---

### 문제 4: 이메일 알림이 안 옴

**원인**: MailApp 권한 부여 필요

**해결**:
1. Apps Script 에디터에서 **실행** 버튼 클릭
2. 권한 요청 팝업 → **권한 검토**
3. Google 계정 선택 → **허용**

---

### 문제 5: 응답 시간이 느림 (>5초)

**원인**: 콜드 스타트

**해결**:
1. **캐싱 활성화**: `CacheService` 사용 (이미 구현됨)
2. **워밍업 트리거**: 매 5분마다 GET 요청 (선택 사항)

**워밍업 트리거 설정**:
1. Apps Script 에디터 → **트리거** (시계 아이콘)
2. **트리거 추가**:
   - 함수: `handleHealthCheck`
   - 이벤트 소스: **시간 기반**
   - 시간 간격: **5분마다**

---

## 로그 확인 방법

### Apps Script 실행 로그

1. Apps Script 에디터 → **보기** → **로그**
2. 최근 30일 로그 확인 가능
3. 필터링: `[ERROR]`, `[SUCCESS]` 등

### Google Sheets에서 직접 확인

1. **RSVP** 시트 → 제출된 데이터 확인
2. **Guestbook** 시트 → 방명록 확인
3. **Analytics** 시트 → 통계 자동 업데이트

---

## 참고 자료

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)
- [MailApp Reference](https://developers.google.com/apps-script/reference/mail/mail-app)

---

**Last Updated**: 2025-10-18
**Document Owner**: Backend Engineer

---

**Navigation**: [← BACKEND_ARCHITECTURE](../architecture/BACKEND_ARCHITECTURE.md) | [RSVP_API →](../api/RSVP_API.md)
