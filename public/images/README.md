# 이미지 자산 가이드

## 📁 디렉토리 구조

```
public/images/
├── hero/                    # 메인 비주얼 이미지
│   ├── hero-desktop.avif   # 데스크톱용 (1920x1080)
│   ├── hero-desktop.webp
│   ├── hero-desktop.jpg
│   ├── hero-mobile.avif    # 모바일용 (750x1334)
│   ├── hero-mobile.webp
│   └── hero-mobile.jpg
├── gallery/                 # 갤러리 이미지
│   ├── photo1.avif
│   ├── photo1.webp
│   ├── photo1.jpg
│   └── ...
├── icons/                   # PWA 아이콘
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── og-image.jpg            # Open Graph 이미지 (1200x630)
├── apple-touch-icon.png    # Apple Touch Icon (180x180)
├── favicon-32x32.png
└── favicon-16x16.png
```

## 🎨 이미지 사양

### 메인 비주얼 (Hero)
- **데스크톱**: 1920x1080px
- **모바일**: 750x1334px
- **포맷**: AVIF (최우선) → WebP → JPEG
- **품질**: AVIF 85%, WebP 85%, JPEG 85%
- **최적화**: 100KB 이하 권장

### 갤러리 사진
- **크기**: 800x800px (1:1 비율)
- **포맷**: AVIF → WebP → JPEG
- **품질**: 80%
- **최적화**: 50KB 이하 권장

### PWA 아이콘
- **크기**: 72, 96, 128, 144, 152, 192, 384, 512px (정사각형)
- **포맷**: PNG (투명 배경)
- **용도**: 홈 화면 아이콘, 스플래시 스크린

### Open Graph 이미지
- **크기**: 1200x630px
- **포맷**: JPEG
- **품질**: 90%
- **용도**: SNS 공유 미리보기

### Favicon
- **크기**: 16x16, 32x32px
- **포맷**: PNG
- **배경**: 투명 또는 브랜드 컬러

## 🚀 이미지 최적화 도구

### 1. Squoosh (웹 기반)
```
URL: https://squoosh.app/
용도: AVIF, WebP 변환 및 압축
```

### 2. ImageMagick (CLI)
```bash
# JPEG → AVIF 변환
magick convert input.jpg -quality 85 output.avif

# JPEG → WebP 변환
magick convert input.jpg -quality 85 output.webp

# 리사이징
magick convert input.jpg -resize 800x800 output.jpg
```

### 3. Sharp (Node.js)
```bash
npm install sharp

# 사용 예시
node optimize-images.js
```

### 4. cwebp (Google WebP CLI)
```bash
# WebP 변환
cwebp -q 85 input.jpg -o output.webp

# AVIF 변환 (avifenc)
avifenc -s 6 -q 85 input.jpg output.avif
```

## 📝 이미지 최적화 스크립트

아래 스크립트를 `scripts/optimize-images.js`에 저장하세요:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images/originals';
const outputDir = './public/images';

// 이미지 최적화 함수
async function optimizeImage(inputPath, outputPath, options) {
  try {
    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('avif', { quality: 85 })
      .toFile(outputPath.replace('.jpg', '.avif'));

    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('webp', { quality: 85 })
      .toFile(outputPath.replace('.jpg', '.webp'));

    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    console.log(`✅ Optimized: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`❌ Error: ${inputPath}`, error);
  }
}

// 실행
(async () => {
  // Hero 이미지
  await optimizeImage(
    `${inputDir}/hero.jpg`,
    `${outputDir}/hero/hero-desktop.jpg`,
    { width: 1920, height: 1080 }
  );

  await optimizeImage(
    `${inputDir}/hero.jpg`,
    `${outputDir}/hero/hero-mobile.jpg`,
    { width: 750, height: 1334 }
  );

  // 갤러리 이미지
  const galleryFiles = fs.readdirSync(`${inputDir}/gallery`);
  for (const file of galleryFiles) {
    await optimizeImage(
      `${inputDir}/gallery/${file}`,
      `${outputDir}/gallery/${file}`,
      { width: 800, height: 800 }
    );
  }

  console.log('🎉 All images optimized!');
})();
```

## 🖼️ HTML에서 사용하는 방법

### 반응형 이미지 (srcset)
```html
<picture>
  <!-- AVIF 포맷 (최우선) -->
  <source
    media="(min-width: 768px)"
    srcset="/public/images/hero/hero-desktop.avif"
    type="image/avif"
  >
  <source
    media="(max-width: 767px)"
    srcset="/public/images/hero/hero-mobile.avif"
    type="image/avif"
  >

  <!-- WebP 포맷 (대체) -->
  <source
    media="(min-width: 768px)"
    srcset="/public/images/hero/hero-desktop.webp"
    type="image/webp"
  >
  <source
    media="(max-width: 767px)"
    srcset="/public/images/hero/hero-mobile.webp"
    type="image/webp"
  >

  <!-- JPEG 폴백 -->
  <img
    src="/public/images/hero/hero-desktop.jpg"
    alt="결혼식 메인 이미지"
    loading="lazy"
    width="1920"
    height="1080"
  >
</picture>
```

### Lazy Loading
```html
<img
  data-src="/public/images/gallery/photo1.jpg"
  alt="사진 설명"
  loading="lazy"
  width="800"
  height="800"
  class="gallery-image"
>
```

## 📊 성능 목표

| 메트릭 | 목표 | 측정 도구 |
|--------|------|-----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Lighthouse |
| **FID** (First Input Delay) | < 100ms | Chrome DevTools |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| **이미지 크기** | < 100KB (Hero), < 50KB (Gallery) | Squoosh |
| **총 페이지 크기** | < 500KB | Chrome DevTools |

## 🔧 자동화 도구

### GitHub Actions (자동 이미지 최적화)
`.github/workflows/optimize-images.yml` 파일 생성:

```yaml
name: Optimize Images

on:
  push:
    paths:
      - 'public/images/originals/**'

jobs:
  optimize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install sharp
      - run: node scripts/optimize-images.js
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore: optimize images'
```

## 📋 체크리스트

- [ ] 모든 이미지를 AVIF + WebP + JPEG 3가지 포맷으로 제공
- [ ] `<picture>` 태그 사용하여 반응형 이미지 구현
- [ ] `loading="lazy"` 속성 추가 (스크롤 시 로딩)
- [ ] `width`, `height` 속성 명시 (CLS 방지)
- [ ] PWA 아이콘 전체 크기 준비 (72~512px)
- [ ] Open Graph 이미지 준비 (1200x630px)
- [ ] 이미지 압축 (Squoosh, Sharp)
- [ ] 총 페이지 크기 500KB 이하 확인

## 🎨 디자인 가이드

### 추천 색상
- 배경: `#f8f5f2` (따뜻한 베이지)
- 주 컬러: `#8b7355` (브라운)
- 보조 컬러: `#d4b5a0` (라이트 브라운)

### 이미지 스타일
- **톤**: 따뜻한 톤, 자연광
- **필터**: 약간의 세피아/빈티지 효과
- **구도**: 중앙 정렬, 여백 충분히

## 📚 참고 자료

- [Google Web.dev - 이미지 최적화](https://web.dev/fast/#optimize-your-images)
- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [AVIF vs WebP](https://jakearchibald.com/2020/avif-has-landed/)
- [Squoosh 사용법](https://squoosh.app/)

---

**문의**: 이미지 최적화 관련 질문은 이슈로 남겨주세요.
