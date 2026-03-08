# OpenClaw / Agent Notes (wedding_invitation)

이 파일은 OpenClaw(루카스)가 이 프로젝트를 다시 열었을 때 빠르게 맥락을 잡기 위한 메모입니다.

## 로컬 실행 (중요)

- 이 프로젝트는 **카카오맵(Web SDK)** 사용
- 카카오 개발자 콘솔의 **플랫폼(Web) → 사이트 도메인 허용 목록**에 등록된 도메인/포트에서만 지도가 렌더링됨
- 따라서 로컬 개발 서버는 **3000 포트로 실행**해야 함

```bash
npm run dev
# -> http://localhost:3000
```

### 카카오맵이 안 보일 때 체크
1. `index.html`에 Kakao SDK 스크립트가 로드되는지
2. Kakao Developers → 내 애플리케이션 → 플랫폼(Web) → 사이트 도메인에 아래가 포함되어 있는지
   - `http://localhost:3000`
   - (필요 시) `http://127.0.0.1:3000`

## 갤러리 이미지 최적화

- 원본: `public/images/wedding/` (고용량 JPG)
- 최적화본(WebP):
  - `public/images/wedding/optimized/full` (maxWidth 1600)
  - `public/images/wedding/optimized/thumb` (maxWidth 480)
- 생성 스크립트: `tools/optimize-wedding-images.mjs`

```bash
node tools/optimize-wedding-images.mjs
```

- `src/scripts/modules/config.js`의 `GALLERY_ITEMS`가 최적화본 경로를 참조
