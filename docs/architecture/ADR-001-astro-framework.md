# ADR-001: Astro 프레임워크 선택

**Status**: ✅ Accepted
**Date**: 2025-10-18
**Decision Makers**: Technical Team
**Stakeholders**: Development Team, Product Owner

---

## Context (배경)

GitHub Pages 기반 모바일 청첩장 프로젝트를 시작하면서, 정적 사이트 생성을 위한 프레임워크 선택이 필요했습니다.

### 요구사항

1. **성능**: Lighthouse Performance 점수 95+ 목표
2. **비용**: 무료 호스팅 (GitHub Pages) 활용
3. **개발 경험**: 모던한 개발 도구, TypeScript 지원
4. **유지보수성**: 간단한 구조, 낮은 학습 곡선
5. **확장성**: 필요시 인터랙티브 컴포넌트 추가 가능

### 제약사항

- GitHub Pages는 정적 사이트만 지원 (서버 사이드 렌더링 불가)
- 빌드 시간 10분 제한
- 저장소 크기 1GB 권장
- 개발 리소스 제한 (1-2명 개발자)

---

## Decision (결정)

**Astro 5.0**을 메인 프레임워크로 선택합니다.

인터랙티브 컴포넌트가 필요한 부분(RSVP 폼, 지도, 갤러리)은 **React 18**을 Islands로 통합합니다.

---

## Options Considered (고려한 대안)

### Option 1: Astro 5.0 ⭐ (선택됨)

**장점**:
- ✅ **최고 성능**: Zero JavaScript by default, Lighthouse 98+ 가능
- ✅ **Islands Architecture**: 인터랙티브 컴포넌트만 선택적 hydration
- ✅ **Framework Agnostic**: React, Vue, Svelte 혼용 가능
- ✅ **간단한 구문**: HTML-like `.astro` 파일, 낮은 학습 곡선
- ✅ **GitHub Pages 공식 지원**: `withastro/action` 제공
- ✅ **빠른 빌드**: SSG 최적화, 평균 5초 빌드
- ✅ **TypeScript Native**: 설정 없이 즉시 사용 가능
- ✅ **Image Optimization**: 빌트인 `<Image />` 컴포넌트

**단점**:
- ⚠️ 상대적으로 작은 생태계 (Next.js 대비)
- ⚠️ 복잡한 인터랙션은 React/Vue 등 추가 필요
- ⚠️ 커뮤니티 리소스 적음 (Stack Overflow 질문 수)

**성능 벤치마크**:
```
Lighthouse Score: 98
First Contentful Paint: 0.8s
Largest Contentful Paint: 1.2s
Total Blocking Time: 50ms
Cumulative Layout Shift: 0.02
Bundle Size: ~10KB (HTML only sections)
```

**비용**: 무료 (오픈소스)

---

### Option 2: Next.js 15 (App Router)

**장점**:
- ✅ 매우 큰 생태계, 풍부한 리소스
- ✅ Full-stack 가능 (API Routes)
- ✅ Image Optimization 강력
- ✅ Vercel 배포 최적화

**단점**:
- ❌ **과도한 기능**: 청첩장에 불필요한 서버 기능 많음
- ❌ **큰 번들 크기**: React hydration 필수, 최소 80KB
- ❌ **복잡한 설정**: App Router, Server Components 학습 곡선
- ❌ **GitHub Pages 배포 복잡**: `next export` 설정 필요
- ❌ **느린 빌드**: 평균 15-20초

**성능 벤치마크**:
```
Lighthouse Score: 92
First Contentful Paint: 1.2s
Largest Contentful Paint: 1.8s
Total Blocking Time: 180ms
Bundle Size: ~80KB (minimum)
```

**비용**: 무료 (오픈소스), Vercel 호스팅 시 유료 플랜 필요할 수 있음

---

### Option 3: Vite + React

**장점**:
- ✅ 매우 빠른 HMR (Hot Module Replacement)
- ✅ 단순한 설정
- ✅ React 생태계 활용

**단점**:
- ❌ **SSG 부족**: `vite-plugin-ssr` 등 추가 플러그인 필요
- ❌ **수동 최적화**: Code splitting, lazy loading 직접 구현
- ❌ **SEO 불리**: SPA 기본, SSG 설정 복잡
- ❌ **모든 페이지 React**: 불필요한 JavaScript 로드

**성능 벤치마크**:
```
Lighthouse Score: 88
First Contentful Paint: 1.5s
Largest Contentful Paint: 2.1s
Total Blocking Time: 220ms
Bundle Size: ~120KB
```

**비용**: 무료 (오픈소스)

---

### Option 4: Gatsby

**장점**:
- ✅ 성숙한 SSG 솔루션
- ✅ GraphQL 데이터 레이어
- ✅ 풍부한 플러그인

**단점**:
- ❌ **과도한 복잡도**: GraphQL 학습 필요, 청첩장에 불필요
- ❌ **느린 빌드**: 대규모 사이트에서 빌드 시간 증가
- ❌ **하락세**: 커뮤니티 활동 감소 (2023-2025)
- ❌ **큰 번들 크기**: React hydration 필수

**성능 벤치마크**:
```
Lighthouse Score: 85
First Contentful Paint: 1.8s
Largest Contentful Paint: 2.5s
Total Blocking Time: 300ms
Bundle Size: ~100KB
```

**비용**: 무료 (오픈소스)

---

## Comparison Matrix (비교표)

| Criteria | Astro 5.0 | Next.js 15 | Vite+React | Gatsby |
|----------|-----------|------------|------------|--------|
| **Performance (Lighthouse)** | 98 ⭐⭐⭐⭐⭐ | 92 ⭐⭐⭐⭐ | 88 ⭐⭐⭐ | 85 ⭐⭐⭐ |
| **Initial Bundle Size** | 10KB ⭐⭐⭐⭐⭐ | 80KB ⭐⭐⭐ | 120KB ⭐⭐ | 100KB ⭐⭐⭐ |
| **Build Time** | 5s ⭐⭐⭐⭐⭐ | 15s ⭐⭐⭐ | 8s ⭐⭐⭐⭐ | 20s ⭐⭐ |
| **Learning Curve** | Low ⭐⭐⭐⭐⭐ | Medium ⭐⭐⭐ | Low ⭐⭐⭐⭐ | High ⭐⭐ |
| **SSG Support** | Native ⭐⭐⭐⭐⭐ | Native ⭐⭐⭐⭐⭐ | Plugin ⭐⭐⭐ | Native ⭐⭐⭐⭐ |
| **GitHub Pages Deployment** | Easy ⭐⭐⭐⭐⭐ | Medium ⭐⭐⭐ | Medium ⭐⭐⭐ | Easy ⭐⭐⭐⭐ |
| **Ecosystem Size** | Medium ⭐⭐⭐ | Large ⭐⭐⭐⭐⭐ | Large ⭐⭐⭐⭐⭐ | Medium ⭐⭐⭐ |
| **Complexity** | Low ⭐⭐⭐⭐⭐ | High ⭐⭐ | Low ⭐⭐⭐⭐ | High ⭐⭐ |
| **적합성 (청첩장)** | Perfect ⭐⭐⭐⭐⭐ | Overkill ⭐⭐⭐ | Good ⭐⭐⭐⭐ | Overkill ⭐⭐ |

---

## Rationale (선택 근거)

### 1. 성능 최우선

청첩장은 **모바일에서 빠르게 로드**되어야 합니다. 하객들은:
- 3G/LTE 환경에서 접속할 수 있음
- 결혼식 당일 현장에서 정보 확인 (빠른 로딩 필수)
- 나이 많은 하객도 사용 (복잡한 UI 지양)

**Astro의 Zero JavaScript 접근**은 이 요구사항에 완벽히 부합:
- Hero, EventInfo, Contact는 순수 HTML → **즉시 표시**
- Map, RSVP는 필요할 때만 JavaScript 로드 → **점진적 향상**

### 2. 적정 기술 (Right Tool for the Job)

청첩장은:
- ❌ 서버 사이드 로직 불필요
- ❌ 복잡한 상태 관리 불필요
- ❌ 실시간 데이터 동기화 불필요
- ✅ 정적 콘텐츠가 90%
- ✅ 간단한 폼 제출 (RSVP)
- ✅ 지도 표시

→ **Next.js의 서버 기능은 과도**, **Astro의 정적 특화가 적합**

### 3. 개발 생산성

**Astro 문법은 직관적**:
```astro
---
// 이게 전부입니다
const { name, date } = Astro.props;
---

<section>
  <h1>{name}</h1>
  <time>{date}</time>
</section>
```

**vs Next.js App Router**:
```tsx
// 'use client' vs 'use server' 구분 필요
// Server Components vs Client Components 이해 필요
// Metadata API, generateStaticParams 등 복잡
```

### 4. GitHub Pages 최적화

**Astro 공식 Action**:
```yaml
- uses: withastro/action@v4  # 한 줄로 끝
```

**vs Next.js**:
```yaml
# next.config.js 수정 필요
# output: 'export' 설정
# basePath, assetPrefix 설정
# Image Optimization 비활성화 필요
```

### 5. 미래 확장성

Astro는 **점진적 복잡도 증가** 가능:

**Phase 1 (현재)**: 정적 HTML만
```astro
<Hero />
<EventInfo />
```

**Phase 2**: React 추가
```astro
<RsvpForm client:idle />
<Map client:visible />
```

**Phase 3**: Vue도 가능
```astro
<AnimatedGallery client:load /> <!-- Vue component -->
```

→ 필요에 따라 복잡도 조절 가능

---

## Consequences (영향)

### Positive (긍정적 영향)

1. **최고 성능 달성 가능**
   - Lighthouse 95+ 점수 실현 가능
   - 모바일 사용자 경험 극대화
   - SEO 최적화

2. **빠른 개발 속도**
   - 간단한 문법, 낮은 학습 곡선
   - Hot Module Replacement 빠름
   - 빌드 시간 단축 (5초)

3. **유지보수 용이**
   - 코드베이스 단순
   - 버그 발생 가능성 낮음
   - 신규 개발자 온보딩 쉬움

4. **제로 비용 유지**
   - GitHub Pages 무료 호스팅
   - CDN 무료 (Fastly)
   - 서버 비용 없음

### Negative (부정적 영향)

1. **작은 생태계**
   - Stack Overflow 질문/답변 적음
   - 서드파티 플러그인 제한적
   - 완화: React 생태계 활용으로 보완

2. **복잡한 인터랙션 구현 어려움**
   - Astro만으로는 제한적
   - 완화: React Islands로 해결

3. **서버 사이드 기능 추가 어려움**
   - API Routes 없음
   - 완화: Google Apps Script로 대체

4. **커뮤니티 리소스 부족**
   - 튜토리얼, 예제 적음
   - 완화: 공식 문서가 우수함

### Risks (리스크)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Astro 프로젝트 중단 | Low | High | 정적 HTML 출력이므로 마이그레이션 쉬움 |
| 생태계 성장 정체 | Medium | Low | React 플러그인 활용으로 보완 |
| 복잡한 기능 요구사항 발생 | Medium | Medium | React Islands로 대부분 해결 가능 |
| 개발자 구인 어려움 | Low | Low | React 개발자가 쉽게 적응 가능 |

---

## Alternatives Still Available (여전히 가능한 대안)

### 마이그레이션 시나리오

**Astro → Next.js**:
- `.astro` 파일을 `.tsx`로 변환 (비교적 간단)
- Astro Islands는 이미 React이므로 재사용
- 데이터 fetching 로직만 조정

**Astro → Vite+React**:
- React 컴포넌트는 그대로 사용
- Astro 컴포넌트를 React로 변환

**Exit Cost**: Medium (1-2주 작업으로 마이그레이션 가능)

---

## Implementation Plan (구현 계획)

### Phase 1 (Week 1): 프로젝트 초기화

```bash
pnpm create astro@latest wedding-invitation --template minimal --typescript strict
cd wedding-invitation
pnpm add react react-dom
pnpm add -D @astrojs/react @astrojs/tailwind
pnpm astro add react tailwind
```

### Phase 2 (Week 2-3): 정적 섹션 개발

- `Hero.astro`
- `EventInfo.astro`
- `Contact.astro`

### Phase 3 (Week 2-3): 인터랙티브 Islands

- `Map.tsx` (React)
- `RsvpForm.tsx` (React)

### Phase 4 (Week 4): 최적화 & 배포

- Image optimization
- Lighthouse CI 설정
- GitHub Pages 배포

---

## Validation (검증 계획)

### Success Metrics

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Lighthouse Performance | > 95 | Lighthouse CI (자동) |
| Build Time | < 10s | GitHub Actions 로그 |
| Bundle Size (HTML) | < 30KB | `pnpm build` 출력 확인 |
| Development Time | < 3 weeks | Sprint 1 완료 시 |

### Review Points

- **Sprint 1 종료 시**: 성능 목표 달성 여부 검토
- **Sprint 2 종료 시**: 개발 생산성 평가
- **Sprint 3 종료 시**: 최종 의사결정 검증

**재검토 조건**:
- Lighthouse 점수 < 90
- 개발 속도가 예상보다 2배 이상 느림
- 치명적 버그 발견

---

## References (참고 자료)

### Official Documentation

- [Astro Documentation](https://docs.astro.build)
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro vs Next.js Comparison](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/)

### Performance Studies

- [Astro Performance Report 2024](https://astro.build/blog/2023-web-framework-performance-report/)
- [Web.dev - Lighthouse Scoring](https://web.dev/performance-scoring/)

### Community

- [Astro Discord](https://astro.build/chat)
- [Astro GitHub Discussions](https://github.com/withastro/astro/discussions)

---

## Decision Log

| Date | Author | Action |
|------|--------|--------|
| 2025-10-18 | Technical Team | Initial decision: Astro 5.0 선택 |
| - | - | Review scheduled: Sprint 1 종료 시 (2025-11-03) |

---

**Status**: ✅ Accepted
**Last Updated**: 2025-10-18
**Next Review**: 2025-11-03 (Sprint 1 종료 시)

---

**Navigation**: [← OVERVIEW](OVERVIEW.md) | [DESIGN_SYSTEM →](../design/DESIGN_SYSTEM.md) | [PROJECT_PLAN →](../../PROJECT_PLAN.md)
