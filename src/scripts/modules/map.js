/**
 * Map functionality
 */

import { KAKAO_API_KEY, VENUE } from './config.js';

/**
 * Load Kakao Maps API
 */
export function loadKakaoMapScript() {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;

    script.onload = () => {
      console.log('✅ Kakao Maps API loaded');
      kakao.maps.load(resolve);
    };

    script.onerror = () => reject(new Error('Failed to load Kakao Maps'));
    document.head.appendChild(script);
  });
}

/**
 * Initialize Kakao Map
 */
export function initKakaoMap() {
  const { kakao } = window;
  if (!kakao?.maps) {
    console.error('⚠️ Kakao Maps not available');
    return;
  }

  const container = document.getElementById('kakao-map');
  if (!container) return;

  const map = new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 7,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
  });

  map.setZoomable(false);

  // Search by keyword
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(VENUE.keyword, (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const place = data[0];
      const coords = new kakao.maps.LatLng(place.y, place.x);

      map.setCenter(coords);
      new kakao.maps.Marker({ map, position: coords });

      console.log('✅ Map initialized:', place.place_name);
    } else {
      fallbackAddressSearch(map);
    }
  });
}

/**
 * Fallback: Address search
 */
function fallbackAddressSearch(map) {
  const { kakao } = window;
  const geocoder = new kakao.maps.services.Geocoder();

  geocoder.addressSearch(VENUE.address, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      map.setCenter(coords);
      new kakao.maps.Marker({ map, position: coords });
      console.log('✅ Fallback address search successful');
    } else {
      console.error('❌ Both searches failed');
    }
  });
}

/**
 * Try to open mobile app with web fallback
 */
function tryOpenApp(scheme, webUrl) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = scheme;
    setTimeout(() => {
      if (!document.hidden && !document.webkitHidden) {
        window.location.href = webUrl;
      }
    }, 1500);
  } else {
    window.open(webUrl, '_blank');
  }
}

/**
 * Navigation app openers
 */
export function openKakaoMap() {
  const url = 'https://map.kakao.com/?urlX=507877.9999999988&urlY=1106363.0000000016&urlLevel=3&itemId=10660163&q=%EC%97%98%ED%83%80%EC%9B%8C&map_type=TYPE_MAP';
  window.open(url, '_blank');
}

export function openNaverMap() {
  const scheme = `nmap://place?lat=${VENUE.latitude}&lng=${VENUE.longitude}&name=${encodeURIComponent('엘타워')}&appname=com.wedding.invitation`;
  tryOpenApp(scheme, 'https://naver.me/GOPeWn3P');
}

export function openTmap() {
  const scheme = `tmap://?rGoName=${encodeURIComponent('엘타워 주차장')}&rGoX=${VENUE.longitude}&rGoY=${VENUE.latitude}`;
  tryOpenApp(scheme, 'https://www.tmap.co.kr');
}

export function openKakaoNavi() {
  const scheme = `kakaonavi://navigate?name=${encodeURIComponent('엘타워')}&x=${VENUE.longitude}&y=${VENUE.latitude}&coord_type=wgs84`;
  tryOpenApp(scheme, 'https://kakaonavi.kakao.com/');
}
