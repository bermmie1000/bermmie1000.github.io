/**
 * Main JavaScript for wedding invitation
 * Handles RSVP form, smooth scrolling, animations, and map integration
 */

// Wedding venue location - 엘타워 7층 그랜드홀
const VENUE_LOCATION = {
  name: '엘타워 7층 그랜드홀',
  address: '서울 서초구 강남대로 213 엘타워',
  keyword: '엘타워', // 카카오맵 검색 키워드
  latitude: 37.4827711,
  longitude: 127.034966,
  kakaoPlaceId: '10660163', // 카카오맵 Place ID
};

/**
 * Load Kakao Maps API dynamically
 */
function loadKakaoMapScript() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window.kakao !== 'undefined' && window.kakao.maps) {
      resolve();
      return;
    }

    // Create script element (with services library for geocoding)
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=a37c725b11400c9f5bfea1a5aa64bf79&autoload=false&libraries=services';

    script.onload = () => {
      console.log('✅ Kakao Maps API script loaded');
      // Wait for kakao.maps to be ready
      kakao.maps.load(() => {
        console.log('✅ Kakao Maps SDK initialized');
        resolve();
      });
    };

    script.onerror = () => {
      console.error('❌ Failed to load Kakao Maps API script');
      reject(new Error('Failed to load Kakao Maps API'));
    };

    document.head.appendChild(script);
  });
}

/**
 * Initialize the application when DOM is ready
 */
async function init() {
  // Load Kakao Maps API then initialize map
  try {
    await loadKakaoMapScript();
    initKakaoMap();
  } catch (error) {
    console.error('Failed to initialize Kakao Map:', error);
  }

  logWelcomeMessage();
}

/**
 * Initialize Kakao Map with keyword search
 */
function initKakaoMap() {
  const kakao = window.kakao;

  if (!kakao || !kakao.maps) {
    console.error('⚠️ Kakao Maps API not available');
    return;
  }

  const container = document.getElementById('kakao-map');
  if (!container) {
    console.warn('⚠️ Map container not found');
    return;
  }

  // 지도 생성 (기본 위치: 서울)
  const map = new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 7,
  });

  // 장소 검색 객체 생성
  const ps = new kakao.maps.services.Places();

  // 키워드로 장소 검색
  ps.keywordSearch(VENUE_LOCATION.keyword, function (data, status) {
    if (status === kakao.maps.services.Status.OK) {
      // 첫 번째 검색 결과 사용
      const place = data[0];
      const coords = new kakao.maps.LatLng(place.y, place.x);

      // 지도 중심 이동
      map.setCenter(coords);

      // 마커 생성
      const marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      });

      console.log('✅ Kakao Map initialized with keyword:', VENUE_LOCATION.keyword);
      console.log('📍 Found place:', place.place_name);
      console.log('📍 Address:', place.address_name);
      console.log('📍 Coordinates:', place.y, place.x);
    } else {
      console.error('❌ Failed to find place with keyword:', VENUE_LOCATION.keyword);
      console.log('Status:', status);

      // 검색 실패 시 fallback: 주소로 재검색
      fallbackAddressSearch(map);
    }
  });
}

/**
 * Fallback: Address search if keyword search fails
 */
function fallbackAddressSearch(map) {
  const kakao = window.kakao;
  const geocoder = new kakao.maps.services.Geocoder();

  console.log('🔄 Trying fallback address search...');

  geocoder.addressSearch(VENUE_LOCATION.address, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      map.setCenter(coords);

      const marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      });

      console.log('✅ Fallback address search successful');
      console.log('📍 Coordinates:', result[0].y, result[0].x);
    } else {
      console.error('❌ Both keyword and address search failed');
    }
  });
}


/**
 * Log welcome message to console (developer Easter egg)
 */
function logWelcomeMessage() {
  console.log(
    '%c💒 Wedding Invitation',
    'font-size: 20px; color: #8b7355; font-weight: bold;'
  );
  console.log(
    '%cMade with ❤️ by Developer',
    'font-size: 12px; color: #6a6a6a;'
  );
}

/**
 * Copy address to clipboard
 */
function copyAddress() {
  const address = VENUE_LOCATION.address;

  // Modern clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        alert('📋 주소가 복사되었습니다!\n\n' + address);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        fallbackCopyAddress(address);
      });
  } else {
    fallbackCopyAddress(address);
  }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyAddress(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    alert('📋 주소가 복사되었습니다!\n\n' + text);
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('주소 복사에 실패했습니다.\n\n주소: ' + text);
  }

  document.body.removeChild(textarea);
}

/**
 * Open Kakao Map app (mobile deeplink)
 */
function openKakaoMap() {
  // Direct link to the venue on Kakao Map
  const kakaoUrl = 'https://map.kakao.com/?urlX=507877.9999999988&urlY=1106363.0000000016&urlLevel=3&itemId=10660163&q=%EC%97%98%ED%83%80%EC%9B%8C&map_type=TYPE_MAP';

  window.open(kakaoUrl, '_blank');
}

/**
 * Open Naver Map app (mobile deeplink)
 */
function openNaverMap() {
  const { latitude, longitude } = VENUE_LOCATION;
  const placeName = '엘타워';

  // Naver Map app scheme - direct to app
  const naverScheme = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(placeName)}&appname=com.wedding.invitation`;

  // Web fallback URL
  const naverWeb = 'https://naver.me/GOPeWn3P';

  // Try to open app, fallback to web
  tryOpenApp(naverScheme, naverWeb);
}

/**
 * Open Tmap app (mobile deeplink)
 */
function openTmap() {
  const destinationName = '엘타워 주차장';
  const { latitude, longitude } = VENUE_LOCATION;

  // Tmap URL Scheme (목적지 설정 - 엘타워 주차장)
  const tmapScheme = `tmap://?rGoName=${encodeURIComponent(
    destinationName
  )}&rGoX=${longitude}&rGoY=${latitude}`;

  // Web fallback: 티맵은 공식 웹 서비스가 없으므로 모바일 앱 다운로드 페이지로 연결
  const tmapWeb = `https://www.tmap.co.kr`;

  // Try to open app, fallback to web
  tryOpenApp(tmapScheme, tmapWeb);
}

/**
 * Try to open mobile app, fallback to web URL
 * @param {string} scheme - App URL scheme
 * @param {string} webUrl - Fallback web URL
 */
function tryOpenApp(scheme, webUrl) {
  // Mobile detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // Try to open app
    window.location.href = scheme;

    // Fallback to web after timeout
    setTimeout(() => {
      const isAppOpened = document.hidden || document.webkitHidden;
      if (!isAppOpened) {
        window.location.href = webUrl;
      }
    }, 1500);
  } else {
    // Desktop: open web URL directly
    window.open(webUrl, '_blank');
  }
}

// Expose functions to global scope for inline onclick handlers
window.copyAddress = copyAddress;
window.openKakaoMap = openKakaoMap;
window.openNaverMap = openNaverMap;
window.openTmap = openTmap;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
