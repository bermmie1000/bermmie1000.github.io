/**
 * Sharing functionality
 */

import { KAKAO_API_KEY, WEDDING } from './config.js';

/**
 * Initialize Kakao SDK
 */
export function initKakaoSDK() {
  if (typeof Kakao === 'undefined') {
    console.error('⚠️ Kakao SDK not loaded');
    return;
  }

  if (!Kakao.isInitialized()) {
    Kakao.init(KAKAO_API_KEY);
    console.log('✅ Kakao SDK initialized');
  }
}

/**
 * Share via KakaoTalk
 */
export function shareKakao() {
  if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
    alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    return;
  }

  const currentUrl = window.location.href;
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/index\.html$/, '');
  const imageUrl = `${baseUrl}/images/main_temp.jpg`;

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${WEDDING.groom} ♥ ${WEDDING.bride}`,
      description: `2026.05.23(토) 11:30\n양재 엘타워 7층 그랜드홀`,
      imageUrl,
      link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
      },
    ],
  });

  console.log('✅ Kakao share triggered');
}
