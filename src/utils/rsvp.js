/**
 * RSVP API Client
 *
 * Google Apps Script Webhook 연동 모듈
 *
 * @module utils/rsvp
 * @author Wedding Dev Team
 * @version 1.0.0
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Webhook URL (환경 변수에서 로드)
 * GitHub Pages 배포 시 자동으로 주입됨
 */
const WEBHOOK_URL = process.env.PUBLIC_RSVP_WEBHOOK_URL ||
                    import.meta?.env?.PUBLIC_RSVP_WEBHOOK_URL ||
                    '';

/**
 * Rate limiting 설정
 */
const RATE_LIMIT = {
  SUBMISSION_KEY: 'rsvp_last_submit',
  COOLDOWN_HOURS: 24
};

// ============================================================================
// TYPE DEFINITIONS (JSDoc)
// ============================================================================

/**
 * @typedef {Object} RsvpFormData
 * @property {string} name - 참석자 이름
 * @property {'yes'|'no'} attendance - 참석 여부
 * @property {number} [guests] - 동반 인원 (참석 시 필수)
 * @property {string} [phone] - 전화번호
 * @property {string} [message] - 축하 메시지
 */

/**
 * @typedef {Object} RsvpResponse
 * @property {boolean} success - 성공 여부
 * @property {string} [message] - 성공 메시지
 * @property {string} [timestamp] - 제출 시각
 * @property {number} [rowNumber] - 저장된 행 번호
 * @property {string} [error] - 에러 메시지
 * @property {string} [code] - 에러 코드
 */

/**
 * @typedef {Object} RsvpStats
 * @property {number} totalSubmissions - 총 제출 건수
 * @property {number} attending - 참석 인원
 * @property {number} notAttending - 불참 인원
 * @property {number} totalGuests - 총 동반 인원
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
 * RSVP 폼 데이터 유효성 검사
 *
 * @param {RsvpFormData} formData - 폼 데이터
 * @returns {ValidationResult} 유효성 검사 결과
 *
 * @example
 * const result = validateRsvpForm({
 *   name: '홍길동',
 *   attendance: 'yes',
 *   guests: 2
 * });
 *
 * if (result.isValid) {
 *   // 제출
 * } else {
 *   console.error(result.errors);
 * }
 */
export function validateRsvpForm(formData) {
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

  // 참석 여부 검증
  if (!formData.attendance) {
    errors.attendance = '참석 여부를 선택해주세요.';
  } else if (!['yes', 'no'].includes(formData.attendance)) {
    errors.attendance = '참석 여부는 yes 또는 no만 가능합니다.';
  }

  // 동반 인원 검증 (참석 시)
  if (formData.attendance === 'yes') {
    const guests = parseInt(formData.guests, 10);
    if (isNaN(guests)) {
      errors.guests = '동반 인원을 입력해주세요.';
    } else if (guests < 1) {
      errors.guests = '최소 1명 이상이어야 합니다.';
    } else if (guests > 10) {
      errors.guests = '최대 10명까지 가능합니다.';
    }
  }

  // 전화번호 검증 (선택 사항)
  if (formData.phone) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
    }
  }

  // 메시지 길이 검증 (선택 사항)
  if (formData.message && formData.message.length > 500) {
    errors.message = '메시지는 500자 이하로 입력해주세요.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * 제출 가능 여부 확인 (Rate Limiting)
 *
 * @returns {boolean} 제출 가능 여부
 *
 * @example
 * if (canSubmitRsvp()) {
 *   await submitRsvp(formData);
 * } else {
 *   const remaining = getRemainingCooldown();
 *   alert(`${remaining}시간 후에 다시 시도해주세요.`);
 * }
 */
export function canSubmitRsvp() {
  const lastSubmit = localStorage.getItem(RATE_LIMIT.SUBMISSION_KEY);

  if (!lastSubmit) return true;

  const hoursSince = (Date.now() - parseInt(lastSubmit)) / (1000 * 60 * 60);
  return hoursSince >= RATE_LIMIT.COOLDOWN_HOURS;
}

/**
 * 제출 완료 표시 (localStorage)
 *
 * @private
 */
function markSubmitted() {
  localStorage.setItem(RATE_LIMIT.SUBMISSION_KEY, Date.now().toString());
}

/**
 * 남은 쿨다운 시간 계산
 *
 * @returns {number} 남은 시간 (시간 단위)
 *
 * @example
 * const remaining = getRemainingCooldown();
 * if (remaining > 0) {
 *   alert(`${remaining.toFixed(1)}시간 후에 다시 시도해주세요.`);
 * }
 */
export function getRemainingCooldown() {
  const lastSubmit = localStorage.getItem(RATE_LIMIT.SUBMISSION_KEY);
  if (!lastSubmit) return 0;

  const hoursSince = (Date.now() - parseInt(lastSubmit)) / (1000 * 60 * 60);
  return Math.max(0, RATE_LIMIT.COOLDOWN_HOURS - hoursSince);
}

/**
 * 제출 기록 초기화 (개발/테스트용)
 *
 * @example
 * resetRateLimitRsvp();
 */
export function resetRateLimitRsvp() {
  localStorage.removeItem(RATE_LIMIT.SUBMISSION_KEY);
}

// ============================================================================
// API CALLS
// ============================================================================

/**
 * RSVP 제출
 *
 * @param {RsvpFormData} formData - RSVP 폼 데이터
 * @returns {Promise<RsvpResponse>} 제출 결과
 * @throws {Error} API 오류 또는 네트워크 오류
 *
 * @example
 * try {
 *   const response = await submitRsvp({
 *     name: '홍길동',
 *     attendance: 'yes',
 *     guests: 2,
 *     phone: '010-1234-5678',
 *     message: '축하합니다!'
 *   });
 *
 *   if (response.success) {
 *     alert('참석 여부가 전송되었습니다!');
 *   }
 * } catch (error) {
 *   alert(error.message);
 * }
 */
export async function submitRsvp(formData) {
  // 환경 변수 체크
  if (!WEBHOOK_URL) {
    throw new Error('RSVP Webhook URL이 설정되지 않았습니다.');
  }

  // Rate limiting 체크
  if (!canSubmitRsvp()) {
    const remaining = getRemainingCooldown();
    throw new Error(
      `${remaining.toFixed(1)}시간 후에 다시 시도해주세요.`
    );
  }

  // 유효성 검사
  const validation = validateRsvpForm(formData);
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
        action: 'submitRsvp',
        data: formData
      }),
    });

    // 응답 파싱
    const result = await response.json();

    // 에러 처리
    if (!result.success) {
      throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
    }

    // 성공 시 제출 기록
    markSubmitted();

    return result;

  } catch (error) {
    // 네트워크 에러
    if (error instanceof TypeError) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }

    // API 에러
    throw error;
  }
}

/**
 * RSVP 통계 조회
 *
 * @returns {Promise<RsvpStats>} 통계 데이터
 * @throws {Error} API 오류
 *
 * @example
 * try {
 *   const stats = await getRsvpStats();
 *   console.log(`총 참석: ${stats.attending}명`);
 *   console.log(`총 동반: ${stats.totalGuests}명`);
 * } catch (error) {
 *   console.error('통계 조회 실패:', error);
 * }
 */
export async function getRsvpStats() {
  if (!WEBHOOK_URL) {
    throw new Error('RSVP Webhook URL이 설정되지 않았습니다.');
  }

  try {
    const url = new URL(WEBHOOK_URL);
    url.searchParams.append('action', 'getRsvpStats');

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '통계 조회에 실패했습니다.');
    }

    return result.stats;

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }
    throw error;
  }
}

// ============================================================================
// UTILITY
// ============================================================================

/**
 * 폼 데이터 초기화
 *
 * @param {HTMLFormElement} form - 폼 엘리먼트
 *
 * @example
 * const form = document.getElementById('rsvpForm');
 * resetRsvpForm(form);
 */
export function resetRsvpForm(form) {
  form.reset();
}

/**
 * 에러 메시지 표시
 *
 * @param {Object.<string, string>} errors - 필드별 에러 메시지
 * @param {HTMLFormElement} form - 폼 엘리먼트
 *
 * @example
 * const validation = validateRsvpForm(formData);
 * if (!validation.isValid) {
 *   displayRsvpErrors(validation.errors, form);
 * }
 */
export function displayRsvpErrors(errors, form) {
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
 *
 * @example
 * clearRsvpErrors(form);
 */
export function clearRsvpErrors(form) {
  form.querySelectorAll('.error-message').forEach(el => el.remove());
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.style.borderColor = '';
  });
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  validateRsvpForm,
  canSubmitRsvp,
  getRemainingCooldown,
  resetRateLimitRsvp,
  submitRsvp,
  getRsvpStats,
  resetRsvpForm,
  displayRsvpErrors,
  clearRsvpErrors
};
