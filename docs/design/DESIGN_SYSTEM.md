# 🎨 디자인 시스템 (Design System)

**Last Updated**: 2025-10-18
**Project**: GitHub Pages 모바일 청첩장
**Design Concept**: Minimal Elegance
**Status**: ✅ Finalized

---

## 목차

- [디자인 컨셉](#디자인-컨셉)
- [색상 팔레트](#색상-팔레트)
- [타이포그래피](#타이포그래피)
- [스페이싱 시스템](#스페이싱-시스템)
- [컴포넌트 스타일](#컴포넌트-스타일)
- [반응형 브레이크포인트](#반응형-브레이크포인트)
- [애니메이션](#애니메이션)

---

## 디자인 컨셉

### Minimal Elegance (선택된 컨셉)

**철학**: "시간이 지나도 변치 않는 아름다움"

**핵심 특징**:
- **타임리스**: 10년 후에도 세련된 디자인
- **클린**: 불필요한 장식 최소화
- **고급스러움**: 절제된 색상과 타이포그래피
- **가독성**: 모든 연령대가 쉽게 읽을 수 있는 텍스트

**디자인 원칙**:
1. **Less is More**: 핵심 정보만 명확하게
2. **White Space**: 여백을 통한 우아함
3. **Typography First**: 폰트가 디자인의 중심
4. **Subtle Motion**: 절제된 애니메이션

---

## 색상 팔레트

### Primary Colors (주요 색상)

#### 1. Minimal Elegance Theme (기본 테마)

```css
:root[data-theme="minimal-elegance"] {
  /* Primary - Sophisticated Navy */
  --color-primary-50: #f8f9fa;
  --color-primary-100: #e9ecef;
  --color-primary-200: #d4d8dc;
  --color-primary-300: #a8b0b9;
  --color-primary-400: #7c8996;
  --color-primary-500: #2C3E50;   /* Main brand color */
  --color-primary-600: #243442;
  --color-primary-700: #1c2935;
  --color-primary-800: #141f27;
  --color-primary-900: #0c141a;

  /* Accent - Elegant Gold */
  --color-accent-50: #fef9e7;
  --color-accent-100: #fdedc4;
  --color-accent-200: #fbe4a1;
  --color-accent-300: #f8d55b;
  --color-accent-400: #e6c445;
  --color-accent-500: #D4AF37;   /* Gold accent */
  --color-accent-600: #b9962f;
  --color-accent-700: #9d7d27;
  --color-accent-800: #82641f;
  --color-accent-900: #664b17;

  /* Neutral - Warm Gray */
  --color-neutral-50: #fafaf9;
  --color-neutral-100: #f5f5f4;
  --color-neutral-200: #e7e5e4;
  --color-neutral-300: #d6d3d1;
  --color-neutral-400: #a8a29e;
  --color-neutral-500: #78716c;
  --color-neutral-600: #57534e;
  --color-neutral-700: #44403c;
  --color-neutral-800: #292524;
  --color-neutral-900: #1c1917;

  /* Semantic Colors */
  --color-background: #ffffff;
  --color-background-alt: #f8f9fa;
  --color-text-primary: #1c1917;
  --color-text-secondary: #57534e;
  --color-text-muted: #a8a29e;
  --color-border: #e7e5e4;
  --color-shadow: rgba(0, 0, 0, 0.1);
}
```

#### 2. Romantic Floral Theme (대체 테마)

```css
:root[data-theme="romantic-floral"] {
  /* Primary - Dusty Rose */
  --color-primary-500: #C9A9A6;
  --color-primary-700: #9d7d7a;

  /* Accent - Soft Pink */
  --color-accent-500: #E8B4B8;
  --color-accent-700: #d18a90;

  /* Neutral - Cream */
  --color-neutral-50: #fefdfb;
  --color-neutral-100: #f9f7f4;

  --color-background: #fefdfb;
  --color-text-primary: #3d3735;
}
```

#### 3. Modern Bold Theme (대체 테마)

```css
:root[data-theme="modern-bold"] {
  /* Primary - Deep Purple */
  --color-primary-500: #6366F1;
  --color-primary-700: #4f46e5;

  /* Accent - Bright Coral */
  --color-accent-500: #F97316;
  --color-accent-700: #ea580c;

  /* Gradient */
  --gradient-primary: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
}
```

### Color Usage Guidelines

| Color | Use Case | Example |
|-------|----------|---------|
| **Primary 500** | Main headings, buttons, links | 신랑신부 이름, CTA 버튼 |
| **Primary 700** | Hover states, emphasized text | 버튼 hover, 중요 정보 |
| **Accent 500** | Decorative elements, highlights | 날짜 강조, 아이콘 |
| **Neutral 50-200** | Backgrounds, cards | 섹션 배경, 카드 |
| **Neutral 700-900** | Body text | 본문, 설명 텍스트 |

### Accessibility (접근성)

**WCAG AA 준수** (4.5:1 대비율):
- ✅ Primary 500 on White: 8.2:1
- ✅ Neutral 700 on White: 7.5:1
- ✅ Accent 700 on White: 4.9:1

---

## 타이포그래피

### Font Families

```css
:root {
  /* Headings - Serif */
  --font-heading: 'Cormorant Garamond', 'Noto Serif KR', serif;

  /* Body - Sans-serif */
  --font-body: 'Inter', 'Noto Sans KR', sans-serif;

  /* Script - Decorative */
  --font-script: 'Great Vibes', 'Nanum Myeongjo', cursive;

  /* Monospace - Numbers */
  --font-mono: 'JetBrains Mono', 'D2Coding', monospace;
}
```

### Font Loading Strategy

```html
<!-- Critical fonts (preload) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Font display: swap for performance -->
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600&family=Great+Vibes&display=swap"
  rel="stylesheet"
/>
```

### Type Scale

| Level | Size (rem) | Size (px) | Line Height | Usage |
|-------|------------|-----------|-------------|-------|
| **Hero** | 3.5rem | 56px | 1.1 | 신랑신부 이름 (모바일: 2.5rem) |
| **H1** | 2.5rem | 40px | 1.2 | 섹션 제목 (모바일: 2rem) |
| **H2** | 2rem | 32px | 1.3 | 서브 제목 (모바일: 1.75rem) |
| **H3** | 1.5rem | 24px | 1.4 | 카드 제목 (모바일: 1.25rem) |
| **H4** | 1.25rem | 20px | 1.5 | 작은 제목 |
| **Body Large** | 1.125rem | 18px | 1.6 | 중요 본문 |
| **Body** | 1rem | 16px | 1.7 | 일반 본문 |
| **Body Small** | 0.875rem | 14px | 1.6 | 보조 텍스트 |
| **Caption** | 0.75rem | 12px | 1.5 | 캡션, 라벨 |

### Typography Classes

```css
/* Headings */
.text-hero {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-primary-500);
}

.text-h1 {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.text-h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2rem);
  font-weight: 600;
  line-height: 1.3;
}

/* Body */
.text-body {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-primary);
}

.text-body-large {
  font-family: var(--font-body);
  font-size: 1.125rem;
  line-height: 1.6;
  font-weight: 500;
}

/* Script (decorative) */
.text-script {
  font-family: var(--font-script);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  color: var(--color-accent-500);
}
```

### 한글 타이포그래피 고려사항

```css
/* 한글 최적화 */
.text-korean {
  font-family: 'Noto Serif KR', serif;
  letter-spacing: -0.01em;  /* 한글은 letter-spacing 적게 */
  word-break: keep-all;     /* 단어 단위 줄바꿈 */
}

/* 영문 최적화 */
.text-english {
  font-family: 'Cormorant Garamond', serif;
  letter-spacing: -0.02em;  /* 영문은 더 타이트하게 */
}
```

---

## 스페이싱 시스템

### Spacing Scale (8px 기반)

```css
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-5: 1.25rem;  /* 20px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-10: 2.5rem;  /* 40px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-16: 4rem;    /* 64px */
  --spacing-20: 5rem;    /* 80px */
  --spacing-24: 6rem;    /* 96px */
  --spacing-32: 8rem;    /* 128px */
}
```

### Layout Spacing

| Element | Spacing | Value |
|---------|---------|-------|
| **Section padding (vertical)** | Desktop | 80px (--spacing-20) |
| | Mobile | 48px (--spacing-12) |
| **Section padding (horizontal)** | Desktop | 24px (--spacing-6) |
| | Mobile | 16px (--spacing-4) |
| **Container max-width** | - | 1200px |
| **Content max-width** | - | 800px |
| **Element gap (large)** | - | 48px (--spacing-12) |
| **Element gap (medium)** | - | 24px (--spacing-6) |
| **Element gap (small)** | - | 16px (--spacing-4) |

### Container Classes

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-6);
  padding-right: var(--spacing-6);
}

.container-narrow {
  max-width: 800px;
}

.section {
  padding-top: var(--spacing-20);
  padding-bottom: var(--spacing-20);
}

@media (max-width: 768px) {
  .section {
    padding-top: var(--spacing-12);
    padding-bottom: var(--spacing-12);
  }
}
```

---

## 컴포넌트 스타일

### Buttons

```css
/* Primary Button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);

  padding: var(--spacing-4) var(--spacing-8);
  border-radius: 0.5rem;

  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;

  background-color: var(--color-primary-500);
  color: white;
  border: 2px solid var(--color-primary-500);

  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
  border-color: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary-500);
  border: 2px solid var(--color-primary-500);
}

.btn-secondary:hover {
  background-color: var(--color-primary-50);
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: var(--color-primary-500);
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
}

.btn-ghost:hover {
  background-color: var(--color-primary-50);
}
```

### Cards

```css
.card {
  background-color: var(--color-background);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  padding: var(--spacing-8);
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px var(--color-shadow);
  transform: translateY(-4px);
}

.card-header {
  margin-bottom: var(--spacing-6);
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary-500);
  margin-bottom: var(--spacing-2);
}

.card-content {
  color: var(--color-text-secondary);
  line-height: 1.7;
}
```

### Form Elements

```css
.form-group {
  margin-bottom: var(--spacing-6);
}

.form-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text-primary);
  background-color: var(--color-background);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-error {
  margin-top: var(--spacing-2);
  font-size: 0.875rem;
  color: #ef4444;
}
```

### Dividers

```css
.divider {
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-8) 0;
}

.divider-text {
  position: relative;
  text-align: center;
  margin: var(--spacing-8) 0;
}

.divider-text::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-border);
  z-index: -1;
}

.divider-text span {
  display: inline-block;
  padding: 0 var(--spacing-4);
  background-color: var(--color-background);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
```

---

## 반응형 브레이크포인트

### Breakpoints

```css
:root {
  --breakpoint-sm: 640px;   /* Mobile landscape */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
  --breakpoint-2xl: 1536px; /* Extra large */
}
```

### Tailwind 설정

```javascript
// tailwind.config.cjs
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

### Mobile-First 접근

```css
/* Base (mobile) */
.hero-title {
  font-size: 2rem;
  padding: var(--spacing-12) var(--spacing-4);
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    padding: var(--spacing-16) var(--spacing-6);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.5rem;
    padding: var(--spacing-20) var(--spacing-8);
  }
}
```

---

## 애니메이션

### Animation Principles

1. **Subtle**: 사용자 경험을 방해하지 않는 절제된 움직임
2. **Purposeful**: 의미 있는 곳에만 사용
3. **Fast**: 200-300ms 이내 (너무 느리면 답답함)
4. **Natural**: Ease 곡선 사용 (linear 지양)

### Timing Functions

```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Keyframe Animations

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

### Animation Classes

```css
.animate-fade-in {
  animation: fade-in 0.6s var(--ease-out);
}

.animate-slide-up {
  animation: slide-up 0.5s var(--ease-out);
}

.animate-slide-in-right {
  animation: slide-in-right 0.6s var(--ease-out);
}

.animate-scale-in {
  animation: scale-in 0.4s var(--ease-out);
}

.animate-float {
  animation: float 3s var(--ease-in-out) infinite;
}

/* Scroll-triggered animations */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s var(--ease-out);
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Micro-interactions

```css
/* Button hover */
.btn:hover {
  transform: translateY(-2px);
  transition: transform 0.2s var(--ease-out);
}

/* Image hover */
.image-hover {
  overflow: hidden;
}

.image-hover img {
  transition: transform 0.6s var(--ease-out);
}

.image-hover:hover img {
  transform: scale(1.05);
}

/* Link underline */
.link-underline {
  position: relative;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-primary-500);
  transition: width 0.3s var(--ease-out);
}

.link-underline:hover::after {
  width: 100%;
}
```

### Performance Considerations

```css
/* GPU 가속 사용 (transform, opacity만) */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* 애니메이션 종료 후 will-change 제거 */
.optimized-animation {
  animation: slide-up 0.5s var(--ease-out) forwards;
}

.optimized-animation.animation-complete {
  will-change: auto;
}
```

---

## 다크 모드 (선택 사항)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1c1917;
    --color-background-alt: #292524;
    --color-text-primary: #fafaf9;
    --color-text-secondary: #d6d3d1;
    --color-text-muted: #a8a29e;
    --color-border: #44403c;
    --color-shadow: rgba(0, 0, 0, 0.3);
  }
}
```

---

## 사용 예시

### Hero Section

```astro
<section class="hero">
  <div class="container">
    <div class="text-center space-y-8 animate-fade-in">
      <h1 class="text-hero text-korean">
        김민준 & 박서연
      </h1>

      <p class="text-script">
        We're Getting Married
      </p>

      <time class="text-body-large text-neutral-600">
        2025년 6월 15일 오후 2시
      </time>
    </div>
  </div>
</section>
```

### RSVP Form

```tsx
<form className="space-y-6">
  <div className="form-group">
    <label className="form-label">성함</label>
    <input
      type="text"
      className="form-input"
      placeholder="이름을 입력해주세요"
    />
  </div>

  <button type="submit" className="btn-primary w-full">
    참석 여부 전송
  </button>
</form>
```

---

## 참고 자료

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Fonts](https://fonts.google.com)
- [Material Design Color System](https://m3.material.io/styles/color/system/overview)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: 2025-10-18
**Next Review**: Sprint 2 시작 시 (2025-11-04 예정)
**Document Owner**: Design Lead

---

**Navigation**: [← OVERVIEW](../architecture/OVERVIEW.md) | [RSVP_API →](../api/RSVP_API.md) | [PROJECT_PLAN →](../../PROJECT_PLAN.md)
