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

// Wedding information for sharing
const WEDDING_INFO = {
  bride: '박하영',
  groom: '천창범',
  date: '2026년 5월 23일 토요일 오전 11시 30분',
  venue: '엘타워 7층 그랜드홀',
  address: '서울 서초구 강남대로 213 엘타워',
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
  // Initialize Kakao SDK for sharing
  initKakaoSDK();

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
 * Initialize Kakao SDK for sharing functionality
 */
function initKakaoSDK() {
  // Check if Kakao SDK is loaded
  if (typeof Kakao === 'undefined') {
    console.error('⚠️ Kakao SDK not loaded');
    return;
  }

  // Initialize with JavaScript key (same key used for Maps)
  if (!Kakao.isInitialized()) {
    Kakao.init('a37c725b11400c9f5bfea1a5aa64bf79');
    console.log('✅ Kakao SDK initialized for sharing');
  }
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
 * Copy address to clipboard (legacy - button version)
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
 * Copy address with icon feedback (icon changes to checkmark)
 */
function copyAddressWithIcon() {
  const address = VENUE_LOCATION.address;
  const icon = document.getElementById('copyAddressIcon');

  // Modern clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        // Change icon to checkmark
        icon.src = '/images/read.png';

        // Revert back to copy icon after 2 seconds
        setTimeout(() => {
          icon.src = '/images/copy.png';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        fallbackCopyAddressWithIcon(address, icon);
      });
  } else {
    fallbackCopyAddressWithIcon(address, icon);
  }
}

/**
 * Fallback copy method with icon for older browsers
 */
function fallbackCopyAddressWithIcon(text, icon) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    // Change icon to checkmark
    icon.src = '/images/read.png';

    // Revert back to copy icon after 2 seconds
    setTimeout(() => {
      icon.src = '/images/copy.png';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('주소 복사에 실패했습니다.\n\n주소: ' + text);
  }

  document.body.removeChild(textarea);
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
 * Copy account number to clipboard
 */
function copyAccount(accountInfo) {
  // Modern clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(accountInfo)
      .then(() => {
        alert('💰 계좌번호가 복사되었습니다!\n\n' + accountInfo);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        fallbackCopyAccount(accountInfo);
      });
  } else {
    fallbackCopyAccount(accountInfo);
  }
}

/**
 * Fallback copy method for account numbers
 */
function fallbackCopyAccount(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    alert('💰 계좌번호가 복사되었습니다!\n\n' + text);
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('계좌번호 복사에 실패했습니다.\n\n계좌: ' + text);
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
 * Open Kakao Navi app (mobile deeplink)
 */
function openKakaoNavi() {
  const { latitude, longitude } = VENUE_LOCATION;
  const destinationName = '엘타워';

  // Kakao Navi URL Scheme (목적지 설정)
  const kakaoNaviScheme = `kakaonavi://navigate?name=${encodeURIComponent(
    destinationName
  )}&x=${longitude}&y=${latitude}&coord_type=wgs84`;

  // Web fallback: Kakao Navi 웹 페이지
  const kakaoNaviWeb = 'https://kakaonavi.kakao.com/';

  // Try to open app, fallback to web
  tryOpenApp(kakaoNaviScheme, kakaoNaviWeb);
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

/**
 * Share wedding invitation to KakaoTalk
 */
function shareKakao() {
  // Check if Kakao SDK is initialized
  if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
    alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    console.error('⚠️ Kakao SDK not initialized');
    return;
  }

  // Get current page URL for sharing
  const currentUrl = window.location.href;

  // Get base URL for image (works for both localhost and GitHub Pages)
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/index\.html$/, '');
  const imageUrl = `${baseUrl}/images/main_temp.jpg`;

  // Share using feed template
  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${WEDDING_INFO.groom} ♥ ${WEDDING_INFO.bride}`,
      description: `2026.05.23(토) 11:30\n양재 엘타워 7층 그랜드홀`,
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: currentUrl,
        webUrl: currentUrl,
      },
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: {
          mobileWebUrl: currentUrl,
          webUrl: currentUrl,
        },
      },
    ],
  });

  console.log('✅ Kakao share triggered');
  console.log('📷 Image URL:', imageUrl);
}

/**
 * Open contact modal
 */
function openContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

/**
 * Close contact modal
 */
function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

/**
 * Open gift modal (account numbers)
 * @param {string} side - 'groom' or 'bride'
 */
function openGiftModal(side) {
  const modal = document.getElementById('giftModal');
  if (!modal) return;

  // Hide all sections first
  const groomSection = modal.querySelector('.contact-section:nth-of-type(1)');
  const brideSection = modal.querySelector('.contact-section:nth-of-type(2)');

  if (side === 'groom') {
    groomSection.style.display = 'block';
    brideSection.style.display = 'none';
  } else if (side === 'bride') {
    groomSection.style.display = 'none';
    brideSection.style.display = 'block';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close gift modal
 */
function closeGiftModal() {
  const modal = document.getElementById('giftModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Gallery functionality
 */
const GALLERY_IMAGES = [
  '/images/main_temp.jpg',
  '/images/main_temp.jpg',
  '/images/main_temp.jpg',
  '/images/main_temp.jpg',
  '/images/main_temp.jpg',
  '/images/main_temp.jpg',
  '/images/main_temp.jpg',
  '/images/main_temp.jpg',
  '/images/main_temp.jpg',
];

let currentImageIndex = 0;

/**
 * Update gallery counter and navigation buttons
 */
function updateGalleryCounter() {
  const counter = document.getElementById('galleryCounter');
  if (counter) {
    counter.textContent = `${currentImageIndex + 1} / ${GALLERY_IMAGES.length}`;
  }

  // Update navigation button states
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');

  if (prevBtn) {
    if (currentImageIndex === 0) {
      prevBtn.classList.add('disabled');
    } else {
      prevBtn.classList.remove('disabled');
    }
  }

  if (nextBtn) {
    if (currentImageIndex === GALLERY_IMAGES.length - 1) {
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.classList.remove('disabled');
    }
  }
}

/**
 * Open gallery modal with specific image
 */
function openGallery(index) {
  currentImageIndex = index;
  const modal = document.getElementById('galleryModal');
  const img = document.getElementById('galleryImage');

  if (modal && img) {
    img.src = GALLERY_IMAGES[currentImageIndex];
    updateGalleryCounter();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close gallery modal
 */
function closeGallery() {
  const modal = document.getElementById('galleryModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Show previous image
 */
function previousImage() {
  // Don't go before first image
  if (currentImageIndex === 0) {
    return;
  }

  currentImageIndex = currentImageIndex - 1;
  const img = document.getElementById('galleryImage');
  if (img) {
    img.src = GALLERY_IMAGES[currentImageIndex];
    updateGalleryCounter();
  }
}

/**
 * Show next image
 */
function nextImage() {
  // Don't go past last image
  if (currentImageIndex === GALLERY_IMAGES.length - 1) {
    return;
  }

  currentImageIndex = currentImageIndex + 1;
  const img = document.getElementById('galleryImage');
  if (img) {
    img.src = GALLERY_IMAGES[currentImageIndex];
    updateGalleryCounter();
  }
}

// Expose functions to global scope for inline onclick handlers
window.copyAddress = copyAddress;
window.copyAddressWithIcon = copyAddressWithIcon;
window.copyAccount = copyAccount;
window.openKakaoMap = openKakaoMap;
window.openNaverMap = openNaverMap;
window.openTmap = openTmap;
window.openKakaoNavi = openKakaoNavi;
window.shareKakao = shareKakao;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.openGiftModal = openGiftModal;
window.closeGiftModal = closeGiftModal;
window.openGallery = openGallery;
window.closeGallery = closeGallery;
window.previousImage = previousImage;
window.nextImage = nextImage;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
