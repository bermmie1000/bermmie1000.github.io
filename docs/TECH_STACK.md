# 🛠️ 기술 스택 상세 (Tech Stack Details)

**Last Updated**: 2025-10-18
**Project**: GitHub Pages 모바일 청첩장
**Status**: ✅ Finalized

---

## 목차

- [Executive Summary](#executive-summary)
- [Frontend Stack](#frontend-stack)
- [Backend & Services](#backend--services)
- [Development Tools](#development-tools)
- [대안 분석](#대안-분석)
- [성능 목표 및 벤치마크](#성능-목표-및-벤치마크)
- [개발 환경 요구사항](#개발-환경-요구사항)

---

## Executive Summary

### 기술 스택 철학

이 프로젝트의 기술 스택은 다음 3가지 원칙에 따라 선정되었습니다:

1. **Zero Cost** 💰: 모든 도구와 서비스는 무료 (GitHub Pages, Google Sheets)
2. **Maximum Performance** ⚡: Lighthouse 95+ 점수 목표, 모바일 우선
3. **Developer Experience** 🎯: 모던한 도구로 생산성 극대화

### 기술 선택 요약

| Layer | Technology | Why Chosen |
|-------|------------|------------|
| **Framework** | Astro 5.0 | 정적 사이트 특화, Islands Architecture, 최고 성능 |
| **UI Library** | React 18 | 인터랙티브 컴포넌트, 풍부한 생태계 |
| **Styling** | Tailwind CSS 3.4 | 빠른 개발, 일관된 디자인 시스템, 최적화 |
| **Language** | TypeScript 5.0 | 타입 안전성, 개발자 경험 향상 |
| **Hosting** | GitHub Pages | 무료, Git 기반 배포, 신뢰성 |
| **Backend** | Google Sheets + Apps Script | 무료, 간편한 데이터 관리, API 불필요 |
| **Map** | Kakao Maps API | 한국 지도 최적화, 무료 쿼터 |

---

## Frontend Stack

### 1. Astro 5.0 (Core Framework)

#### 왜 Astro인가?

**핵심 장점**:
- **Zero JavaScript by Default**: HTML만 전송, 필요할 때만 JS 로드
- **Islands Architecture**: 인터랙티브 컴포넌트만 선택적 hydration
- **Framework Agnostic**: React, Vue, Svelte 혼용 가능
- **SSG 최적화**: 빌드 타임에 HTML 생성, 런타임 오버헤드 없음
- **GitHub Pages 공식 지원**: `withastro/action` 제공

**성능 비교** (Lighthouse 점수 기준):

| Framework | Performance | FCP | LCP | TBT |
|-----------|-------------|-----|-----|-----|
| **Astro** | **98** | **0.8s** | **1.2s** | **50ms** |
| Next.js (SSG) | 92 | 1.2s | 1.8s | 180ms |
| Vite+React | 88 | 1.5s | 2.1s | 220ms |
| Gatsby | 85 | 1.8s | 2.5s | 300ms |

> 출처: [Web.dev Case Studies 2024](https://web.dev)

#### Astro의 Islands Architecture

```astro
---
// src/pages/index.astro
import Hero from '../components/Hero.astro';        // Static component (no JS)
import EventInfo from '../components/EventInfo.astro'; // Static component
import Map from '../components/Map.tsx';            // Interactive (React)
import RsvpForm from '../components/RsvpForm.tsx';  // Interactive (React)
---

<Layout>
  <!-- Static HTML (no JS) -->
  <Hero />
  <EventInfo />

  <!-- Interactive Islands (JS only here) -->
  <Map client:visible />        <!-- Load when visible -->
  <RsvpForm client:idle />      <!-- Load when browser idle -->
</Layout>
```

**결과**: 90%는 정적 HTML, 10%만 JavaScript (RSVP, Map)

#### Astro 설정

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/wedding-invitation',
  output: 'static',

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // 커스텀 base styles 사용
    }),
  ],

  build: {
    assets: 'assets',
    inlineStylesheets: 'auto', // 작은 CSS는 인라인
  },

  vite: {
    build: {
      cssCodeSplit: true, // CSS 코드 스플리팅
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },

  image: {
    service: 'sharp', // 빌드 타임 이미지 최적화
    remotePatterns: [{ protocol: 'https' }],
  },

  experimental: {
    contentCollectionCache: true, // 빌드 속도 향상
  },
});
```

---

### 2. React 18 (Interactive Components)

#### 왜 React인가?

**선택 이유**:
- Astro와 완벽 통합 (공식 `@astrojs/react` 제공)
- 컴포넌트 생태계 (form libraries, animation)
- 팀 숙련도 (가장 대중적인 라이브러리)
- 미래 지향적 (React 19 Server Components 준비)

**대안 고려**:
- **Vue 3**: 좋은 선택이나 React보다 생태계 작음
- **Svelte**: 매우 가볍지만 학습 곡선, 라이브러리 부족
- **Vanilla JS**: 커스텀 로직 많을 경우 유지보수 어려움

#### React 사용 범위

**인터랙티브 컴포넌트만 React 사용**:
- ✅ `RsvpForm.tsx` - 폼 유효성 검사, 상태 관리
- ✅ `Map.tsx` - Kakao Maps API 통합
- ✅ `Gallery.tsx` - 이미지 그리드, Lightbox
- ✅ `Guestbook.tsx` - 방명록 폼 & 리스트
- ❌ `Hero.astro` - 정적 섹션은 Astro로
- ❌ `EventInfo.astro` - 정적 정보는 Astro로

#### React 컴포넌트 예시

```tsx
// src/components/RsvpForm.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';

interface RsvpData {
  name: string;
  attendance: 'yes' | 'no';
  guests: number;
}

export default function RsvpForm() {
  const [formData, setFormData] = useState<RsvpData>({
    name: '',
    attendance: 'yes',
    guests: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Google Sheets Apps Script Webhook
      const response = await fetch(import.meta.env.PUBLIC_RSVP_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('참석 여부가 전송되었습니다!');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? '전송 중...' : '참석 여부 전송'}
      </button>
    </form>
  );
}
```

**Astro에서 사용**:
```astro
---
// src/pages/index.astro
import RsvpForm from '../components/RsvpForm.tsx';
---

<section id="rsvp">
  <h2>참석 여부 응답</h2>
  <!-- client:idle = 브라우저가 idle 상태일 때 hydrate -->
  <RsvpForm client:idle />
</section>
```

---

### 3. Tailwind CSS 3.4 (Styling)

#### 왜 Tailwind CSS인가?

**장점**:
- **빠른 개발**: Utility-first, 컴포넌트별 CSS 파일 불필요
- **일관된 디자인 시스템**: `tailwind.config.js`로 중앙 관리
- **최적화**: PurgeCSS 내장, 사용하지 않는 CSS 자동 제거
- **반응형**: `sm:`, `md:`, `lg:` prefix로 간편한 반응형
- **다크모드**: `dark:` prefix로 테마 전환 쉬움

**대안 고려**:
- **CSS Modules**: 파일 관리 복잡, 디자인 시스템 구축 어려움
- **Styled Components**: Runtime overhead, SSG에 부적합
- **Vanilla CSS**: 대규모 프로젝트에서 유지보수 어려움

#### Tailwind 설정

```javascript
// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        // Minimal Elegance Theme
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          500: '#2C3E50', // Main brand color
          900: '#1a252f',
        },
        accent: {
          50: '#fef9e7',
          100: '#fdedc4',
          500: '#D4AF37', // Gold accent
          900: '#8b7324',
        },
      },

      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Noto Sans KR', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },

      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },

      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'), // 폼 스타일링
    require('@tailwindcss/typography'), // 본문 타이포그래피
  ],
};
```

#### Tailwind 사용 예시

```astro
---
// src/components/Hero.astro
const { groomName, brideName, weddingDate } = Astro.props;
---

<section class="
  relative min-h-screen flex items-center justify-center
  bg-gradient-to-b from-primary-50 to-white
  px-4 sm:px-6 lg:px-8
">
  <div class="text-center space-y-8 animate-fade-in">
    <h1 class="
      font-heading text-4xl sm:text-5xl lg:text-6xl
      text-primary-900 tracking-wider
    ">
      {groomName} & {brideName}
    </h1>

    <p class="font-script text-2xl sm:text-3xl text-accent-500">
      We're Getting Married
    </p>

    <time class="
      block text-lg sm:text-xl text-primary-700
      font-semibold
    ">
      {weddingDate}
    </time>
  </div>
</section>
```

---

### 4. TypeScript 5.0 (Language)

#### 왜 TypeScript인가?

**장점**:
- **타입 안전성**: 런타임 에러 조기 발견
- **자동완성**: IDE 지원으로 생산성 향상
- **리팩토링**: 안전한 코드 수정
- **문서화**: 타입이 곧 문서

**프로젝트 설정**:
```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "react",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,

    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"],
      "@config/*": ["src/config/*"]
    }
  }
}
```

#### 타입 정의 예시

```typescript
// src/types/index.ts

export interface WeddingConfig {
  bride: Person;
  groom: Person;
  event: EventDetails;
  venue: Venue;
}

export interface Person {
  name: string;
  fullName?: string;
  parents?: {
    father: string;
    mother: string;
  };
  contact?: {
    phone: string;
    kakaotalk?: string;
  };
}

export interface EventDetails {
  date: string; // ISO 8601 format
  time: string; // HH:MM format
  description?: string;
}

export interface Venue {
  name: string;
  address: string;
  floor?: string;
  hall?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parking?: string;
  public_transport?: string[];
}

export interface RsvpSubmission {
  name: string;
  attendance: 'yes' | 'no';
  guests: number;
  message?: string;
  timestamp?: string;
}
```

---

## Backend & Services

### 1. GitHub Pages (Hosting)

#### 왜 GitHub Pages인가?

**장점**:
- ✅ **완전 무료**: 무제한 대역폭, 트래픽
- ✅ **Git 기반 배포**: `git push`로 자동 배포
- ✅ **HTTPS 기본 제공**: Let's Encrypt 인증서
- ✅ **커스텀 도메인**: 자신의 도메인 연결 가능
- ✅ **CDN**: Fastly CDN으로 전세계 빠른 로딩
- ✅ **99.9% 업타임**: GitHub 인프라 신뢰성

**제약사항**:
- 저장소 크기: 1GB 권장
- 파일 크기: 100MB 제한
- 빌드 시간: 10분 제한
- 대역폭: 월 100GB 소프트 리밋 (초과 시 제한 가능)

**배포 설정**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        run: pnpm build
        env:
          PUBLIC_RSVP_WEBHOOK_URL: ${{ secrets.RSVP_WEBHOOK_URL }}
          PUBLIC_KAKAO_MAP_KEY: ${{ secrets.KAKAO_MAP_KEY }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 2. Google Sheets + Apps Script (RSVP Backend)

#### 왜 Google Sheets인가?

**장점**:
- ✅ **완전 무료**: API 쿼터 충분 (일 50,000 요청)
- ✅ **간편한 관리**: 엑셀처럼 직관적인 데이터 확인
- ✅ **별도 DB 불필요**: 서버 없이 데이터 저장
- ✅ **협업 용이**: 신랑/신부가 함께 데이터 확인
- ✅ **Apps Script**: 간단한 Webhook 구현 가능

**대안 비교**:

| Service | Cost | Complexity | Management | Real-time |
|---------|------|------------|------------|-----------|
| **Google Sheets** | 무료 | ⭐⭐ 낮음 | ⭐⭐⭐⭐⭐ 매우 쉬움 | ❌ |
| Firebase Firestore | 무료→유료 | ⭐⭐⭐⭐ 높음 | ⭐⭐⭐ 보통 | ✅ |
| Supabase | 무료→유료 | ⭐⭐⭐⭐⭐ 매우 높음 | ⭐⭐⭐ 보통 | ✅ |
| Airtable | 유료 | ⭐⭐ 낮음 | ⭐⭐⭐⭐ 쉬움 | ✅ |

#### Google Apps Script Webhook 구현

**1단계: Google Sheets 생성**

| Timestamp | Name | Attendance | Guests | Message |
|-----------|------|------------|--------|---------|
| 2025-10-18 10:30 | 홍길동 | yes | 2 | 축하합니다! |

**2단계: Apps Script 코드**

```javascript
// Google Apps Script (Web App)
function doPost(e) {
  try {
    // 요청 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 스프레드시트 열기
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP');

    // 데이터 추가
    sheet.appendRow([
      new Date(),           // Timestamp
      data.name,           // Name
      data.attendance,     // Attendance (yes/no)
      data.guests || 1,    // Number of guests
      data.message || '',  // Optional message
    ]);

    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// CORS 처리
function doGet(e) {
  return ContentService
    .createTextOutput("RSVP API is working")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

**3단계: 배포**
1. Apps Script 에디터에서 "배포" → "새 배포"
2. 유형: "웹 앱"
3. 실행 권한: "나" (스프레드시트 소유자)
4. 액세스 권한: "모든 사용자"
5. 배포 후 URL 복사 → GitHub Secrets에 저장

**4단계: 프론트엔드 연동**

```typescript
// src/utils/rsvp.ts
export async function submitRsvp(data: RsvpSubmission) {
  const webhookUrl = import.meta.env.PUBLIC_RSVP_WEBHOOK_URL;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit RSVP');
  }

  return response.json();
}
```

---

### 3. Kakao Maps API (지도)

#### 왜 Kakao Maps인가?

**장점**:
- ✅ **한국 지도 최적화**: 상세한 주소, POI 정보
- ✅ **무료 쿼터**: 일 300,000 요청 (충분함)
- ✅ **간편한 연동**: JavaScript SDK 제공
- ✅ **모바일 최적화**: 터치 제스처 지원

**대안 비교**:
- **Google Maps**: 유료 (월 $200 크레딧 후 과금), 한국 상세도 낮음
- **Naver Maps**: 무료이나 API 키 발급 복잡
- **OpenStreetMap**: 무료이나 한국 데이터 부족

#### Kakao Maps 연동

```tsx
// src/components/Map.tsx
import { useEffect, useRef } from 'react';

interface MapProps {
  lat: number;
  lng: number;
  venueName: string;
}

export default function Map({ lat, lng, venueName }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kakao Maps API 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapContainer.current;
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3, // 확대 레벨
        };

        const map = new window.kakao.maps.Map(container, options);

        // 마커 추가
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 인포윈도우
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${venueName}</div>`,
        });
        infowindow.open(map, marker);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [lat, lng, venueName]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded-lg shadow-lg"
    />
  );
}
```

---

## Development Tools

### 1. pnpm (패키지 관리자)

#### 왜 pnpm인가?

**장점 (vs npm/yarn)**:
- ✅ **디스크 공간 절약**: 중복 패키지 하드링크로 연결
- ✅ **빠른 설치**: npm보다 2-3배 빠름
- ✅ **엄격한 의존성**: Phantom dependencies 방지
- ✅ **Monorepo 지원**: Workspace 기능 내장

**성능 비교**:

| 패키지 관리자 | 설치 시간 (평균) | 디스크 사용량 |
|--------------|------------------|---------------|
| **pnpm** | **10s** | **120MB** |
| npm | 28s | 350MB |
| yarn | 15s | 280MB |

**설치 및 설정**:
```json
// package.json
{
  "name": "wedding-invitation",
  "version": "1.0.0",
  "packageManager": "pnpm@8.15.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

---

### 2. Vitest (단위 테스트)

#### 왜 Vitest인가?

**장점 (vs Jest)**:
- ✅ **Vite 네이티브**: 빠른 실행, 설정 불필요
- ✅ **ESM 지원**: 별도 트랜스파일 불필요
- ✅ **Jest 호환 API**: 마이그레이션 쉬움
- ✅ **UI 모드**: 브라우저에서 테스트 결과 확인

**설정**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
});
```

**테스트 예시**:
```typescript
// src/utils/date.test.ts
import { describe, it, expect } from 'vitest';
import { formatWeddingDate } from './date';

describe('formatWeddingDate', () => {
  it('should format date correctly', () => {
    const date = '2025-10-18T14:00:00';
    const result = formatWeddingDate(date);
    expect(result).toBe('2025년 10월 18일 오후 2시');
  });
});
```

---

### 3. Playwright (E2E 테스트)

#### 왜 Playwright인가?

**장점 (vs Cypress)**:
- ✅ **크로스 브라우저**: Chromium, Firefox, WebKit
- ✅ **빠른 실행**: 병렬 테스트 기본 지원
- ✅ **모바일 테스트**: 디바이스 에뮬레이션
- ✅ **자동 대기**: 안정적인 테스트

**설정**:
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm preview',
    port: 4321,
  },
});
```

**테스트 예시**:
```typescript
// tests/e2e/rsvp.spec.ts
import { test, expect } from '@playwright/test';

test('should submit RSVP successfully', async ({ page }) => {
  await page.goto('/');

  // RSVP 섹션으로 스크롤
  await page.click('text=참석 여부');

  // 폼 작성
  await page.fill('input[name="name"]', '홍길동');
  await page.check('input[value="yes"]');
  await page.selectOption('select[name="guests"]', '2');

  // 제출
  await page.click('button[type="submit"]');

  // 성공 메시지 확인
  await expect(page.locator('text=전송되었습니다')).toBeVisible();
});
```

---

### 4. Lighthouse CI (성능 모니터링)

#### 왜 Lighthouse CI인가?

**장점**:
- ✅ **자동화**: PR마다 성능 체크
- ✅ **회귀 방지**: 성능 저하 조기 발견
- ✅ **보고서**: 시각적 성능 트렌드

**설정**:
```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm install -g @lhci/cli
      - run: pnpm install
      - run: pnpm build

      - name: Run Lighthouse CI
        run: |
          lhci autorun --upload.target=temporary-public-storage
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['http://localhost/'],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

---

### 5. Biome (린터 & 포맷터)

#### 왜 Biome인가?

**장점 (vs ESLint + Prettier)**:
- ✅ **빠른 속도**: Rust 기반, 10-100배 빠름
- ✅ **올인원**: 린트 + 포맷 하나로 해결
- ✅ **제로 설정**: 기본값이 합리적
- ✅ **에디터 통합**: VS Code 확장 제공

**설정**:
```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.5.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingComma": "all"
    }
  }
}
```

---

## 대안 분석

### Framework 비교

#### Astro vs Next.js vs Vite+React

| Feature | Astro 5.0 | Next.js 15 | Vite+React |
|---------|-----------|-----------|------------|
| **성능 (Lighthouse)** | 98 ⭐⭐⭐⭐⭐ | 92 ⭐⭐⭐⭐ | 88 ⭐⭐⭐ |
| **초기 번들 크기** | 10KB | 80KB | 120KB |
| **빌드 시간** | 5s | 15s | 8s |
| **SSG 지원** | ✅ Native | ✅ Native | ⚠️ Plugin 필요 |
| **Islands Architecture** | ✅ | ❌ | ❌ |
| **학습 곡선** | 낮음 | 중간 | 낮음 |
| **생태계** | 중간 | 매우 큼 | 매우 큼 |
| **GitHub Pages 배포** | ✅ 공식 지원 | ⚠️ 설정 필요 | ⚠️ 설정 필요 |
| **적합한 프로젝트** | **정적 사이트** | Full-stack 앱 | SPA |

**결론**: 청첩장처럼 **정적 콘텐츠가 대부분**인 프로젝트는 **Astro가 최적**

---

### Backend 비교

#### Google Sheets vs Firebase vs Supabase

| Feature | Google Sheets | Firebase | Supabase |
|---------|---------------|----------|----------|
| **비용** | 무료 | 무료 → 유료 | 무료 → 유료 |
| **설정 복잡도** | ⭐⭐ 낮음 | ⭐⭐⭐⭐ 높음 | ⭐⭐⭐⭐⭐ 매우 높음 |
| **데이터 관리** | 엑셀처럼 쉬움 | Firebase Console | SQL 필요 |
| **실시간 업데이트** | ❌ | ✅ | ✅ |
| **API 쿼터** | 50,000/day | 20,000/day | 무제한 |
| **인증** | 불필요 | 필요 | 필요 |
| **스케일** | 소규모 | 대규모 | 대규모 |

**결론**: 청첩장은 **수백 건의 RSVP만 처리**하면 되므로 **Google Sheets가 충분**

---

## 성능 목표 및 벤치마크

### Lighthouse 점수 목표

| Category | Target (MVP) | Target (Final) |
|----------|--------------|----------------|
| **Performance** | > 90 | > 95 |
| **Accessibility** | > 95 | > 100 |
| **Best Practices** | > 95 | > 100 |
| **SEO** | > 90 | > 95 |

### Core Web Vitals 목표

| Metric | Good | Target |
|--------|------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 2.0s |
| **FID** (First Input Delay) | < 100ms | < 50ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.05 |

### 번들 크기 목표

| Asset | Budget | Target |
|-------|--------|--------|
| **Initial HTML** | < 50KB | < 30KB |
| **CSS (critical)** | < 20KB | < 15KB |
| **JavaScript (total)** | < 100KB | < 80KB |
| **Images (above fold)** | < 200KB | < 150KB |

### 성능 최적화 전략

1. **이미지 최적화**
   - WebP 포맷 + JPEG fallback
   - 반응형 이미지 (`<picture>`, `srcset`)
   - Lazy loading (below fold)
   - Blur placeholder

2. **코드 스플리팅**
   - Route-based splitting (Astro 자동)
   - Component-based splitting (React.lazy)
   - Vendor chunk 분리

3. **CSS 최적화**
   - Critical CSS 인라인
   - Unused CSS 제거 (Tailwind PurgeCSS)
   - Font display swap

4. **JavaScript 최적화**
   - Astro Islands (필요한 부분만 JS)
   - Tree shaking
   - Minification

---

## 개발 환경 요구사항

### 필수 소프트웨어

| Software | Minimum Version | Recommended |
|----------|----------------|-------------|
| **Node.js** | 18.17.0 | 22.0.0+ |
| **pnpm** | 8.0.0 | 8.15.0+ |
| **Git** | 2.30.0 | Latest |

### 권장 에디터 & 확장

**VS Code Extensions**:
```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "biomejs.biome",
    "dbaeumer.vscode-eslint",
    "ms-playwright.playwright"
  ]
}
```

### 로컬 개발 환경 설정

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/wedding-invitation.git
cd wedding-invitation

# 2. pnpm 설치 (없을 경우)
npm install -g pnpm

# 3. 의존성 설치
pnpm install

# 4. 환경 변수 설정
cp .env.example .env
# .env 파일에서 API 키 설정

# 5. 개발 서버 실행
pnpm dev

# 브라우저에서 http://localhost:4321 열기
```

### 환경 변수

```bash
# .env.example
PUBLIC_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
PUBLIC_KAKAO_MAP_KEY=your_kakao_map_api_key
PUBLIC_SITE_URL=https://yourusername.github.io/wedding-invitation
```

---

## 참고 자료

### 공식 문서

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Google Apps Script Guide](https://developers.google.com/apps-script)
- [Kakao Maps API](https://apis.map.kakao.com)

### 벤치마크 & 비교

- [Web.dev - Performance](https://web.dev/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Astro vs Next.js Benchmarks](https://astro.build/blog/2023-web-framework-performance-report/)

### 튜토리얼

- [Astro + GitHub Pages Deployment](https://docs.astro.build/en/guides/deploy/github/)
- [Google Sheets as a Database](https://codingshiksha.com/google-sheets-as-database/)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)

---

**Last Updated**: 2025-10-18
**Next Review**: Sprint 2 종료 시 (2025-11-17 예정)
**Document Owner**: Technical Architect

---

**Navigation**: [← PROJECT_PLAN](../PROJECT_PLAN.md) | [README →](../README.md) | [Architecture →](architecture/OVERVIEW.md)
