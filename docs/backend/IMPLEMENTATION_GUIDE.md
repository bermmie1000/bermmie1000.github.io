# 🚀 백엔드 구현 가이드 (Implementation Guide)

**Last Updated**: 2025-10-18
**Project**: Wedding Invitation Backend
**Status**: ✅ Step-by-Step Guide

---

## 목차

- [전체 구현 흐름](#전체-구현-흐름)
- [1단계: Google Sheets 설정](#1단계-google-sheets-설정)
- [2단계: Apps Script 배포](#2단계-apps-script-배포)
- [3단계: 프론트엔드 연동](#3단계-프론트엔드-연동)
- [4단계: 테스트](#4단계-테스트)
- [5단계: 프로덕션 배포](#5단계-프로덕션-배포)
- [트러블슈팅](#트러블슈팅)

---

## 전체 구현 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Google Sheets 설정 (5분)                              │
│  - 스프레드시트 생성                                             │
│  - 시트 3개 생성 (RSVP, Guestbook, Analytics)                   │
│  - 헤더 행 설정                                                  │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Apps Script 배포 (10분)                               │
│  - Code.gs 코드 붙여넣기                                        │
│  - 웹 앱으로 배포                                                │
│  - Webhook URL 복사                                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: 프론트엔드 연동 (15분)                                │
│  - .env 파일에 Webhook URL 설정                                 │
│  - JavaScript 코드 연동                                         │
│  - HTML 폼 수정                                                  │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: 테스트 (10분)                                         │
│  - cURL로 API 테스트                                            │
│  - 브라우저에서 폼 제출 테스트                                   │
│  - Google Sheets 데이터 확인                                    │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: 프로덕션 배포 (5분)                                   │
│  - GitHub Secrets 설정                                          │
│  - GitHub Pages 배포                                            │
│  - 최종 확인                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**총 소요 시간**: 약 45분

---

## 1단계: Google Sheets 설정

### 1-1. 스프레드시트 생성

1. [Google Sheets](https://sheets.google.com) 접속
2. **+ 새로 만들기** 클릭
3. 스프레드시트 이름: **Wedding RSVP & Guestbook**
4. URL 복사 (나중에 사용):
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```

---

### 1-2. RSVP 시트 생성

1. 기본 시트 이름을 `RSVP`로 변경
2. **A1:G1** 셀에 헤더 입력:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Timestamp** | **Name** | **Attendance** | **Guests** | **Phone** | **Message** | **IP** |

3. 헤더 행 서식:
   - 굵게
   - 배경색: 연한 회색
   - 텍스트 가운데 정렬

---

### 1-3. Guestbook 시트 생성

1. 새 시트 추가 (하단 **+** 버튼)
2. 시트 이름: `Guestbook`
3. **A1:G1** 셀에 헤더 입력:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **ID** | **Timestamp** | **Name** | **Message** | **Password** | **IP** | **Approved** |

---

### 1-4. Analytics 시트 생성

1. 새 시트 추가
2. 시트 이름: `Analytics`
3. **A1:B1** 셀에 헤더 입력:

| A | B |
|---|---|
| **Metric** | **Value** |

4. **A2:B10**에 통계 공식 입력:

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

5. **B5** 셀: 초대 인원 300명을 실제 수치로 변경

---

## 2단계: Apps Script 배포

### 2-1. Apps Script 프로젝트 생성

1. 스프레드시트 상단 메뉴: **확장 프로그램 > Apps Script**
2. 새 프로젝트 생성됨
3. 기본 `Code.gs` 파일 확인

---

### 2-2. Code.gs 코드 붙여넣기

1. [GOOGLE_APPS_SCRIPT.md](./GOOGLE_APPS_SCRIPT.md) 문서 열기
2. **전체 코드 (Code.gs)** 섹션의 코드 전체 복사
3. Apps Script 에디터의 `Code.gs`에 붙여넣기 (기존 코드 덮어쓰기)
4. **파일 > 저장** (Ctrl+S)

---

### 2-3. CONFIG 수정

`Code.gs` 파일 상단의 `CONFIG` 객체에서 이메일 주소 수정:

```javascript
const CONFIG = {
  // ...
  EMAIL: {
    ENABLED: true,
    RECIPIENT: 'your-email@gmail.com',  // 👈 실제 이메일로 변경
    SEND_ON_RSVP: true,
    SEND_ON_GUESTBOOK: false
  }
};
```

**저장** 필수!

---

### 2-4. 웹 앱으로 배포

1. Apps Script 에디터 상단: **배포 > 새 배포**
2. **유형 선택** 옆 톱니바퀴 아이콘 클릭 → **웹 앱** 선택
3. 설정:
   - **설명**: "Wedding RSVP API v1.0"
   - **실행 권한**: **나** (스프레드시트 소유자)
   - **액세스 권한**: **모든 사용자** (인증 없이 접근 가능)
4. **배포** 클릭
5. **권한 검토** 팝업:
   - **권한 검토** 클릭
   - Google 계정 선택
   - **고급** → **프로젝트로 이동(안전하지 않음)** 클릭
   - **허용** 클릭

---

### 2-5. Webhook URL 복사

배포 완료 후 **웹 앱 URL** 복사:

```
https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

**중요**: 이 URL은 절대 공개하지 마세요! GitHub Secrets에 저장할 것입니다.

---

## 3단계: 프론트엔드 연동

### 3-1. .env 파일 생성

프로젝트 루트에 `.env` 파일 생성:

```bash
# .env
PUBLIC_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**주의**: `.env` 파일은 `.gitignore`에 추가되어야 합니다!

---

### 3-2. index.html에 API 연동 코드 추가

#### 옵션 1: 간단한 구현 (바닐라 JS)

`index.html`의 `<script>` 태그 안에 다음 코드 추가:

```html
<script>
  // 환경 변수 (실제 배포 시 빌드 타임에 주입)
  const WEBHOOK_URL = 'YOUR_WEBHOOK_URL'; // 여기에 복사한 URL 붙여넣기

  // RSVP Form Submission
  document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '전송 중...';

    try {
      const formData = {
        name: document.getElementById('name').value.trim(),
        attendance: document.getElementById('attendance').value,
        guests: parseInt(document.getElementById('guests').value) || 0,
        message: document.getElementById('message').value.trim()
      };

      // API 요청
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submitRsvp',
          data: formData
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '오류가 발생했습니다.');
      }

      alert('참석 여부가 전송되었습니다!\n감사합니다! 💝');
      this.reset();

    } catch (error) {
      console.error('[RSVP Error]', error);
      alert(error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
</script>
```

---

#### 옵션 2: 모듈 방식 (권장)

`src/utils/rsvp.js` 파일을 사용:

```html
<script type="module">
  import { submitRsvp } from '/src/utils/rsvp.js';

  document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '전송 중...';

    try {
      const formData = {
        name: document.getElementById('name').value.trim(),
        attendance: document.getElementById('attendance').value,
        guests: parseInt(document.getElementById('guests').value) || 0,
        message: document.getElementById('message').value.trim()
      };

      await submitRsvp(formData);

      alert('참석 여부가 전송되었습니다!');
      this.reset();

    } catch (error) {
      alert(error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = '전송하기';
    }
  });
</script>
```

---

### 3-3. HTML 폼 수정 (참석 여부 값 변경)

`index.html`의 RSVP 폼에서 `attendance` 값을 변경:

**변경 전**:
```html
<select id="attendance" name="attendance" required>
  <option value="">선택해주세요</option>
  <option value="attend">참석</option>
  <option value="absent">불참</option>
</select>
```

**변경 후** (Apps Script와 일치):
```html
<select id="attendance" name="attendance" required>
  <option value="">선택해주세요</option>
  <option value="yes">참석</option>
  <option value="no">불참</option>
</select>
```

---

## 4단계: 테스트

### 4-1. Apps Script 에디터에서 테스트

1. Apps Script 에디터 → 함수 선택: `testSubmitRsvp`
2. **실행** 버튼 클릭
3. **보기 > 로그** 확인

**예상 출력**:
```json
{
  "success": true,
  "message": "참석 여부가 전송되었습니다.",
  "timestamp": "2025-10-18T10:30:00.000Z",
  "rowNumber": 2
}
```

4. Google Sheets의 **RSVP** 시트 확인 → 데이터 추가됨

---

### 4-2. cURL로 API 테스트

터미널에서 실행:

```bash
curl -X POST \
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "submitRsvp",
    "data": {
      "name": "테스트",
      "attendance": "yes",
      "guests": 2,
      "message": "축하합니다!"
    }
  }'
```

**예상 응답**:
```json
{"success":true,"message":"참석 여부가 전송되었습니다.","timestamp":"...","rowNumber":3}
```

---

### 4-3. 브라우저에서 폼 제출 테스트

1. 로컬 서버 실행:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (http-server)
   npx http-server
   ```

2. 브라우저에서 `http://localhost:8000` 열기
3. RSVP 폼 작성 및 제출
4. Google Sheets에서 데이터 확인

---

### 4-4. 통계 API 테스트

```bash
curl -X GET \
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getRsvpStats'
```

**예상 응답**:
```json
{
  "success": true,
  "stats": {
    "totalSubmissions": 3,
    "attending": 2,
    "notAttending": 1,
    "totalGuests": 5
  }
}
```

---

## 5단계: 프로덕션 배포

### 5-1. GitHub Secrets 설정

1. GitHub 저장소 페이지 접속
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** 클릭
4. 설정:
   - Name: `RSVP_WEBHOOK_URL`
   - Value: (복사한 Webhook URL)
5. **Add secret** 클릭

---

### 5-2. GitHub Actions Workflow 수정

`.github/workflows/deploy.yml` 파일에서 환경 변수 추가:

```yaml
- name: Build site
  run: pnpm build
  env:
    PUBLIC_RSVP_WEBHOOK_URL: ${{ secrets.RSVP_WEBHOOK_URL }}
    PUBLIC_KAKAO_MAP_KEY: ${{ secrets.KAKAO_MAP_KEY }}
```

---

### 5-3. GitHub Pages 배포

1. Git 커밋 및 푸시:
   ```bash
   git add .
   git commit -m "Add RSVP backend integration"
   git push origin main
   ```

2. GitHub Actions 실행 확인:
   - **Actions** 탭 → 최신 워크플로우 확인
   - 빌드 성공 대기 (약 2-3분)

3. GitHub Pages URL 접속:
   ```
   https://yourusername.github.io/wedding-invitation
   ```

4. RSVP 폼 제출 테스트
5. Google Sheets에서 데이터 확인

---

## 트러블슈팅

### 문제 1: "요청이 거부되었습니다" (403 Forbidden)

**원인**: Apps Script 배포 권한 설정 오류

**해결**:
1. Apps Script 에디터 → **배포** → **배포 관리**
2. 현재 배포의 **액세스 권한** 확인
3. **모든 사용자**가 아니면 수정:
   - **편집** 아이콘 클릭
   - **액세스 권한**: **모든 사용자**
   - **배포** 클릭

---

### 문제 2: "스프레드시트를 찾을 수 없습니다" (500 Error)

**원인**: 시트 이름 불일치

**해결**:
1. Google Sheets에서 시트 이름 확인:
   - `RSVP` (대소문자 정확히)
   - `Guestbook`
   - `Analytics`
2. 시트 이름 수정 또는 `CONFIG.SHEETS` 변수 수정

---

### 문제 3: CORS 에러 (브라우저 콘솔)

**원인**: CORS 헤더 미설정

**해결**:
Apps Script의 `createJsonResponse` 함수 확인 및 수정:

```javascript
function createJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  // CORS 허용 (모든 도메인)
  // 프로덕션에서는 특정 도메인만 허용 권장
  return output;
}
```

**프로덕션용 (특정 도메인만 허용)**:
```javascript
// Apps Script에서는 `setHeader` 메서드가 없으므로
// 대신 Apps Script 배포 설정에서 "모든 사용자" 권한 필요
```

---

### 문제 4: 환경 변수가 로드되지 않음

**원인**: 빌드 시 환경 변수 주입 실패

**해결**:

#### GitHub Pages (정적 배포):
1. `.env` 파일은 빌드 타임에만 사용됨
2. GitHub Secrets에 설정 필요
3. 빌드 스크립트에서 환경 변수 주입 확인

#### 로컬 개발:
1. `.env` 파일 생성 확인
2. 빌드 도구 설정 확인 (Vite, Webpack 등)
3. 하드코딩으로 임시 테스트:
   ```javascript
   const WEBHOOK_URL = 'https://script.google.com/macros/s/.../exec';
   ```

---

### 문제 5: 이메일 알림이 안 옴

**원인**: MailApp 권한 부여 필요

**해결**:
1. Apps Script 에디터에서 임의 함수 **실행**
2. 권한 요청 팝업 → **권한 검토**
3. Google 계정 선택 → **허용**

**또는**:
1. `CONFIG.EMAIL.ENABLED`를 `false`로 설정 (이메일 비활성화)

---

## 다음 단계

- ✅ 방명록 기능 구현 (`src/utils/guestbook.js` 활용)
- ✅ 실시간 통계 표시 (`getRsvpStats()` 활용)
- ✅ 카카오맵 연동
- ✅ 사진 갤러리 추가

---

## 참고 자료

- [Google Apps Script 문서](https://developers.google.com/apps-script)
- [GitHub Actions 환경 변수](https://docs.github.com/en/actions/learn-github-actions/environment-variables)
- [GitHub Secrets 관리](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Last Updated**: 2025-10-18
**Document Owner**: Backend Engineer

---

**Navigation**: [← GOOGLE_APPS_SCRIPT](./GOOGLE_APPS_SCRIPT.md) | [BACKEND_ARCHITECTURE →](../architecture/BACKEND_ARCHITECTURE.md)
