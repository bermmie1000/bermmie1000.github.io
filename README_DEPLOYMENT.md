# 🚀 배포 완료 가이드

## GitHub Pages 자동 배포 시스템

Wedding Invitation 프로젝트의 GitHub Pages 배포 시스템이 완성되었습니다.

---

## 빠른 시작

### 1단계: 로컬 테스트
```bash
./build.sh
npm run preview
```

### 2단계: GitHub에 배포
```bash
# GitHub에서 저장소 생성
# https://github.com/new

# Git 초기화 및 푸시
git init
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### 3단계: GitHub Pages 활성화
```
Repository → Settings → Pages
Source: GitHub Actions 선택
```

### 4단계: 배포 확인
```
Actions 탭 → Deploy to GitHub Pages
약 2-3분 후 완료
```

---

## 문서 구조

| 문서 | 용도 | 대상 |
|------|------|------|
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | 5분 빠른 배포 | 처음 사용자 |
| **[DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** | 상세 배포 가이드 | 전체 사용자 |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | 배포 체크리스트 | 배포 담당자 |
| **[GITHUB_PAGES_SETUP.md](.github/GITHUB_PAGES_SETUP.md)** | Settings 설정 | 관리자 |
| **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** | 시스템 요약 | 개발자 |

---

## 주요 기능

### 자동 배포
- main 브랜치 push 시 자동 빌드 및 배포
- 배포 시간: 약 2-3분
- HTTPS 자동 적용

### 최적화
- Vite 빌드 (code splitting, tree shaking)
- Terser JS 압축
- HTML/CSS 자동 minification
- 이미지 최적화 스크립트 제공

### CI/CD
- PR 생성 시 빌드 검증
- Lighthouse 성능 자동 측정
- 빌드 크기 리포트

---

## 파일 구조

```
.github/
├── workflows/
│   ├── deploy.yml              # 메인 배포
│   ├── preview.yml             # PR 프리뷰
│   ├── performance-check.yml   # 성능 체크
│   └── lighthouse.yml          # Lighthouse CI
└── GITHUB_PAGES_SETUP.md       # Settings 가이드

build.sh                        # 로컬 빌드
optimize.sh                     # 이미지 최적화

QUICK_DEPLOY.md                 # 빠른 가이드
DEPLOYMENT_CHECKLIST.md         # 체크리스트
DEPLOYMENT_SUMMARY.md           # 시스템 요약
docs/DEPLOYMENT_GUIDE.md        # 상세 가이드
```

---

## 빌드 통계

```
현재 빌드 크기:
  Total:    44K
  HTML:     7.29 kB (gzip: 2.54 kB)
  CSS:      5.48 kB (gzip: 1.65 kB)
  JS:       1.80 kB (gzip: 0.90 kB)

성능 목표:
  ✅ Total < 1MB
  ✅ Build Time < 2min
  ⬜ Lighthouse Performance > 95
  ⬜ LCP < 2.5s
```

---

## 유지보수

### 코드 수정 및 재배포
```bash
# 1. 수정
vim index.html

# 2. 테스트
./build.sh && npm run preview

# 3. 배포 (자동)
git add .
git commit -m "Update content"
git push
```

### 긴급 롤백
```bash
git revert HEAD
git push
```

---

## 문제 해결

| 문제 | 해결 |
|------|------|
| 빌드 실패 | Actions 탭에서 로그 확인 |
| 404 에러 | Settings → Pages → Source: GitHub Actions |
| CSS 안 보임 | vite.config.js base 경로 확인 |
| 이미지 안 보임 | 경로 확인, 캐시 삭제 |

상세: [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md#트러블슈팅)

---

## 추가 리소스

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Vite 공식 문서](https://vite.dev/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

**배포 시스템 버전**: 1.0.0
**최종 업데이트**: 2025-10-18
**기술 스택**: Vite 5.4.20 + GitHub Actions + GitHub Pages

Happy Deploying! 💒🚀
