# Mobile Navigation App Integration Guide

**결론**: 이 문서는 모바일 웹(청첩장)에서 T맵, 카카오내비, 네이버지도 앱을 연동하는 완전한 구현 가이드입니다. 복사-붙여넣기 가능한 코드와 실전 트러블슈팅을 포함합니다.

## Table of Contents

- [Overview](#overview)
- [Quick Start (5분 구현)](#quick-start-5분-구현)
- [Implementation Guide](#implementation-guide)
  - [Kakao Navi](#1-kakao-navi-카카오내비)
  - [T Map](#2-t-map-티맵)
  - [Naver Map](#3-naver-map-네이버지도)
- [Cross-Platform Integration](#cross-platform-integration)
- [Production Checklist](#production-checklist)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Examples](#examples)

---

## Overview

### 비교표

**핵심**: 각 네비게이션 앱은 서로 다른 연동 방식을 사용하며, 카카오내비만 공식 SDK를 제공합니다.

| 항목 | Kakao Navi | T Map | Naver Map |
|------|------------|-------|-----------|
| **연동 방식** | JavaScript SDK | URL Scheme | URL Scheme |
| **공식 문서** | ✅ 있음 | ❌ 없음 | ✅ 있음 |
| **API Key 필요** | ✅ 필수 | ❌ 불필요 | ❌ 불필요 |
| **좌표계** | WGS84/KATEC | WGS84 | WGS84 |
| **iOS 지원** | ✅ | ✅ | ✅ |
| **Android 지원** | ✅ | ✅ | ✅ |
| **Fallback 난이도** | 낮음 | 중간 | 낮음 |

### 기술 스택

- **Frontend**: Vanilla JavaScript (ES6+) 또는 TypeScript
- **Hosting**: GitHub Pages, Netlify, Vercel 등 정적 호스팅
- **Dependencies**: Kakao JavaScript SDK (CDN)
- **Environment**: 모바일 웹 브라우저 (iOS Safari, Android Chrome)

### 브라우저/OS 호환성

| 환경 | 지원 여부 | 비고 |
|------|----------|------|
| iOS Safari | ✅ | URL Scheme 직접 지원 |
| Android Chrome | ✅ | Intent URL 사용 권장 |
| 카카오톡 인앱 브라우저 | ✅ | SDK 사용 권장 |
| PC 브라우저 | ⚠️ | 앱 미설치로 동작 불가 |

---

## Quick Start (5분 구현)

**결론**: HTML에 SDK를 추가하고 3개 함수만 복사하면 즉시 사용 가능합니다.

### 1. HTML 기본 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>청첩장 - 오시는 길</title>

    <!-- Kakao SDK -->
    <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"></script>
</head>
<body>
    <h2>오시는 길</h2>
    <p>서울시 강남구 테헤란로 123</p>

    <button onclick="openKakaoNavi()">카카오내비</button>
    <button onclick="openTMap()">티맵</button>
    <button onclick="openNaverMap()">네이버지도</button>

    <script src="navigation.js"></script>
</body>
</html>
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
# Kakao Developers에서 발급받은 JavaScript 키
KAKAO_JAVASCRIPT_KEY=YOUR_JAVASCRIPT_KEY_HERE

# Naver Map URL Scheme에 필요한 앱 식별자
NAVER_APP_NAME=com.yourcompany.wedding
```

### 3. JavaScript 구현 (navigation.js)

```javascript
// 환경 설정
const CONFIG = {
    KAKAO_KEY: 'YOUR_JAVASCRIPT_KEY', // 실제 키로 교체
    NAVER_APP_NAME: 'com.yourcompany.wedding',
    VENUE: {
        name: '더 라움 강남',
        latitude: 37.5012743,
        longitude: 127.0396597
    }
};

// Kakao SDK 초기화
if (!Kakao.isInitialized()) {
    Kakao.init(CONFIG.KAKAO_KEY);
}

// 1. 카카오내비 열기
function openKakaoNavi() {
    Kakao.Navi.start({
        name: CONFIG.VENUE.name,
        x: CONFIG.VENUE.longitude,
        y: CONFIG.VENUE.latitude,
        coordType: 'wgs84'
    });
}

// 2. 티맵 열기
function openTMap() {
    const { name, latitude, longitude } = CONFIG.VENUE;
    const url = `tmap://route?goalname=${encodeURIComponent(name)}&goalx=${longitude}&goaly=${latitude}`;

    // Android Intent URL fallback
    const intentUrl = `intent://route?goalname=${encodeURIComponent(name)}&goalx=${longitude}&goaly=${latitude}#Intent;scheme=tmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.skt.tmap.ku;end`;

    if (getMobileOS() === 'Android') {
        location.href = intentUrl;
    } else {
        location.href = url;
        // iOS fallback - 앱스토어로 이동
        setTimeout(() => {
            location.href = 'https://apps.apple.com/app/id431589174';
        }, 1500);
    }
}

// 3. 네이버지도 열기
function openNaverMap() {
    const { name, latitude, longitude } = CONFIG.VENUE;
    const url = `nmap://route/car?dlat=${latitude}&dlng=${longitude}&dname=${encodeURIComponent(name)}&appname=${CONFIG.NAVER_APP_NAME}`;

    location.href = url;

    // Fallback - 앱 미설치 시 앱스토어로 이동
    setTimeout(() => {
        if (getMobileOS() === 'Android') {
            location.href = 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap';
        } else {
            location.href = 'https://apps.apple.com/app/id311867728';
        }
    }, 1500);
}

// OS 감지 유틸리티
function getMobileOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) return "Android";
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
    return "unknown";
}
```

### 4. 필수 viewport 설정

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## Implementation Guide

## 1. Kakao Navi (카카오내비)

**결론**: 카카오내비는 공식 JavaScript SDK를 제공하며, API 키 발급 후 SDK 초기화만으로 간단히 연동 가능합니다.

### 1.1 API Key 발급 (단계별)

1. **Kakao Developers 접속**
   - URL: https://developers.kakao.com
   - 카카오 계정으로 로그인

2. **애플리케이션 등록**
   ```
   내 애플리케이션 > 애플리케이션 추가하기
   - 앱 이름: 예) "홍길동♥김영희 결혼식"
   - 사업자명: 개인 (선택)
   ```

3. **JavaScript 키 확인**
   ```
   내 애플리케이션 > 앱 설정 > 요약 정보
   - JavaScript 키 복사
   ```

4. **플랫폼 등록 (선택)**
   ```
   내 애플리케이션 > 앱 설정 > 플랫폼
   - Web 플랫폼 추가
   - 사이트 도메인: https://username.github.io
   ```

### 1.2 SDK 초기화

```javascript
// CDN으로 SDK 로드 (HTML)
<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"></script>

// SDK 초기화 (JavaScript)
if (!Kakao.isInitialized()) {
    Kakao.init('YOUR_JAVASCRIPT_KEY');
    console.log('Kakao SDK initialized:', Kakao.isInitialized());
}
```

### 1.3 네비게이션 실행

#### 기본 사용법

```javascript
function openKakaoNavi() {
    Kakao.Navi.start({
        name: '더 라움 강남',
        x: 127.0396597,      // 경도 (longitude)
        y: 37.5012743,       // 위도 (latitude)
        coordType: 'wgs84'   // 좌표계: 'wgs84' 또는 'katec'
    });
}
```

#### 고급 옵션

```javascript
function openKakaoNaviAdvanced() {
    Kakao.Navi.start({
        name: '더 라움 강남',
        x: 127.0396597,
        y: 37.5012743,
        coordType: 'wgs84'
    }, {
        // 성공 콜백
        success: function() {
            console.log('카카오내비 실행 성공');
        },
        // 실패 콜백
        fail: function(error) {
            console.error('카카오내비 실행 실패:', error);
            alert('카카오내비 앱을 설치해주세요.');
            // 앱스토어로 이동
            window.location.href = 'https://kakaonavi.kakao.com/launch/index.do';
        }
    });
}
```

### 1.4 좌표계 변환

**이유**: 카카오내비는 WGS84(GPS 좌표)와 KATEC(카텍 좌표)를 모두 지원합니다.

```javascript
// WGS84 좌표계 (일반적으로 사용)
const wgs84Coord = {
    coordType: 'wgs84',
    x: 127.0396597,  // 경도
    y: 37.5012743    // 위도
};

// KATEC 좌표계 (구형 시스템)
const katecCoord = {
    coordType: 'katec',
    x: 321286,
    y: 533707
};
```

### 1.5 에러 핸들링

```javascript
function safeOpenKakaoNavi() {
    try {
        if (typeof Kakao === 'undefined') {
            throw new Error('Kakao SDK가 로드되지 않았습니다.');
        }

        if (!Kakao.isInitialized()) {
            throw new Error('Kakao SDK가 초기화되지 않았습니다.');
        }

        Kakao.Navi.start({
            name: '더 라움 강남',
            x: 127.0396597,
            y: 37.5012743,
            coordType: 'wgs84'
        }, {
            fail: function(error) {
                console.error('Kakao Navi Error:', error);
                // 사용자 친화적 메시지
                if (confirm('카카오내비 앱이 필요합니다. 다운로드 페이지로 이동하시겠습니까?')) {
                    window.location.href = 'https://kakaonavi.kakao.com/launch/index.do';
                }
            }
        });
    } catch (error) {
        console.error('Kakao Navi Error:', error);
        alert(error.message);
    }
}
```

---

## 2. T Map (티맵)

**결론**: 티맵은 공식 API 문서가 없으며, URL Scheme과 Intent URL을 사용합니다. Android와 iOS 처리가 다릅니다.

### 2.1 URL Scheme 구조

```
tmap://route?goalname=[목적지명]&goalx=[경도]&goaly=[위도]
```

**파라미터 설명**:
- `goalname`: 목적지 이름 (URL 인코딩 필요)
- `goalx`: 목적지 경도 (longitude, WGS84)
- `goaly`: 목적지 위도 (latitude, WGS84)

### 2.2 iOS 구현

```javascript
function openTMapIOS() {
    const venueName = '더 라움 강남';
    const longitude = 127.0396597;
    const latitude = 37.5012743;

    const tmapUrl = `tmap://route?goalname=${encodeURIComponent(venueName)}&goalx=${longitude}&goaly=${latitude}`;

    // 앱 실행 시도
    window.location.href = tmapUrl;

    // 1.5초 후에도 페이지에 있으면 앱이 설치되지 않은 것으로 판단
    const appStoreUrl = 'https://apps.apple.com/app/id431589174';

    setTimeout(() => {
        if (confirm('티맵 앱이 설치되어 있지 않습니다. 앱스토어로 이동하시겠습니까?')) {
            window.location.href = appStoreUrl;
        }
    }, 1500);
}
```

### 2.3 Android 구현 (Intent URL)

**이유**: Android Chrome은 URL Scheme보다 Intent URL을 더 안정적으로 처리합니다.

```javascript
function openTMapAndroid() {
    const venueName = '더 라움 강남';
    const longitude = 127.0396597;
    const latitude = 37.5012743;

    // Intent URL 구조
    const intentUrl =
        `intent://route` +
        `?goalname=${encodeURIComponent(venueName)}` +
        `&goalx=${longitude}` +
        `&goaly=${latitude}` +
        `#Intent;` +
        `scheme=tmap;` +
        `action=android.intent.action.VIEW;` +
        `category=android.intent.category.BROWSABLE;` +
        `package=com.skt.tmap.ku;` +
        `S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.skt.tmap.ku')};` +
        `end`;

    window.location.href = intentUrl;
}
```

### 2.4 크로스 플랫폼 통합

```javascript
function openTMap() {
    const config = {
        name: '더 라움 강남',
        longitude: 127.0396597,
        latitude: 37.5012743
    };

    const os = getMobileOS();

    if (os === 'Android') {
        openTMapWithIntent(config);
    } else if (os === 'iOS') {
        openTMapWithScheme(config);
    } else {
        alert('모바일 기기에서만 사용 가능합니다.');
    }
}

function openTMapWithIntent(config) {
    const intentUrl =
        `intent://route` +
        `?goalname=${encodeURIComponent(config.name)}` +
        `&goalx=${config.longitude}` +
        `&goaly=${config.latitude}` +
        `#Intent;` +
        `scheme=tmap;` +
        `action=android.intent.action.VIEW;` +
        `category=android.intent.category.BROWSABLE;` +
        `package=com.skt.tmap.ku;` +
        `S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.skt.tmap.ku')};` +
        `end`;

    window.location.href = intentUrl;
}

function openTMapWithScheme(config) {
    const tmapUrl = `tmap://route?goalname=${encodeURIComponent(config.name)}&goalx=${config.longitude}&goaly=${config.latitude}`;

    window.location.href = tmapUrl;

    setTimeout(() => {
        const currentUrl = window.location.href;
        // 페이지가 변경되지 않았으면 앱이 설치되지 않은 것
        if (currentUrl.indexOf('tmap://') === -1) {
            if (confirm('티맵 앱이 필요합니다. 앱스토어로 이동하시겠습니까?')) {
                window.location.href = 'https://apps.apple.com/app/id431589174';
            }
        }
    }, 1500);
}
```

### 2.5 Fallback 패턴

```javascript
function openTMapWithFallback() {
    const config = {
        name: '더 라움 강남',
        longitude: 127.0396597,
        latitude: 37.5012743
    };

    const os = getMobileOS();

    // 1차 시도: 네이티브 앱 실행
    try {
        if (os === 'Android') {
            window.location.href = buildTMapIntentUrl(config);
        } else if (os === 'iOS') {
            window.location.href = buildTMapSchemeUrl(config);

            // 2차 fallback: 앱스토어 (iOS만)
            setTimeout(() => {
                window.location.href = 'https://apps.apple.com/app/id431589174';
            }, 1500);
        } else {
            throw new Error('Unsupported platform');
        }
    } catch (error) {
        // 3차 fallback: 웹 버전 또는 에러 메시지
        console.error('T Map Error:', error);
        alert('티맵을 실행할 수 없습니다. 앱을 설치해주세요.');
    }
}

function buildTMapSchemeUrl(config) {
    return `tmap://route?goalname=${encodeURIComponent(config.name)}&goalx=${config.longitude}&goaly=${config.latitude}`;
}

function buildTMapIntentUrl(config) {
    return `intent://route?goalname=${encodeURIComponent(config.name)}&goalx=${config.longitude}&goaly=${config.latitude}#Intent;scheme=tmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.skt.tmap.ku;S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.skt.tmap.ku')};end`;
}
```

---

## 3. Naver Map (네이버지도)

**결론**: 네이버지도는 공식 URL Scheme 문서를 제공하며, appname 파라미터가 필수입니다.

### 3.1 URL Scheme 구조

```
nmap://route/car?dlat=[위도]&dlng=[경도]&dname=[목적지명]&appname=[앱식별자]
```

**파라미터 설명**:
- `dlat`: 목적지 위도 (latitude, WGS84)
- `dlng`: 목적지 경도 (longitude, WGS84)
- `dname`: 목적지 이름 (URL 인코딩 필요)
- `appname`: 앱 식별자 (필수, 패키지명 또는 번들 ID 권장)

**경로 타입**:
- `car`: 자동차 네비게이션 (기본)
- `walk`: 도보 길찾기
- `bicycle`: 자전거 길찾기
- `public`: 대중교통 길찾기

### 3.2 기본 구현

```javascript
function openNaverMap() {
    const config = {
        name: '더 라움 강남',
        latitude: 37.5012743,
        longitude: 127.0396597,
        appName: 'com.yourcompany.wedding' // 실제 앱 식별자로 교체
    };

    const naverUrl =
        `nmap://route/car` +
        `?dlat=${config.latitude}` +
        `&dlng=${config.longitude}` +
        `&dname=${encodeURIComponent(config.name)}` +
        `&appname=${config.appName}`;

    window.location.href = naverUrl;
}
```

### 3.3 경로 타입별 구현

```javascript
const NaverMapRouteType = {
    CAR: 'car',
    WALK: 'walk',
    BICYCLE: 'bicycle',
    PUBLIC: 'public'
};

function openNaverMapWithRouteType(routeType = NaverMapRouteType.CAR) {
    const config = {
        name: '더 라움 강남',
        latitude: 37.5012743,
        longitude: 127.0396597,
        appName: 'com.yourcompany.wedding'
    };

    const naverUrl =
        `nmap://route/${routeType}` +
        `?dlat=${config.latitude}` +
        `&dlng=${config.longitude}` +
        `&dname=${encodeURIComponent(config.name)}` +
        `&appname=${config.appName}`;

    window.location.href = naverUrl;
}

// 사용 예시
function openNaverMapCar() {
    openNaverMapWithRouteType(NaverMapRouteType.CAR);
}

function openNaverMapPublic() {
    openNaverMapWithRouteType(NaverMapRouteType.PUBLIC);
}
```

### 3.4 출발지 포함 구현

**핵심**: 출발지를 지정하면 사용자의 현재 위치 대신 특정 위치에서 출발하는 경로를 안내합니다.

```javascript
function openNaverMapWithStartPoint() {
    const config = {
        // 출발지
        startName: '강남역',
        startLatitude: 37.4979502,
        startLongitude: 127.0276368,
        // 목적지
        destName: '더 라움 강남',
        destLatitude: 37.5012743,
        destLongitude: 127.0396597,
        appName: 'com.yourcompany.wedding'
    };

    const naverUrl =
        `nmap://route/car` +
        `?slat=${config.startLatitude}` +     // 출발지 위도
        `&slng=${config.startLongitude}` +    // 출발지 경도
        `&sname=${encodeURIComponent(config.startName)}` +  // 출발지 이름
        `&dlat=${config.destLatitude}` +      // 목적지 위도
        `&dlng=${config.destLongitude}` +     // 목적지 경도
        `&dname=${encodeURIComponent(config.destName)}` +   // 목적지 이름
        `&appname=${config.appName}`;

    window.location.href = naverUrl;
}
```

### 3.5 Fallback 구현

```javascript
function openNaverMapWithFallback() {
    const config = {
        name: '더 라움 강남',
        latitude: 37.5012743,
        longitude: 127.0396597,
        appName: 'com.yourcompany.wedding'
    };

    const naverUrl =
        `nmap://route/car` +
        `?dlat=${config.latitude}` +
        `&dlng=${config.longitude}` +
        `&dname=${encodeURIComponent(config.name)}` +
        `&appname=${config.appName}`;

    // 앱 실행 시도
    window.location.href = naverUrl;

    // Fallback: 앱 미설치 시 스토어로 이동
    setTimeout(() => {
        const os = getMobileOS();
        if (os === 'Android') {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap';
        } else if (os === 'iOS') {
            window.location.href = 'https://apps.apple.com/app/id311867728';
        }
    }, 1500);
}
```

### 3.6 Intent URL (Android 최적화)

```javascript
function openNaverMapAndroid() {
    const config = {
        name: '더 라움 강남',
        latitude: 37.5012743,
        longitude: 127.0396597,
        appName: 'com.yourcompany.wedding'
    };

    const intentUrl =
        `intent://route/car` +
        `?dlat=${config.latitude}` +
        `&dlng=${config.longitude}` +
        `&dname=${encodeURIComponent(config.name)}` +
        `&appname=${config.appName}` +
        `#Intent;` +
        `scheme=nmap;` +
        `action=android.intent.action.VIEW;` +
        `category=android.intent.category.BROWSABLE;` +
        `package=com.nhn.android.nmap;` +
        `S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.nhn.android.nmap')};` +
        `end`;

    window.location.href = intentUrl;
}
```

---

## Cross-Platform Integration

**결론**: OS를 감지하고 각 네비게이션 앱의 특성에 맞게 통합된 모듈을 제공합니다.

### OS 감지 유틸리티

```javascript
/**
 * 모바일 OS를 감지합니다.
 * @returns {'Android' | 'iOS' | 'unknown'}
 */
function getMobileOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Android 감지
    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS 감지
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

/**
 * 특정 OS인지 확인합니다.
 */
function isAndroid() {
    return getMobileOS() === 'Android';
}

function isIOS() {
    return getMobileOS() === 'iOS';
}

function isMobile() {
    const os = getMobileOS();
    return os === 'Android' || os === 'iOS';
}
```

### 통합 네비게이션 모듈

```javascript
/**
 * NavigationManager - 모든 네비게이션 앱을 관리하는 통합 모듈
 */
class NavigationManager {
    constructor(config) {
        this.config = {
            kakaoKey: config.kakaoKey,
            naverAppName: config.naverAppName || 'com.yourcompany.wedding',
            venue: {
                name: config.venueName,
                latitude: config.latitude,
                longitude: config.longitude
            }
        };

        // Kakao SDK 초기화
        if (this.config.kakaoKey && typeof Kakao !== 'undefined') {
            if (!Kakao.isInitialized()) {
                Kakao.init(this.config.kakaoKey);
            }
        }
    }

    /**
     * 카카오내비 실행
     */
    openKakaoNavi() {
        if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
            console.error('Kakao SDK not initialized');
            alert('카카오내비를 실행할 수 없습니다.');
            return;
        }

        Kakao.Navi.start({
            name: this.config.venue.name,
            x: this.config.venue.longitude,
            y: this.config.venue.latitude,
            coordType: 'wgs84'
        }, {
            fail: (error) => {
                console.error('Kakao Navi Error:', error);
                if (confirm('카카오내비 앱이 필요합니다. 다운로드하시겠습니까?')) {
                    window.location.href = 'https://kakaonavi.kakao.com/launch/index.do';
                }
            }
        });
    }

    /**
     * 티맵 실행
     */
    openTMap() {
        const os = getMobileOS();

        if (os === 'Android') {
            this._openTMapAndroid();
        } else if (os === 'iOS') {
            this._openTMapIOS();
        } else {
            alert('모바일 기기에서만 사용 가능합니다.');
        }
    }

    _openTMapAndroid() {
        const { name, latitude, longitude } = this.config.venue;

        const intentUrl =
            `intent://route` +
            `?goalname=${encodeURIComponent(name)}` +
            `&goalx=${longitude}` +
            `&goaly=${latitude}` +
            `#Intent;` +
            `scheme=tmap;` +
            `action=android.intent.action.VIEW;` +
            `category=android.intent.category.BROWSABLE;` +
            `package=com.skt.tmap.ku;` +
            `S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.skt.tmap.ku')};` +
            `end`;

        window.location.href = intentUrl;
    }

    _openTMapIOS() {
        const { name, latitude, longitude } = this.config.venue;
        const tmapUrl = `tmap://route?goalname=${encodeURIComponent(name)}&goalx=${longitude}&goaly=${latitude}`;

        window.location.href = tmapUrl;

        setTimeout(() => {
            if (confirm('티맵 앱이 필요합니다. 앱스토어로 이동하시겠습니까?')) {
                window.location.href = 'https://apps.apple.com/app/id431589174';
            }
        }, 1500);
    }

    /**
     * 네이버지도 실행
     * @param {string} routeType - 'car', 'walk', 'bicycle', 'public'
     */
    openNaverMap(routeType = 'car') {
        const os = getMobileOS();

        if (os === 'Android') {
            this._openNaverMapAndroid(routeType);
        } else {
            this._openNaverMapCommon(routeType);
        }
    }

    _openNaverMapCommon(routeType) {
        const { name, latitude, longitude } = this.config.venue;

        const naverUrl =
            `nmap://route/${routeType}` +
            `?dlat=${latitude}` +
            `&dlng=${longitude}` +
            `&dname=${encodeURIComponent(name)}` +
            `&appname=${this.config.naverAppName}`;

        window.location.href = naverUrl;

        setTimeout(() => {
            const storeUrl = isIOS()
                ? 'https://apps.apple.com/app/id311867728'
                : 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap';

            if (confirm('네이버지도 앱이 필요합니다. 다운로드하시겠습니까?')) {
                window.location.href = storeUrl;
            }
        }, 1500);
    }

    _openNaverMapAndroid(routeType) {
        const { name, latitude, longitude } = this.config.venue;

        const intentUrl =
            `intent://route/${routeType}` +
            `?dlat=${latitude}` +
            `&dlng=${longitude}` +
            `&dname=${encodeURIComponent(name)}` +
            `&appname=${this.config.naverAppName}` +
            `#Intent;` +
            `scheme=nmap;` +
            `action=android.intent.action.VIEW;` +
            `category=android.intent.category.BROWSABLE;` +
            `package=com.nhn.android.nmap;` +
            `S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.nhn.android.nmap')};` +
            `end`;

        window.location.href = intentUrl;
    }

    /**
     * 사용 가능한 모든 네비게이션 앱 목록 반환
     */
    getAvailableApps() {
        return ['kakao', 'tmap', 'naver'];
    }
}

// 사용 예시
const navManager = new NavigationManager({
    kakaoKey: 'YOUR_KAKAO_JAVASCRIPT_KEY',
    naverAppName: 'com.yourcompany.wedding',
    venueName: '더 라움 강남',
    latitude: 37.5012743,
    longitude: 127.0396597
});

// 버튼 클릭 핸들러
document.getElementById('kakao-btn').addEventListener('click', () => {
    navManager.openKakaoNavi();
});

document.getElementById('tmap-btn').addEventListener('click', () => {
    navManager.openTMap();
});

document.getElementById('naver-btn').addEventListener('click', () => {
    navManager.openNaverMap('car');
});
```

### TypeScript 타입 정의

```typescript
// types/navigation.d.ts

export type MobileOS = 'Android' | 'iOS' | 'unknown';

export type NaverRouteType = 'car' | 'walk' | 'bicycle' | 'public';

export type CoordType = 'wgs84' | 'katec';

export interface VenueConfig {
    name: string;
    latitude: number;
    longitude: number;
}

export interface NavigationConfig {
    kakaoKey?: string;
    naverAppName?: string;
    venueName: string;
    latitude: number;
    longitude: number;
}

export interface KakaoNaviOptions {
    name: string;
    x: number;  // longitude
    y: number;  // latitude
    coordType: CoordType;
}

export interface KakaoNaviCallbacks {
    success?: () => void;
    fail?: (error: any) => void;
}

export interface NavigationManager {
    openKakaoNavi(): void;
    openTMap(): void;
    openNaverMap(routeType?: NaverRouteType): void;
    getAvailableApps(): string[];
}

// Kakao SDK 타입 확장
declare global {
    interface Window {
        Kakao: {
            init(apiKey: string): void;
            isInitialized(): boolean;
            Navi: {
                start(options: KakaoNaviOptions, callbacks?: KakaoNaviCallbacks): void;
            };
        };
    }
}
```

### 사용 예시 (TypeScript)

```typescript
// navigation.ts
import type {
    NavigationConfig,
    NaverRouteType,
    MobileOS
} from './types/navigation';

class NavigationManager {
    private config: NavigationConfig;

    constructor(config: NavigationConfig) {
        this.config = config;
        this.initKakaoSDK();
    }

    private initKakaoSDK(): void {
        if (this.config.kakaoKey && typeof window.Kakao !== 'undefined') {
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init(this.config.kakaoKey);
            }
        }
    }

    private getMobileOS(): MobileOS {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        if (/android/i.test(userAgent)) return "Android";
        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) return "iOS";
        return "unknown";
    }

    public openKakaoNavi(): void {
        if (typeof window.Kakao === 'undefined' || !window.Kakao.isInitialized()) {
            console.error('Kakao SDK not initialized');
            return;
        }

        window.Kakao.Navi.start({
            name: this.config.venueName,
            x: this.config.longitude,
            y: this.config.latitude,
            coordType: 'wgs84'
        }, {
            fail: (error) => {
                console.error('Kakao Navi Error:', error);
            }
        });
    }

    public openNaverMap(routeType: NaverRouteType = 'car'): void {
        const os = this.getMobileOS();

        if (os === 'Android') {
            this.openNaverMapAndroid(routeType);
        } else {
            this.openNaverMapCommon(routeType);
        }
    }

    private openNaverMapCommon(routeType: NaverRouteType): void {
        const url =
            `nmap://route/${routeType}` +
            `?dlat=${this.config.latitude}` +
            `&dlng=${this.config.longitude}` +
            `&dname=${encodeURIComponent(this.config.venueName)}` +
            `&appname=${this.config.naverAppName || 'com.yourcompany.wedding'}`;

        window.location.href = url;
    }

    private openNaverMapAndroid(routeType: NaverRouteType): void {
        // Android Intent URL 구현
    }
}

export default NavigationManager;
```

---

## Production Checklist

**결론**: 프로덕션 배포 전 보안, 성능, 테스트를 체크해야 합니다.

### 보안 고려사항

- [ ] **API 키 보호**
  ```javascript
  // ❌ 나쁜 예: API 키를 코드에 하드코딩
  Kakao.init('a1b2c3d4e5f6g7h8i9j0');

  // ✅ 좋은 예: 환경 변수 사용
  Kakao.init(process.env.KAKAO_JAVASCRIPT_KEY);
  ```

- [ ] **URL 파라미터 검증**
  ```javascript
  function sanitizeInput(input) {
      // XSS 방지
      return encodeURIComponent(input.replace(/[<>]/g, ''));
  }

  const safeName = sanitizeInput(userInput);
  ```

- [ ] **HTTPS 사용**
  - GitHub Pages는 자동으로 HTTPS 제공
  - 커스텀 도메인 사용 시 SSL 인증서 필수

- [ ] **CSP (Content Security Policy) 설정**
  ```html
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' https://t1.kakaocdn.net; connect-src 'self';">
  ```

### 성능 최적화

- [ ] **SDK 비동기 로딩**
  ```html
  <!-- ❌ 동기 로딩: 페이지 렌더링 차단 -->
  <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"></script>

  <!-- ✅ 비동기 로딩: 페이지 렌더링 차단 안 함 -->
  <script async src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"></script>
  ```

- [ ] **SDK 로딩 완료 확인**
  ```javascript
  function initKakaoWhenReady() {
      if (typeof Kakao !== 'undefined') {
          Kakao.init('YOUR_KEY');
      } else {
          setTimeout(initKakaoWhenReady, 100);
      }
  }

  // 또는 이벤트 리스너 사용
  window.addEventListener('load', () => {
      if (typeof Kakao !== 'undefined') {
          Kakao.init('YOUR_KEY');
      }
  });
  ```

- [ ] **Lazy Loading 버튼**
  ```html
  <!-- 첫 화면에 보이지 않는 버튼은 lazy load -->
  <img loading="lazy" src="tmap-icon.png" alt="T맵">
  ```

- [ ] **코드 최소화 (Minification)**
  ```bash
  # Terser를 사용한 JavaScript 압축
  npx terser navigation.js -o navigation.min.js --compress --mangle
  ```

### 테스트 시나리오

#### 1. 기능 테스트

| 테스트 케이스 | Android | iOS | 비고 |
|--------------|---------|-----|------|
| 카카오내비 앱 설치됨 | ✅ | ✅ | 앱이 정상 실행되는지 |
| 카카오내비 앱 미설치 | ✅ | ✅ | 다운로드 페이지로 이동하는지 |
| 티맵 앱 설치됨 | ✅ | ✅ | 목적지가 정확히 설정되는지 |
| 티맵 앱 미설치 | ✅ | ✅ | 앱스토어로 이동하는지 |
| 네이버지도 앱 설치됨 | ✅ | ✅ | 경로 타입이 올바른지 |
| 네이버지도 앱 미설치 | ✅ | ✅ | 플레이스토어/앱스토어로 이동 |
| PC에서 접속 | N/A | N/A | 적절한 안내 메시지 표시 |

#### 2. 브라우저 테스트

- [ ] Android Chrome (최신 버전)
- [ ] Android Samsung Internet
- [ ] iOS Safari (최신 버전)
- [ ] 카카오톡 인앱 브라우저
- [ ] 네이버 앱 인앱 브라우저
- [ ] 라인 인앱 브라우저

#### 3. 테스트 코드 예시

```javascript
// navigation.test.js
describe('NavigationManager', () => {
    let navManager;

    beforeEach(() => {
        navManager = new NavigationManager({
            kakaoKey: 'test_key',
            naverAppName: 'com.test.app',
            venueName: '테스트 장소',
            latitude: 37.5012743,
            longitude: 127.0396597
        });
    });

    test('카카오내비 URL이 올바르게 생성되는지', () => {
        // Kakao SDK 모킹 필요
    });

    test('티맵 Intent URL이 올바른 형식인지', () => {
        const url = navManager._buildTMapIntentUrl();
        expect(url).toContain('intent://route');
        expect(url).toContain('package=com.skt.tmap.ku');
    });

    test('네이버지도 URL에 appname이 포함되는지', () => {
        const url = navManager._buildNaverMapUrl('car');
        expect(url).toContain('appname=com.test.app');
    });

    test('모바일 OS 감지가 정확한지', () => {
        // User Agent 모킹
        Object.defineProperty(navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Linux; Android 10)',
            configurable: true
        });

        expect(getMobileOS()).toBe('Android');
    });
});
```

### 모니터링 및 로깅

```javascript
// 사용자 행동 추적 (Google Analytics 예시)
function trackNavigation(appName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'navigation_click', {
            'app_name': appName,
            'platform': getMobileOS(),
            'venue': CONFIG.VENUE.name
        });
    }

    // 또는 콘솔 로깅 (개발 환경)
    console.log(`[Navigation] ${appName} clicked on ${getMobileOS()}`);
}

// 사용
function openKakaoNaviWithTracking() {
    trackNavigation('kakao');
    navManager.openKakaoNavi();
}
```

### 에러 리포팅

```javascript
function reportError(error, context) {
    // 에러 로깅
    console.error('[Navigation Error]', context, error);

    // 프로덕션 환경에서 에러 리포팅 서비스 사용
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(error, {
            tags: {
                context: context,
                os: getMobileOS()
            }
        });
    }

    // 사용자에게 친화적인 메시지 표시
    alert('일시적인 오류가 발생했습니다. 다시 시도해주세요.');
}

// 사용 예시
try {
    navManager.openKakaoNavi();
} catch (error) {
    reportError(error, 'kakao_navi_open');
}
```

---

## API Reference

### Kakao Navi

#### `Kakao.init(apiKey: string): void`

Kakao SDK를 초기화합니다.

**Parameters:**
- `apiKey` (string): Kakao Developers에서 발급받은 JavaScript 키

**Example:**
```javascript
Kakao.init('a1b2c3d4e5f6g7h8i9j0');
```

---

#### `Kakao.isInitialized(): boolean`

SDK가 초기화되었는지 확인합니다.

**Returns:** `true` if initialized, `false` otherwise

**Example:**
```javascript
if (!Kakao.isInitialized()) {
    Kakao.init('a1b2c3d4e5f6g7h8i9j0');
}
```

---

#### `Kakao.Navi.start(options, callbacks): void`

카카오내비 앱을 실행합니다.

**Parameters:**

- `options` (object):
  - `name` (string): 목적지 이름
  - `x` (number): 목적지 경도 (longitude)
  - `y` (number): 목적지 위도 (latitude)
  - `coordType` ('wgs84' | 'katec'): 좌표계 타입

- `callbacks` (object, optional):
  - `success` (function): 성공 콜백
  - `fail` (function): 실패 콜백

**Example:**
```javascript
Kakao.Navi.start({
    name: '더 라움 강남',
    x: 127.0396597,
    y: 37.5012743,
    coordType: 'wgs84'
}, {
    success: () => console.log('Success'),
    fail: (error) => console.error('Error:', error)
});
```

---

### T Map URL Scheme

#### URL Format

```
tmap://route?goalname=[목적지명]&goalx=[경도]&goaly=[위도]
```

**Parameters:**
- `goalname` (string): 목적지 이름 (URL encoded)
- `goalx` (number): 목적지 경도 (WGS84)
- `goaly` (number): 목적지 위도 (WGS84)

**Example:**
```javascript
const url = `tmap://route?goalname=${encodeURIComponent('더 라움 강남')}&goalx=127.0396597&goaly=37.5012743`;
window.location.href = url;
```

---

#### Android Intent URL Format

```
intent://route?goalname=[목적지명]&goalx=[경도]&goaly=[위도]#Intent;scheme=tmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.skt.tmap.ku;S.browser_fallback_url=[fallback_url];end
```

**Parameters:**
- `goalname`, `goalx`, `goaly`: 위와 동일
- `package`: `com.skt.tmap.ku` (고정)
- `S.browser_fallback_url`: 앱 미설치 시 이동할 URL (URL encoded)

---

### Naver Map URL Scheme

#### URL Format

```
nmap://route/[routeType]?dlat=[위도]&dlng=[경도]&dname=[목적지명]&appname=[앱식별자]
```

**Parameters:**
- `routeType` ('car' | 'walk' | 'bicycle' | 'public'): 경로 타입
- `dlat` (number): 목적지 위도 (WGS84)
- `dlng` (number): 목적지 경도 (WGS84)
- `dname` (string): 목적지 이름 (URL encoded)
- `appname` (string): 앱 식별자 (필수)

**Optional Parameters:**
- `slat` (number): 출발지 위도
- `slng` (number): 출발지 경도
- `sname` (string): 출발지 이름

**Example:**
```javascript
const url = `nmap://route/car?dlat=37.5012743&dlng=127.0396597&dname=${encodeURIComponent('더 라움 강남')}&appname=com.yourcompany.wedding`;
window.location.href = url;
```

---

### Utility Functions

#### `getMobileOS(): 'Android' | 'iOS' | 'unknown'`

현재 디바이스의 OS를 감지합니다.

**Returns:** OS 타입

**Example:**
```javascript
const os = getMobileOS();
if (os === 'Android') {
    // Android 전용 로직
}
```

---

#### `encodeURIComponent(str: string): string`

URL에 안전한 문자열로 인코딩합니다.

**Parameters:**
- `str` (string): 인코딩할 문자열

**Returns:** 인코딩된 문자열

**Example:**
```javascript
const encoded = encodeURIComponent('더 라움 강남');
// '%EB%8D%94%20%EB%9D%BC%EC%9B%80%20%EA%B0%95%EB%82%A8'
```

---

## Troubleshooting

### 카카오내비

#### 문제: "Kakao is not defined" 에러

**원인**: Kakao SDK가 로드되기 전에 코드가 실행됨

**해결방법**:
```javascript
// 방법 1: SDK 로드 후 초기화
window.addEventListener('load', () => {
    if (typeof Kakao !== 'undefined') {
        Kakao.init('YOUR_KEY');
    }
});

// 방법 2: 폴링 방식
function initKakaoWhenReady() {
    if (typeof Kakao !== 'undefined') {
        Kakao.init('YOUR_KEY');
    } else {
        setTimeout(initKakaoWhenReady, 100);
    }
}
initKakaoWhenReady();
```

---

#### 문제: "Invalid API key" 에러

**원인**: 잘못된 API 키 또는 도메인 미등록

**해결방법**:
1. Kakao Developers에서 JavaScript 키 확인
2. 플랫폼에 도메인 등록 확인 (https://developers.kakao.com)
3. 로컬 테스트 시 `http://localhost`도 등록 필요

---

#### 문제: 앱이 실행되지 않음

**원인**: 카카오내비 앱이 설치되어 있지 않음

**해결방법**:
```javascript
Kakao.Navi.start({
    // options
}, {
    fail: (error) => {
        if (confirm('카카오내비 앱이 필요합니다. 다운로드하시겠습니까?')) {
            window.location.href = 'https://kakaonavi.kakao.com/launch/index.do';
        }
    }
});
```

---

### 티맵

#### 문제: Android에서 앱이 실행되지 않음

**원인**: URL Scheme 대신 Intent URL 사용 필요

**해결방법**:
```javascript
// ❌ Android에서 동작 불안정
window.location.href = 'tmap://route?goalname=...';

// ✅ Intent URL 사용
const intentUrl = `intent://route?goalname=...#Intent;scheme=tmap;package=com.skt.tmap.ku;end`;
window.location.href = intentUrl;
```

---

#### 문제: iOS에서 앱스토어로 자동 이동 안 됨

**원인**: Fallback 타이밍 문제

**해결방법**:
```javascript
window.location.href = 'tmap://route?...';

// Timeout 값 조정 (1000ms ~ 2000ms)
setTimeout(() => {
    window.location.href = 'https://apps.apple.com/app/id431589174';
}, 1500);
```

---

#### 문제: 목적지가 정확히 전달되지 않음

**원인**: 한글 인코딩 문제

**해결방법**:
```javascript
// ❌ 인코딩하지 않음
const url = `tmap://route?goalname=더 라움 강남&...`;

// ✅ encodeURIComponent 사용
const url = `tmap://route?goalname=${encodeURIComponent('더 라움 강남')}&...`;
```

---

### 네이버지도

#### 문제: "appname is required" 에러

**원인**: appname 파라미터 누락

**해결방법**:
```javascript
// ❌ appname 누락
const url = `nmap://route/car?dlat=37.5&dlng=127.0&dname=장소`;

// ✅ appname 포함
const url = `nmap://route/car?dlat=37.5&dlng=127.0&dname=장소&appname=com.yourcompany.wedding`;
```

---

#### 문제: 경로 타입이 적용되지 않음

**원인**: 잘못된 routeType 값

**해결방법**:
```javascript
// 허용된 값: 'car', 'walk', 'bicycle', 'public'
const validRouteTypes = ['car', 'walk', 'bicycle', 'public'];

function openNaverMap(routeType = 'car') {
    if (!validRouteTypes.includes(routeType)) {
        console.warn(`Invalid route type: ${routeType}, using 'car' instead`);
        routeType = 'car';
    }

    const url = `nmap://route/${routeType}?...`;
    window.location.href = url;
}
```

---

#### 문제: Android에서 더 안정적으로 동작시키고 싶음

**원인**: Intent URL 미사용

**해결방법**:
```javascript
function openNaverMapAndroid() {
    const intentUrl =
        `intent://route/car?dlat=37.5&dlng=127.0&dname=장소&appname=com.app` +
        `#Intent;scheme=nmap;package=com.nhn.android.nmap;` +
        `S.browser_fallback_url=${encodeURIComponent('https://play.google.com/...')};end`;

    window.location.href = intentUrl;
}
```

---

### 공통 문제

#### 문제: 카카오톡 인앱 브라우저에서 동작하지 않음

**원인**: 인앱 브라우저의 URL Scheme 제한

**해결방법**:
```javascript
// 카카오톡 인앱 브라우저 감지
function isKakaoTalkBrowser() {
    return /KAKAOTALK/i.test(navigator.userAgent);
}

if (isKakaoTalkBrowser()) {
    // 외부 브라우저로 열기 유도
    alert('외부 브라우저에서 열어주세요.\n우측 상단 메뉴 > 외부 브라우저에서 열기');
} else {
    // 정상 동작
    openNavigation();
}
```

---

#### 문제: PC에서 접속 시 에러

**원인**: 모바일 앱이 PC에 설치되어 있지 않음

**해결방법**:
```javascript
if (!isMobile()) {
    alert('모바일 기기에서만 이용 가능합니다.');
    return;
}

function isMobile() {
    const os = getMobileOS();
    return os === 'Android' || os === 'iOS';
}
```

---

#### 문제: HTTPS가 아닌 HTTP에서 동작하지 않음

**원인**: 최신 브라우저의 보안 정책

**해결방법**:
```bash
# GitHub Pages는 자동으로 HTTPS 제공
# 커스텀 도메인 사용 시 SSL 인증서 설정

# Let's Encrypt 무료 SSL 인증서
sudo certbot --nginx -d yourdomain.com
```

---

#### 문제: 좌표가 정확하지 않음

**원인**: 좌표계 혼동 (WGS84 vs KATEC)

**해결방법**:
```javascript
// 대부분의 경우 WGS84 사용 (GPS 좌표)
// Google Maps, Naver Maps API에서 제공하는 좌표는 WGS84

// 카카오맵에서 좌표 확인:
// https://map.kakao.com/ > 장소 검색 > 주소 복사 > 좌표 확인

const coords = {
    latitude: 37.5012743,   // WGS84 위도
    longitude: 127.0396597  // WGS84 경도
};
```

---

## Examples

### 예제 1: 최소 구성 (Vanilla JS)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>네비게이션 연동</title>
    <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"></script>
    <style>
        .nav-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 300px;
            margin: 20px auto;
        }
        button {
            padding: 15px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
        .kakao { background: #FEE500; color: #000; }
        .tmap { background: #1E88E5; color: #fff; }
        .naver { background: #03C75A; color: #fff; }
    </style>
</head>
<body>
    <div class="nav-buttons">
        <button class="kakao" onclick="openKakaoNavi()">카카오내비</button>
        <button class="tmap" onclick="openTMap()">티맵</button>
        <button class="naver" onclick="openNaverMap()">네이버지도</button>
    </div>

    <script>
        // 설정
        const CONFIG = {
            KAKAO_KEY: 'YOUR_JAVASCRIPT_KEY',
            VENUE: {
                name: '더 라움 강남',
                lat: 37.5012743,
                lng: 127.0396597
            }
        };

        // Kakao SDK 초기화
        Kakao.init(CONFIG.KAKAO_KEY);

        // 카카오내비
        function openKakaoNavi() {
            Kakao.Navi.start({
                name: CONFIG.VENUE.name,
                x: CONFIG.VENUE.lng,
                y: CONFIG.VENUE.lat,
                coordType: 'wgs84'
            });
        }

        // 티맵
        function openTMap() {
            const url = `tmap://route?goalname=${encodeURIComponent(CONFIG.VENUE.name)}&goalx=${CONFIG.VENUE.lng}&goaly=${CONFIG.VENUE.lat}`;
            window.location.href = url;
        }

        // 네이버지도
        function openNaverMap() {
            const url = `nmap://route/car?dlat=${CONFIG.VENUE.lat}&dlng=${CONFIG.VENUE.lng}&dname=${encodeURIComponent(CONFIG.VENUE.name)}&appname=com.wedding.invitation`;
            window.location.href = url;
        }

        // OS 감지
        function getMobileOS() {
            const ua = navigator.userAgent;
            if (/android/i.test(ua)) return "Android";
            if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
            return "unknown";
        }
    </script>
</body>
</html>
```

---

### 예제 2: 프로덕션 레벨 (Fallback 포함)

**파일 구조**:
```
wedding-invitation/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── navigation.js
│   └── utils.js
└── README.md
```

**index.html**:
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>홍길동♥김영희 결혼합니다</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js" defer></script>
</head>
<body>
    <main>
        <section class="location">
            <h2>오시는 길</h2>
            <p class="venue-name">더 라움 강남</p>
            <p class="address">서울시 강남구 테헤란로 123</p>

            <div class="map" id="map"></div>

            <div class="navigation-buttons">
                <button class="nav-btn kakao" data-app="kakao">
                    <span class="icon">🗺️</span>
                    카카오내비
                </button>
                <button class="nav-btn tmap" data-app="tmap">
                    <span class="icon">🚗</span>
                    티맵
                </button>
                <button class="nav-btn naver" data-app="naver">
                    <span class="icon">🧭</span>
                    네이버지도
                </button>
            </div>
        </section>
    </main>

    <script src="js/config.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/navigation.js"></script>
</body>
</html>
```

**js/config.js**:
```javascript
const CONFIG = {
    KAKAO_JAVASCRIPT_KEY: 'YOUR_JAVASCRIPT_KEY',
    NAVER_APP_NAME: 'com.yourcompany.wedding',

    VENUE: {
        name: '더 라움 강남',
        address: '서울시 강남구 테헤란로 123',
        latitude: 37.5012743,
        longitude: 127.0396597
    },

    APP_STORES: {
        kakao: {
            download: 'https://kakaonavi.kakao.com/launch/index.do'
        },
        tmap: {
            android: 'https://play.google.com/store/apps/details?id=com.skt.tmap.ku',
            ios: 'https://apps.apple.com/app/id431589174'
        },
        naver: {
            android: 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap',
            ios: 'https://apps.apple.com/app/id311867728'
        }
    },

    FALLBACK_TIMEOUT: 1500
};
```

**js/utils.js**:
```javascript
/**
 * 유틸리티 함수 모음
 */
const Utils = {
    /**
     * 모바일 OS 감지
     */
    getMobileOS() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    },

    /**
     * 모바일 기기 여부 확인
     */
    isMobile() {
        const os = this.getMobileOS();
        return os === "Android" || os === "iOS";
    },

    /**
     * Android 여부 확인
     */
    isAndroid() {
        return this.getMobileOS() === "Android";
    },

    /**
     * iOS 여부 확인
     */
    isIOS() {
        return this.getMobileOS() === "iOS";
    },

    /**
     * 카카오톡 인앱 브라우저 확인
     */
    isKakaoTalkBrowser() {
        return /KAKAOTALK/i.test(navigator.userAgent);
    },

    /**
     * 네이버 앱 인앱 브라우저 확인
     */
    isNaverBrowser() {
        return /NAVER/i.test(navigator.userAgent);
    },

    /**
     * 로그 출력 (개발 환경에서만)
     */
    log(...args) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('[Navigation]', ...args);
        }
    },

    /**
     * 에러 로그
     */
    error(...args) {
        console.error('[Navigation Error]', ...args);
    }
};
```

**js/navigation.js**:
```javascript
/**
 * 네비게이션 매니저
 */
class NavigationManager {
    constructor() {
        this.config = CONFIG;
        this.initKakaoSDK();
        this.attachEventListeners();
    }

    /**
     * Kakao SDK 초기화
     */
    initKakaoSDK() {
        if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
            Kakao.init(this.config.KAKAO_JAVASCRIPT_KEY);
            Utils.log('Kakao SDK initialized');
        } else if (typeof Kakao === 'undefined') {
            Utils.error('Kakao SDK not loaded');
        }
    }

    /**
     * 이벤트 리스너 등록
     */
    attachEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                this.openApp(app);
            });
        });
    }

    /**
     * 앱 열기 (라우터)
     */
    openApp(appName) {
        if (!Utils.isMobile()) {
            alert('모바일 기기에서만 사용 가능합니다.');
            return;
        }

        Utils.log(`Opening ${appName}`);

        switch(appName) {
            case 'kakao':
                this.openKakaoNavi();
                break;
            case 'tmap':
                this.openTMap();
                break;
            case 'naver':
                this.openNaverMap();
                break;
            default:
                Utils.error('Unknown app:', appName);
        }
    }

    /**
     * 카카오내비 열기
     */
    openKakaoNavi() {
        if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
            alert('카카오내비를 실행할 수 없습니다.');
            return;
        }

        const { name, longitude, latitude } = this.config.VENUE;

        Kakao.Navi.start({
            name: name,
            x: longitude,
            y: latitude,
            coordType: 'wgs84'
        }, {
            fail: (error) => {
                Utils.error('Kakao Navi failed:', error);
                this.showAppInstallPrompt('kakao');
            }
        });
    }

    /**
     * 티맵 열기
     */
    openTMap() {
        if (Utils.isAndroid()) {
            this.openTMapAndroid();
        } else {
            this.openTMapIOS();
        }
    }

    /**
     * 티맵 열기 (Android)
     */
    openTMapAndroid() {
        const { name, longitude, latitude } = this.config.VENUE;

        const intentUrl =
            `intent://route` +
            `?goalname=${encodeURIComponent(name)}` +
            `&goalx=${longitude}` +
            `&goaly=${latitude}` +
            `#Intent;` +
            `scheme=tmap;` +
            `action=android.intent.action.VIEW;` +
            `category=android.intent.category.BROWSABLE;` +
            `package=com.skt.tmap.ku;` +
            `S.browser_fallback_url=${encodeURIComponent(this.config.APP_STORES.tmap.android)};` +
            `end`;

        window.location.href = intentUrl;
    }

    /**
     * 티맵 열기 (iOS)
     */
    openTMapIOS() {
        const { name, longitude, latitude } = this.config.VENUE;
        const tmapUrl = `tmap://route?goalname=${encodeURIComponent(name)}&goalx=${longitude}&goaly=${latitude}`;

        window.location.href = tmapUrl;

        setTimeout(() => {
            this.showAppInstallPrompt('tmap');
        }, this.config.FALLBACK_TIMEOUT);
    }

    /**
     * 네이버지도 열기
     */
    openNaverMap() {
        if (Utils.isAndroid()) {
            this.openNaverMapAndroid();
        } else {
            this.openNaverMapCommon();
        }
    }

    /**
     * 네이버지도 열기 (Android)
     */
    openNaverMapAndroid() {
        const { name, latitude, longitude } = this.config.VENUE;

        const intentUrl =
            `intent://route/car` +
            `?dlat=${latitude}` +
            `&dlng=${longitude}` +
            `&dname=${encodeURIComponent(name)}` +
            `&appname=${this.config.NAVER_APP_NAME}` +
            `#Intent;` +
            `scheme=nmap;` +
            `action=android.intent.action.VIEW;` +
            `category=android.intent.category.BROWSABLE;` +
            `package=com.nhn.android.nmap;` +
            `S.browser_fallback_url=${encodeURIComponent(this.config.APP_STORES.naver.android)};` +
            `end`;

        window.location.href = intentUrl;
    }

    /**
     * 네이버지도 열기 (iOS 및 기타)
     */
    openNaverMapCommon() {
        const { name, latitude, longitude } = this.config.VENUE;

        const naverUrl =
            `nmap://route/car` +
            `?dlat=${latitude}` +
            `&dlng=${longitude}` +
            `&dname=${encodeURIComponent(name)}` +
            `&appname=${this.config.NAVER_APP_NAME}`;

        window.location.href = naverUrl;

        setTimeout(() => {
            this.showAppInstallPrompt('naver');
        }, this.config.FALLBACK_TIMEOUT);
    }

    /**
     * 앱 설치 프롬프트 표시
     */
    showAppInstallPrompt(appName) {
        const appNames = {
            kakao: '카카오내비',
            tmap: '티맵',
            naver: '네이버지도'
        };

        const message = `${appNames[appName]} 앱이 필요합니다.\n다운로드 페이지로 이동하시겠습니까?`;

        if (confirm(message)) {
            this.goToAppStore(appName);
        }
    }

    /**
     * 앱스토어로 이동
     */
    goToAppStore(appName) {
        const stores = this.config.APP_STORES[appName];
        let url;

        if (appName === 'kakao') {
            url = stores.download;
        } else {
            url = Utils.isAndroid() ? stores.android : stores.ios;
        }

        if (url) {
            window.location.href = url;
        }
    }
}

// 초기화
let navManager;

window.addEventListener('load', () => {
    navManager = new NavigationManager();
    Utils.log('Navigation Manager initialized');
});
```

---

### 예제 3: React 컴포넌트

```jsx
// NavigationButtons.jsx
import React, { useEffect, useState } from 'react';

const NavigationButtons = ({ venue }) => {
    const [os, setOs] = useState('unknown');

    useEffect(() => {
        // Kakao SDK 초기화
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.REACT_APP_KAKAO_KEY);
        }

        // OS 감지
        const userAgent = navigator.userAgent;
        if (/android/i.test(userAgent)) {
            setOs('Android');
        } else if (/iPad|iPhone|iPod/.test(userAgent)) {
            setOs('iOS');
        }
    }, []);

    const openKakaoNavi = () => {
        if (!window.Kakao || !window.Kakao.isInitialized()) {
            alert('카카오내비를 실행할 수 없습니다.');
            return;
        }

        window.Kakao.Navi.start({
            name: venue.name,
            x: venue.longitude,
            y: venue.latitude,
            coordType: 'wgs84'
        }, {
            fail: (error) => {
                console.error('Kakao Navi Error:', error);
                if (window.confirm('카카오내비 앱이 필요합니다. 다운로드하시겠습니까?')) {
                    window.location.href = 'https://kakaonavi.kakao.com/launch/index.do';
                }
            }
        });
    };

    const openTMap = () => {
        if (os === 'Android') {
            const intentUrl =
                `intent://route?goalname=${encodeURIComponent(venue.name)}&goalx=${venue.longitude}&goaly=${venue.latitude}` +
                `#Intent;scheme=tmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;` +
                `package=com.skt.tmap.ku;S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.skt.tmap.ku')};end`;
            window.location.href = intentUrl;
        } else {
            const tmapUrl = `tmap://route?goalname=${encodeURIComponent(venue.name)}&goalx=${venue.longitude}&goaly=${venue.latitude}`;
            window.location.href = tmapUrl;

            setTimeout(() => {
                if (window.confirm('티맵 앱이 필요합니다. 앱스토어로 이동하시겠습니까?')) {
                    window.location.href = 'https://apps.apple.com/app/id431589174';
                }
            }, 1500);
        }
    };

    const openNaverMap = () => {
        const naverUrl =
            `nmap://route/car?dlat=${venue.latitude}&dlng=${venue.longitude}&dname=${encodeURIComponent(venue.name)}` +
            `&appname=${process.env.REACT_APP_NAVER_APP_NAME}`;

        window.location.href = naverUrl;

        setTimeout(() => {
            const storeUrl = os === 'Android'
                ? 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap'
                : 'https://apps.apple.com/app/id311867728';

            if (window.confirm('네이버지도 앱이 필요합니다. 다운로드하시겠습니까?')) {
                window.location.href = storeUrl;
            }
        }, 1500);
    };

    return (
        <div className="navigation-buttons">
            <button onClick={openKakaoNavi} className="nav-btn kakao">
                카카오내비
            </button>
            <button onClick={openTMap} className="nav-btn tmap">
                티맵
            </button>
            <button onClick={openNaverMap} className="nav-btn naver">
                네이버지도
            </button>
        </div>
    );
};

export default NavigationButtons;

// 사용 예시
/*
<NavigationButtons
    venue={{
        name: '더 라움 강남',
        latitude: 37.5012743,
        longitude: 127.0396597
    }}
/>
*/
```

---

## GitHub Pages 배포

**결론**: GitHub Pages를 사용하면 무료로 HTTPS 정적 사이트 호스팅이 가능합니다.

### 단계별 배포 가이드

1. **저장소 생성**
   ```bash
   # GitHub에서 새 저장소 생성
   # 예: username/wedding-invitation

   # 로컬 프로젝트 초기화
   cd wedding-invitation
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/wedding-invitation.git
   git push -u origin main
   ```

2. **GitHub Pages 설정**
   ```
   저장소 > Settings > Pages
   Source: Deploy from a branch
   Branch: main / (root)
   Save
   ```

3. **배포 완료**
   - URL: `https://username.github.io/wedding-invitation/`
   - 자동 HTTPS 적용
   - 변경 시 자동 재배포

4. **커스텀 도메인 (선택)**
   ```
   Settings > Pages > Custom domain
   도메인 입력 (예: wedding.yourdomain.com)

   DNS 설정:
   CNAME: wedding -> username.github.io
   ```

---

## 참고 자료

### 공식 문서

- **Kakao Navi**: https://developers.kakao.com/docs/latest/ko/kakaonavi/js
- **Kakao SDK Download**: https://developers.kakao.com/docs/latest/ko/javascript/download
- **Naver Map URL Scheme**: https://guide.ncloud-docs.com/docs/maps-url-scheme
- **T Map**: 공식 문서 없음 (커뮤니티 기반)

### 관련 기술

- **GitHub Pages**: https://pages.github.com/
- **URL Scheme**: https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app
- **Android Intent**: https://developer.android.com/guide/components/intents-filters

---

## License

이 문서는 MIT License 하에 배포됩니다.

---

**작성일**: 2025-01-20
**버전**: 1.0.0
**작성자**: Technical Writer for Mobile Wedding Invitation
