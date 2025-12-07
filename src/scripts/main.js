/**
 * Main JavaScript for wedding invitation
 * Handles RSVP form, smooth scrolling, animations, and map integration
 */

// ==================== Constants ====================
const KAKAO_API_KEY = 'a37c725b11400c9f5bfea1a5aa64bf79';

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
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;

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
  // Fix hero height to prevent resize on mobile
  fixHeroHeight();

  // Initialize Kakao SDK for sharing
  initKakaoSDK();

  // Load Kakao Maps API then initialize map
  try {
    await loadKakaoMapScript();
    initKakaoMap();
  } catch (error) {
    console.error('Failed to initialize Kakao Map:', error);
  }

  // Initialize D-day counter
  initDdayCounter();

  // Initialize carousel gallery
  initCarousel();

  logWelcomeMessage();
}

/**
 * Fix hero section height to prevent resize when address bar hides
 * Uses !important to override any CSS rules
 */
function fixHeroHeight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Set fixed height based on initial viewport
  const initialHeight = window.innerHeight;

  // Use cssText with !important to ensure it overrides CSS
  hero.style.cssText += `height: ${initialHeight}px !important; min-height: ${initialHeight}px !important;`;

  console.log('✅ Hero height fixed to', initialHeight, 'px');
}

/**
 * Calculate and display D-day counter
 */
function initDdayCounter() {
  const weddingDate = new Date('2026-05-23T11:30:00');
  const today = new Date();

  // Reset time to midnight for accurate day calculation
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const weddingMidnight = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate());

  const diffTime = weddingMidnight - todayMidnight;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const ddayElement = document.getElementById('dday-count');
  if (ddayElement) {
    ddayElement.textContent = diffDays;
  }
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
    Kakao.init(KAKAO_API_KEY);
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
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
  });

  // 줌 컨트롤 비활성화
  map.setZoomable(false);

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

// ==================== Clipboard Utilities ====================

/**
 * Universal clipboard copy function
 * @param {string} text - Text to copy
 * @param {Object} options - Optional settings
 * @param {string} options.successMessage - Alert message on success
 * @param {HTMLElement} options.iconElement - Icon element to change on success
 * @param {string} options.successIcon - Icon src on success
 * @param {string} options.defaultIcon - Icon src to revert to
 */
async function copyToClipboard(text, options = {}) {
  const { successMessage, iconElement, successIcon, defaultIcon } = options;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      fallbackCopy(text);
    }

    // Handle success
    if (iconElement && successIcon && defaultIcon) {
      iconElement.src = successIcon;
      setTimeout(() => {
        iconElement.src = defaultIcon;
      }, 2000);
    } else if (successMessage) {
      alert(successMessage + '\n\n' + text);
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('복사에 실패했습니다.\n\n' + text);
  }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Copy address to clipboard
 */
function copyAddress() {
  copyToClipboard(VENUE_LOCATION.address, {
    successMessage: '📋 주소가 복사되었습니다!'
  });
}

/**
 * Copy address with icon feedback
 */
function copyAddressWithIcon() {
  const icon = document.getElementById('copyAddressIcon');
  copyToClipboard(VENUE_LOCATION.address, {
    iconElement: icon,
    successIcon: '/images/read.png',
    defaultIcon: '/images/copy.png'
  });
}

/**
 * Copy account number to clipboard
 */
function copyAccount(accountInfo) {
  copyToClipboard(accountInfo, {
    successMessage: '💰 계좌번호가 복사되었습니다!'
  });
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

// ==================== Modal Utilities ====================

/**
 * Open a modal by ID
 * @param {string} modalId - Modal element ID
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close a modal by ID
 * @param {string} modalId - Modal element ID
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Open contact modal
 */
function openContactModal() {
  openModal('contactModal');
}

/**
 * Close contact modal
 */
function closeContactModal() {
  closeModal('contactModal');
}

/**
 * Open gift modal (account numbers)
 * @param {string} side - 'groom' or 'bride'
 */
function openGiftModal(side) {
  const modal = document.getElementById('giftModal');
  if (!modal) return;

  // Toggle sections visibility
  const groomSection = modal.querySelector('.contact-section:nth-of-type(1)');
  const brideSection = modal.querySelector('.contact-section:nth-of-type(2)');

  groomSection.style.display = side === 'groom' ? 'block' : 'none';
  brideSection.style.display = side === 'bride' ? 'block' : 'none';

  openModal('giftModal');
}

/**
 * Close gift modal
 */
function closeGiftModal() {
  closeModal('giftModal');
}

/**
 * Carousel Gallery functionality (CSS Scroll Snap based)
 */
let carouselTrack = null;
let carouselSlides = [];

/**
 * Initialize carousel with CSS Scroll Snap
 */
function initCarousel() {
  carouselTrack = document.getElementById('carouselTrack');
  if (!carouselTrack) return;

  carouselSlides = carouselTrack.querySelectorAll('.carousel-slide');
  if (carouselSlides.length === 0) return;

  // Create indicators
  const indicatorsContainer = document.getElementById('carouselIndicators');
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = '';
    carouselSlides.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
      indicator.onclick = () => goToSlide(index);
      indicatorsContainer.appendChild(indicator);
    });
  }

  // Listen for scroll to update indicators
  carouselTrack.addEventListener('scroll', handleScroll, { passive: true });

  // Prevent vertical scroll while swiping horizontally
  initCarouselTouchHandler();

  console.log('✅ Carousel initialized with CSS Scroll Snap,', carouselSlides.length, 'slides');
}

/**
 * Prevent vertical scroll during horizontal swipe on carousel
 * This fixes jittering in KakaoTalk in-app browser
 */
function initCarouselTouchHandler() {
  let startX = 0;
  let startY = 0;
  let directionDecided = false;
  let isHorizontalSwipe = false;

  carouselTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    directionDecided = false;
    isHorizontalSwipe = false;
  }, { passive: true });

  carouselTrack.addEventListener('touchmove', (e) => {
    if (!startX || !startY) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    // Determine swipe direction once (on first significant move)
    if (!directionDecided && (diffX > 10 || diffY > 10)) {
      directionDecided = true;
      isHorizontalSwipe = diffX > diffY;
    }

    // If horizontal swipe, prevent vertical scroll but allow horizontal
    if (directionDecided && isHorizontalSwipe && diffY > 0) {
      e.preventDefault();
    }
  }, { passive: false });

  carouselTrack.addEventListener('touchend', () => {
    startX = 0;
    startY = 0;
    directionDecided = false;
    isHorizontalSwipe = false;
  }, { passive: true });
}

/**
 * Handle scroll event to update indicators
 */
function handleScroll() {
  const scrollLeft = carouselTrack.scrollLeft;
  const slideWidth = carouselTrack.offsetWidth;
  const currentIndex = Math.round(scrollLeft / slideWidth);

  // Update indicators
  const indicators = document.querySelectorAll('.carousel-indicator');
  indicators.forEach((ind, i) => {
    ind.classList.toggle('active', i === currentIndex);
  });
}

/**
 * Go to specific slide
 */
function goToSlide(index) {
  const slideWidth = carouselTrack.offsetWidth;
  carouselTrack.scrollTo({
    left: index * slideWidth,
    behavior: 'smooth'
  });
}

/**
 * Toggle background music play/pause
 */
function toggleMusic() {
  const audio = document.getElementById('bgm');
  const button = document.getElementById('musicToggle');
  const icon = button.querySelector('.music-icon');

  if (audio.paused) {
    audio.play().then(() => {
      button.classList.add('playing');
      icon.src = '/images/volume.png';
    }).catch(err => {
      console.error('Failed to play audio:', err);
    });
  } else {
    audio.pause();
    button.classList.remove('playing');
    icon.src = '/images/mute.png';
  }
}

// Expose functions to global scope for inline onclick handlers
window.toggleMusic = toggleMusic;
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
