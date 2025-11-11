# 🗺️ 지도 설정 가이드

카카오맵 API 연동 및 모바일 딥링크 설정 가이드입니다.

---

## 📋 목차

1. [카카오맵 API 키 발급](#1-카카오맵-api-키-발급)
2. [예식장 위치 설정](#2-예식장-위치-설정)
3. [모바일 딥링크 테스트](#3-모바일-딥링크-테스트)
4. [문제 해결](#4-문제-해결)

---

## 1. 카카오맵 API 키 발급

### 1️⃣ 카카오 개발자 사이트 접속

https://developers.kakao.com 접속

### 2️⃣ 로그인 및 앱 생성

1. 카카오 계정으로 로그인
2. 우측 상단 **내 애플리케이션** 클릭
3. **애플리케이션 추가하기** 클릭
4. 앱 이름 입력 (예: `Wedding Invitation`)
5. 저장

### 3️⃣ 플랫폼 설정

1. 생성한 앱 선택
2. 좌측 메뉴에서 **플랫폼** 클릭
3. **Web 플랫폼 등록** 클릭
4. 사이트 도메인 등록:
   - 로컬 테스트: `http://localhost:3000`
   - GitHub Pages: `https://yourusername.github.io`
5. 저장

### 4️⃣ JavaScript 키 복사

1. 좌측 메뉴 **앱 키** 클릭
2. **JavaScript 키** 복사 (예: `abc123def456...`)

### 5️⃣ HTML 파일에 키 입력

`index.html` 파일 27번째 줄 수정:

```html
<!-- 수정 전 -->
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_JAVASCRIPT_KEY_HERE"></script>

<!-- 수정 후 -->
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=abc123def456..."></script>
```

**⚠️ 주의**: `YOUR_JAVASCRIPT_KEY_HERE`를 실제 키로 교체하세요!

---

## 2. 예식장 위치 설정

### 1️⃣ 예식장 좌표 찾기

**방법 1: 카카오맵에서 직접 찾기**
1. https://map.kakao.com 접속
2. 예식장 이름 검색
3. 장소 클릭 후 **공유** 버튼
4. URL 복사 (예: `?map_type=TYPE&target=map&lat=37.5006&lng=127.0363`)
5. `lat`, `lng` 값 확인

**방법 2: 주소로 변환 (권장)**
1. https://developers.kakao.com/tool/geocoder 접속
2. 예식장 주소 입력
3. `latitude`, `longitude` 값 복사

### 2️⃣ JavaScript 파일 수정

`src/scripts/main.js` 파일 7~12번째 줄 수정:

```javascript
// 현재 (예시)
const VENUE_LOCATION = {
  lat: 37.5006, // 위도
  lng: 127.0363, // 경도
  name: '서울 강남구 역삼동 웨딩홀',
  address: '서울특별시 강남구 테헤란로 123 (역삼동)',
};

// 수정 예시
const VENUE_LOCATION = {
  lat: 37.5242, // 실제 위도로 변경
  lng: 127.0419, // 실제 경도로 변경
  name: '그랜드 하얏트 서울',
  address: '서울특별시 용산구 소월로 322',
};
```

### 3️⃣ HTML 파일 주소 수정

`index.html` 127~130번째 줄 수정:

```html
<div class="address-info">
    <p class="address-text">
        <strong>서울특별시 용산구 소월로 322</strong>
    </p>
    <button class="copy-address-btn" onclick="copyAddress()">📋 주소 복사</button>
</div>
```

---

## 3. 모바일 딥링크 테스트

### ✅ 테스트 체크리스트

#### 카카오맵 (31% 점유율)
- [ ] **모바일**: 클릭 시 카카오맵 앱 실행 확인
- [ ] **앱 미설치 시**: 카카오맵 웹으로 자동 이동 확인
- [ ] **위치 정확도**: 예식장 위치 정확히 표시되는지 확인

#### 네이버지도 (68% 점유율)
- [ ] **모바일**: 클릭 시 네이버지도 앱 실행 확인
- [ ] **앱 미설치 시**: 네이버지도 웹으로 자동 이동 확인
- [ ] **검색 결과**: 예식장 이름으로 검색되는지 확인

#### 티맵 (내비 74% 점유율)
- [ ] **모바일**: 클릭 시 티맵 앱 실행 확인
- [ ] **목적지 설정**: 예식장이 목적지로 설정되는지 확인
- [ ] **앱 미설치 시**: 웹 fallback 동작 확인

### 테스트 방법

1. **로컬 서버 실행**:
   ```bash
   npm run dev
   ```

2. **모바일에서 접속**:
   - 같은 WiFi에서 접속: `http://192.168.x.x:3000`
   - 또는 GitHub Pages에 배포 후 테스트

3. **각 앱 버튼 클릭 테스트**

---

## 4. 문제 해결

### ❌ 지도가 회색 화면으로 표시됨

**원인**: API 키가 잘못되었거나 도메인 등록이 안 됨

**해결**:
1. 개발자 도구(F12) → Console 탭 확인
2. 에러 메시지 확인:
   - `Kakao Maps API not loaded`: API 키 확인
   - `401 Unauthorized`: 도메인 등록 확인
3. 카카오 개발자 사이트에서 도메인 재등록

---

### ❌ 마커가 엉뚱한 곳에 표시됨

**원인**: 위도/경도가 잘못됨

**해결**:
1. 카카오맵에서 예식장 검색
2. URL에서 `lat`, `lng` 값 다시 확인
3. `src/scripts/main.js` 파일의 좌표 수정

---

### ❌ 모바일 딥링크가 동작 안 함

**원인**: 앱이 설치되지 않았거나 URL 스킴 오류

**해결**:
1. 해당 지도 앱 설치 확인 (카카오맵, 네이버지도, 티맵)
2. 1.5초 후 웹 버전으로 자동 이동 (정상 동작)
3. iOS 사용자: Safari에서 테스트 (Chrome 앱에서는 제한될 수 있음)

---

### ❌ CORS 에러 발생

**원인**: 로컬 파일로 직접 열었을 때 (file:// 프로토콜)

**해결**:
- 반드시 **웹 서버**를 통해 실행:
  ```bash
  npm run dev
  # 또는
  npx http-server .
  ```

---

### ❌ 배포 후 지도가 안 나옴

**원인**: GitHub Pages 도메인이 등록되지 않음

**해결**:
1. 카카오 개발자 사이트 → 플랫폼 설정
2. 사이트 도메인 추가:
   ```
   https://yourusername.github.io
   ```
3. 저장 후 5분 대기

---

## 5. 고급 설정 (선택)

### 지도 컨트롤 추가

`src/scripts/main.js` 파일의 `initKakaoMap()` 함수에 추가:

```javascript
// 확대/축소 컨트롤
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 지도 타입 컨트롤 (일반/스카이뷰)
const mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
```

### 커스텀 마커 사용

```javascript
const imageSrc = '/images/custom-marker.png';
const imageSize = new kakao.maps.Size(64, 69);
const imageOption = { offset: new kakao.maps.Point(27, 69) };

const markerImage = new kakao.maps.MarkerImage(
  imageSrc,
  imageSize,
  imageOption
);

const marker = new kakao.maps.Marker({
  position: markerPosition,
  image: markerImage,
});
```

---

## 📱 예상 사용자 경험

### 모바일 사용자 (95%+)

```
1. 청첩장 스크롤 → "오시는 길" 섹션 도달
2. 카카오맵 지도로 예식장 위치 확인
3. "앱으로 길찾기" 버튼 중 선호하는 앱 선택
4. 앱이 자동 실행되어 길찾기 시작
   (또는 웹 버전으로 이동)
```

### 데스크톱 사용자 (5%)

```
1. 지도로 위치 확인
2. 주소 복사 버튼으로 주소 복사
3. 앱 버튼 클릭 시 웹 버전이 새 탭에서 열림
```

---

## ✅ 완료 체크리스트

- [ ] 카카오맵 API 키 발급 완료
- [ ] `index.html`에 API 키 입력
- [ ] 예식장 위도/경도 확인
- [ ] `src/scripts/main.js` 좌표 수정
- [ ] `index.html` 주소 텍스트 수정
- [ ] 로컬에서 지도 표시 확인
- [ ] 모바일에서 딥링크 테스트
- [ ] GitHub Pages에 배포
- [ ] 배포 URL에서 최종 확인

---

## 🎉 완료!

모든 설정이 완료되었습니다. 이제 하객들이 모바일에서 원하는 지도 앱으로 바로 길찾기를 할 수 있습니다!

**질문이나 문제가 있다면**: [GitHub Issues](https://github.com/yourusername/wedding-invitation/issues)
