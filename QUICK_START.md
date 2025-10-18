# ⚡ 빠른 시작 가이드

## 5분 안에 배포하기

### 1️⃣ 저장소 준비 (1분)

```bash
# 프로젝트 디렉토리로 이동
cd /Users/changbum/workplace/wedding_invitation

# Git 초기화 (이미 되어 있으면 스킵)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "feat: initial wedding invitation website"
```

### 2️⃣ GitHub에 푸시 (2분)

```bash
# GitHub에서 새 저장소 생성
# URL: https://github.com/new
# Repository name: wedding-invitation

# 원격 저장소 연결
git remote add origin https://github.com/yourusername/wedding-invitation.git

# 푸시
git branch -M main
git push -u origin main
```

### 3️⃣ GitHub Pages 활성화 (1분)

1. GitHub 저장소 페이지로 이동
2. **Settings** → **Pages** 클릭
3. **Source**: `GitHub Actions` 선택
4. 1-2분 대기

### 4️⃣ 완료! (1분)

```
✅ 배포 완료!
🌐 URL: https://yourusername.github.io/wedding-invitation/
```

---

## 로컬 개발

### 방법 1: 기존 설정 (Vite)

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 브라우저 자동 열림: http://localhost:5173
```

### 방법 2: 정적 파일 서버

```bash
# http-server 설치 (한 번만)
npm install -g http-server

# 서버 실행
http-server . -p 8080 -o

# 브라우저 자동 열림: http://localhost:8080
```

---

## 실제 정보 입력

### 1. 결혼식 정보 수정

`index.html` 또는 `index_new.html` 파일 열기:

```html
<!-- 이름 수정 -->
<h1 class="names">
    <span>신랑이름</span> ♥ <span>신부이름</span>
</h1>

<!-- 날짜/장소 수정 -->
<p class="date">
    <time datetime="2025-12-25T14:00:00+09:00">
        2025년 12월 25일 토요일 오후 2시
    </time>
</p>
<p class="location">서울 강남구 역삼동 웨딩홀</p>

<!-- 연락처 수정 -->
<a href="tel:01012345678">전화하기</a>
```

### 2. 부모님 정보 수정

```html
<p>
    <strong>신랑측</strong> 아버지 홍길동 · 어머니 이순신<br>
    <strong style="margin-left: 3rem;">의 장남</strong> <span>홍철수</span>
</p>
<p style="margin-top: 1rem;">
    <strong>신부측</strong> 아버지 김철수 · 어머니 박영희<br>
    <strong style="margin-left: 3rem;">의 장녀</strong> <span>김영희</span>
</p>
```

### 3. 지도 API 연동 (선택)

```bash
# 1. Kakao Developers에서 API 키 발급
# https://developers.kakao.com/

# 2. .env 파일 생성
echo "VITE_KAKAO_MAP_API_KEY=your_api_key_here" > .env

# 3. index.html에서 주석 해제
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KEY"></script>
```

---

## 이미지 추가

### 1. 이미지 준비

```bash
# 이미지를 public/images/ 폴더에 추가
public/images/
├── hero.jpg           # 메인 비주얼
├── gallery/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.jpg
└── icons/
    ├── icon-192x192.png
    └── icon-512x512.png
```

### 2. HTML에 추가

```html
<!-- 갤러리 섹션 활성화 -->
<section aria-labelledby="gallery-title">
    <h2 id="gallery-title" class="section-title">갤러리</h2>
    <div class="gallery-grid">
        <div class="gallery-item">
            <img src="/public/images/gallery/photo1.jpg" alt="사진 1" loading="lazy">
        </div>
        <!-- 더 추가 -->
    </div>
</section>
```

---

## 배포 및 업데이트

### 변경사항 푸시

```bash
# 변경사항 추가
git add .

# 커밋
git commit -m "update: wedding details"

# 푸시 (자동 배포)
git push origin main

# GitHub Actions가 자동으로 배포 (1-2분 소요)
```

### 배포 확인

```bash
# GitHub Actions 탭에서 배포 상태 확인
# https://github.com/yourusername/wedding-invitation/actions

# 초록색 체크 = 배포 성공
# URL: https://yourusername.github.io/wedding-invitation/
```

---

## 자주 묻는 질문 (FAQ)

### Q1: 배포 후 404 에러가 나요
```bash
# Settings → Pages에서 Source 확인
# GitHub Actions로 설정되어 있는지 확인
```

### Q2: CSS/JS 파일이 로드되지 않아요
```javascript
// vite.config.js 수정
export default {
  base: '/wedding-invitation/', // 저장소 이름과 일치
}
```

### Q3: 이미지가 안 보여요
```bash
# 경로 확인 (절대 경로 사용)
/public/images/hero.jpg  (O)
./images/hero.jpg        (X)
```

### Q4: 모바일에서 안 보여요
```html
<!-- viewport 메타태그 확인 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 체크리스트

### 배포 전
- [ ] 이름, 날짜, 장소 확인
- [ ] 전화번호 확인
- [ ] 로컬에서 테스트 (`npm run dev`)
- [ ] 이미지 추가 및 최적화
- [ ] Git 커밋 및 푸시

### 배포 후
- [ ] 배포 URL 접속 확인
- [ ] 모바일 반응형 확인
- [ ] 전화/문자 링크 동작 확인
- [ ] RSVP 폼 테스트
- [ ] 카카오톡/페이스북 공유 테스트

---

## 다음 단계

1. 📖 **상세 가이드**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. 📊 **개발 로그**: [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)
3. 🖼️ **이미지 최적화**: [public/images/README.md](./public/images/README.md)

---

## 긴급 지원

문제가 발생하면 GitHub Issues에 등록하세요:
```
https://github.com/yourusername/wedding-invitation/issues
```

---

**🎉 축하합니다! 이제 당신만의 결혼식 초대장이 완성되었습니다!**

Made with ❤️ | Powered by GitHub Pages
