# 이미지 자산 가이드

## 디렉토리 구조

```
public/images/
├── hero/                           # 메인 비주얼 이미지
│   ├── hero-EM902712-2400.jpg
│   ├── hero-desktop.avif / .webp / .jpg
│   └── hero-mobile.avif / .webp / .jpg
├── maps/                           # 지도 앱 아이콘
│   ├── kakao-map.webp
│   ├── kakao-navi.webp
│   ├── naver-map.webp
│   └── tmap.png
├── utils/                          # UI 유틸리티 아이콘
│   ├── copy.png
│   ├── mute.png
│   ├── read.png
│   ├── share.png
│   └── volume.png
├── wedding/                        # 웨딩 사진 원본 (JPG)
│   ├── IMG_*.JPG
│   └── optimized/
│       ├── full/                   # 최적화 원본 (WebP)
│       │   └── IMG_*.webp
│       ├── thumb/                  # 썸네일 (WebP)
│       │   └── IMG_*.webp
│       └── manifest.json
└── kakao_share.jpg                 # 카카오톡 공유 썸네일 (800x1200, ~50KB)
```

## 이미지 사양

| 용도 | 크기 | 포맷 | 품질 | 비고 |
|------|------|------|------|------|
| 히어로 (데스크톱) | 1920x1080 | AVIF/WebP/JPEG | 85% | < 100KB |
| 히어로 (모바일) | 750x1334 | AVIF/WebP/JPEG | 85% | < 100KB |
| 갤러리 (full) | 원본 비율 | WebP | 80% | optimized/full/ |
| 갤러리 (thumb) | 썸네일 | WebP | 80% | optimized/thumb/ |
| 카카오 공유 | 800x1200 | JPEG | 80% | ~50KB |
| OG 이미지 | 1200x630 | JPEG | 90% | SNS 미리보기 |
