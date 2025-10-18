/**
 * Guestbook API Client
 *
 * Google Apps Script Webhook 연동 모듈
 *
 * @module utils/guestbook
 * @author Wedding Dev Team
 * @version 1.0.0
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Webhook URL (환경 변수에서 로드)
 */
const WEBHOOK_URL = process.env.PUBLIC_RSVP_WEBHOOK_URL ||
                    import.meta?.env?.PUBLIC_RSVP_WEBHOOK_URL ||
                    '';

/**
 * 페이지네이션 설정
 */
const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100
};

/**
 * 캐시 설정
 */
const CACHE = {
  KEY: 'guestbook_cache',
  TTL_MS: 5 * 60 * 1000  // 5분
};

// ============================================================================
// TYPE DEFINITIONS (JSDoc)
// ============================================================================

/**
 * @typedef {Object} GuestbookFormData
 * @property {string} name - 작성자 이름
 * @property {string} message - 방명록 메시지
 * @property {string} password - 수정/삭제용 비밀번호
 */

/**
 * @typedef {Object} GuestbookEntry
 * @property {string} id - 고유 ID
 * @property {string} name - 작성자 이름
 * @property {string} message - 메시지
 * @property {string} timestamp - 작성 시각 (ISO 8601)
 */

/**
 * @typedef {Object} GuestbookResponse
 * @property {boolean} success - 성공 여부
 * @property {GuestbookEntry[]} [data] - 방명록 데이터
 * @property {number} [total] - 전체 항목 수
 * @property {number} [limit] - 페이지 크기
 * @property {number} [offset] - 시작 위치
 * @property {string} [message] - 성공 메시지
 * @property {string} [id] - 생성된 항목 ID
 * @property {string} [error] - 에러 메시지
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - 유효성 검사 통과 여부
 * @property {Object.<string, string>} errors - 필드별 에러 메시지
 */

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * 방명록 폼 데이터 유효성 검사
 *
 * @param {GuestbookFormData} formData - 폼 데이터
 * @returns {ValidationResult} 유효성 검사 결과
 *
 * @example
 * const result = validateGuestbookForm({
 *   name: '김철수',
 *   message: '결혼을 축하합니다!',
 *   password: '1234'
 * });
 */
export function validateGuestbookForm(formData) {
  const errors = {};

  // 이름 검증
  if (!formData.name?.trim()) {
    errors.name = '이름을 입력해주세요.';
  } else if (formData.name.length < 2) {
    errors.name = '이름은 2자 이상 입력해주세요.';
  } else if (formData.name.length > 50) {
    errors.name = '이름은 50자 이하로 입력해주세요.';
  } else if (!/^[가-힣a-zA-Z\s]+$/.test(formData.name)) {
    errors.name = '이름은 한글 또는 영문만 가능합니다.';
  }

  // 메시지 검증
  if (!formData.message?.trim()) {
    errors.message = '메시지를 입력해주세요.';
  } else if (formData.message.length < 5) {
    errors.message = '메시지는 5자 이상 입력해주세요.';
  } else if (formData.message.length > 500) {
    errors.message = '메시지는 500자 이하로 입력해주세요.';
  }

  // 비밀번호 검증
  if (!formData.password?.trim()) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (formData.password.length < 4) {
    errors.password = '비밀번호는 4자 이상 입력해주세요.';
  } else if (formData.password.length > 20) {
    errors.password = '비밀번호는 20자 이하로 입력해주세요.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// ============================================================================
// CACHE
// ============================================================================

/**
 * 캐시된 방명록 데이터 가져오기
 *
 * @returns {GuestbookEntry[]|null} 캐시된 데이터 또는 null
 * @private
 */
function getCachedGuestbook() {
  try {
    const cached = localStorage.getItem(CACHE.KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);

    // TTL 체크
    if (Date.now() - timestamp > CACHE.TTL_MS) {
      localStorage.removeItem(CACHE.KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('[Cache Error]', error);
    return null;
  }
}

/**
 * 방명록 데이터 캐싱
 *
 * @param {GuestbookEntry[]} data - 방명록 데이터
 * @private
 */
function setCachedGuestbook(data) {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE.KEY, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('[Cache Error]', error);
  }
}

/**
 * 캐시 무효화
 *
 * @example
 * clearGuestbookCache();
 */
export function clearGuestbookCache() {
  localStorage.removeItem(CACHE.KEY);
}

// ============================================================================
// API CALLS
// ============================================================================

/**
 * 방명록 제출
 *
 * @param {GuestbookFormData} formData - 방명록 폼 데이터
 * @returns {Promise<GuestbookResponse>} 제출 결과
 * @throws {Error} API 오류
 *
 * @example
 * try {
 *   const response = await submitGuestbook({
 *     name: '김철수',
 *     message: '결혼을 축하합니다! 💐',
 *     password: '1234'
 *   });
 *
 *   if (response.success) {
 *     alert('방명록이 등록되었습니다!');
 *     clearGuestbookCache(); // 캐시 무효화
 *   }
 * } catch (error) {
 *   alert(error.message);
 * }
 */
export async function submitGuestbook(formData) {
  // 환경 변수 체크
  if (!WEBHOOK_URL) {
    throw new Error('Guestbook Webhook URL이 설정되지 않았습니다.');
  }

  // 유효성 검사
  const validation = validateGuestbookForm(formData);
  if (!validation.isValid) {
    const errorMessages = Object.values(validation.errors).join('\n');
    throw new Error(errorMessages);
  }

  try {
    // API 요청
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submitGuestbook',
        data: formData
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '방명록 등록에 실패했습니다.');
    }

    // 캐시 무효화
    clearGuestbookCache();

    return result;

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }
    throw error;
  }
}

/**
 * 방명록 조회 (페이지네이션)
 *
 * @param {number} [limit=50] - 페이지 크기
 * @param {number} [offset=0] - 시작 위치
 * @param {boolean} [useCache=true] - 캐시 사용 여부
 * @returns {Promise<GuestbookResponse>} 방명록 데이터
 * @throws {Error} API 오류
 *
 * @example
 * // 첫 페이지 (50개)
 * const page1 = await getGuestbook(50, 0);
 *
 * // 두 번째 페이지
 * const page2 = await getGuestbook(50, 50);
 *
 * // 캐시 없이 최신 데이터
 * const fresh = await getGuestbook(50, 0, false);
 */
export async function getGuestbook(
  limit = PAGINATION.DEFAULT_PAGE_SIZE,
  offset = 0,
  useCache = true
) {
  if (!WEBHOOK_URL) {
    throw new Error('Guestbook Webhook URL이 설정되지 않았습니다.');
  }

  // 첫 페이지 캐시 확인
  if (useCache && offset === 0) {
    const cached = getCachedGuestbook();
    if (cached) {
      return {
        success: true,
        data: cached.slice(0, limit),
        total: cached.length,
        limit,
        offset
      };
    }
  }

  try {
    // URL 파라미터 생성
    const url = new URL(WEBHOOK_URL);
    url.searchParams.append('action', 'getGuestbook');
    url.searchParams.append('limit', Math.min(limit, PAGINATION.MAX_PAGE_SIZE));
    url.searchParams.append('offset', offset);

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '방명록 조회에 실패했습니다.');
    }

    // 첫 페이지는 캐싱
    if (offset === 0) {
      setCachedGuestbook(result.data);
    }

    return result;

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }
    throw error;
  }
}

/**
 * 모든 방명록 조회 (무한 스크롤용)
 *
 * @param {Function} [onProgress] - 진행률 콜백
 * @returns {Promise<GuestbookEntry[]>} 전체 방명록 데이터
 *
 * @example
 * const allEntries = await getAllGuestbook((loaded, total) => {
 *   console.log(`${loaded}/${total} loaded...`);
 * });
 */
export async function getAllGuestbook(onProgress = null) {
  const allEntries = [];
  let offset = 0;
  let total = 0;

  do {
    const result = await getGuestbook(PAGINATION.MAX_PAGE_SIZE, offset, false);

    allEntries.push(...result.data);
    total = result.total;
    offset += result.data.length;

    if (onProgress) {
      onProgress(allEntries.length, total);
    }

    // 더 이상 데이터가 없으면 종료
    if (result.data.length === 0 || allEntries.length >= total) {
      break;
    }

  } while (true);

  return allEntries;
}

// ============================================================================
// UI HELPERS
// ============================================================================

/**
 * 방명록 항목 렌더링 (HTML 생성)
 *
 * @param {GuestbookEntry} entry - 방명록 항목
 * @returns {string} HTML 문자열
 *
 * @example
 * const html = renderGuestbookEntry(entry);
 * container.innerHTML += html;
 */
export function renderGuestbookEntry(entry) {
  const date = new Date(entry.timestamp).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <div class="guestbook-entry" data-id="${entry.id}">
      <div class="entry-header">
        <span class="entry-name">${escapeHtml(entry.name)}</span>
        <span class="entry-date">${date}</span>
      </div>
      <div class="entry-message">
        ${escapeHtml(entry.message)}
      </div>
    </div>
  `;
}

/**
 * 방명록 리스트 렌더링
 *
 * @param {GuestbookEntry[]} entries - 방명록 항목 배열
 * @param {HTMLElement} container - 컨테이너 엘리먼트
 *
 * @example
 * const entries = await getGuestbook();
 * const container = document.getElementById('guestbookList');
 * renderGuestbookList(entries.data, container);
 */
export function renderGuestbookList(entries, container) {
  container.innerHTML = entries.map(renderGuestbookEntry).join('');
}

/**
 * HTML 이스케이프 (XSS 방지)
 *
 * @param {string} text - 원본 텍스트
 * @returns {string} 이스케이프된 텍스트
 * @private
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 폼 데이터 초기화
 *
 * @param {HTMLFormElement} form - 폼 엘리먼트
 *
 * @example
 * resetGuestbookForm(form);
 */
export function resetGuestbookForm(form) {
  form.reset();
}

/**
 * 에러 메시지 표시
 *
 * @param {Object.<string, string>} errors - 필드별 에러 메시지
 * @param {HTMLFormElement} form - 폼 엘리먼트
 */
export function displayGuestbookErrors(errors, form) {
  // 기존 에러 메시지 제거
  form.querySelectorAll('.error-message').forEach(el => el.remove());

  // 새 에러 메시지 추가
  Object.entries(errors).forEach(([fieldName, errorMessage]) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.style.color = 'red';
    errorEl.style.fontSize = '0.9rem';
    errorEl.style.marginTop = '0.25rem';
    errorEl.textContent = errorMessage;

    field.parentElement.appendChild(errorEl);
    field.style.borderColor = 'red';
  });
}

/**
 * 에러 메시지 초기화
 *
 * @param {HTMLFormElement} form - 폼 엘리먼트
 */
export function clearGuestbookErrors(form) {
  form.querySelectorAll('.error-message').forEach(el => el.remove());
  form.querySelectorAll('input, textarea').forEach(el => {
    el.style.borderColor = '';
  });
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  validateGuestbookForm,
  clearGuestbookCache,
  submitGuestbook,
  getGuestbook,
  getAllGuestbook,
  renderGuestbookEntry,
  renderGuestbookList,
  resetGuestbookForm,
  displayGuestbookErrors,
  clearGuestbookErrors
};
