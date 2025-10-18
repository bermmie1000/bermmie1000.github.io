# GitHub Pages 설정 가이드

## Repository Settings에서 설정하는 방법

### 1단계: Repository Settings 접속

```
https://github.com/YOUR_USERNAME/wedding-invitation/settings
```

또는

```
Repository 메인 페이지 → Settings 탭 클릭
```

---

### 2단계: Pages 메뉴 접속

좌측 사이드바에서:
```
Settings → Pages
```

또는 직접 URL:
```
https://github.com/YOUR_USERNAME/wedding-invitation/settings/pages
```

---

### 3단계: Build and deployment 설정

#### Source 선택

**중요**: 반드시 **GitHub Actions** 를 선택해야 합니다!

```
┌─────────────────────────────────────────┐
│ Build and deployment                     │
├─────────────────────────────────────────┤
│ Source                                   │
│ ● GitHub Actions         ← 이것 선택!    │
│ ○ Deploy from a branch                   │
└─────────────────────────────────────────┘
```

#### ⚠️ 주의사항

- **"Deploy from a branch" 선택 시**: 오래된 방식, Jekyll 기반 빌드만 지원
- **"GitHub Actions" 선택 시**: 최신 방식, 커스텀 빌드 지원 (Vite, Next.js 등)

우리 프로젝트는 Vite 기반이므로 반드시 **GitHub Actions** 선택!

---

### 4단계: 자동 워크플로우 감지

"GitHub Actions"를 선택하면 자동으로 다음 메시지가 나타납니다:

```
┌────────────────────────────────────────────────┐
│ ✓ GitHub Actions                               │
│                                                 │
│ Using GitHub Actions, you can build and        │
│ deploy your site from a branch or using a      │
│ custom workflow.                                │
│                                                 │
│ Configure a publishing source:                 │
│ ✓ deploy.yml detected in .github/workflows    │
└────────────────────────────────────────────────┘
```

---

### 5단계: 배포 URL 확인

설정이 완료되고 첫 배포가 성공하면:

```
┌────────────────────────────────────────────────┐
│ 🟢 Your site is live at                        │
│ https://YOUR_USERNAME.github.io/wedding-inv...│
│                                                 │
│ Visit site ↗                                   │
└────────────────────────────────────────────────┘
```

---

## 커스텀 도메인 설정 (선택)

### Custom domain 섹션

```
┌─────────────────────────────────────────┐
│ Custom domain                            │
├─────────────────────────────────────────┤
│ www.your-wedding.com                     │
│ [ Save ]                                 │
│                                          │
│ ☑ Enforce HTTPS                         │
└─────────────────────────────────────────┘
```

#### 설정 방법

1. **도메인 입력**
   - Apex domain: `your-wedding.com`
   - 또는 서브도메인: `www.your-wedding.com`

2. **DNS 레코드 추가** (도메인 제공업체에서)

   **Apex domain (your-wedding.com)**:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

   **서브도메인 (www.your-wedding.com)**:
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```

3. **DNS check 대기**
   ```
   ⏳ DNS check in progress...
   ```

   성공 시:
   ```
   ✓ DNS check successful
   ```

4. **Enforce HTTPS 체크**
   - 반드시 체크하여 HTTPS 활성화
   - SSL 인증서 자동 발급 (Let's Encrypt)

---

## 환경(Environments) 확인

배포가 성공하면 자동으로 `github-pages` 환경이 생성됩니다.

### Environments 페이지 접속

```
Settings → Environments → github-pages
```

### 배포 히스토리 확인

```
┌───────────────────────────────────────────────┐
│ github-pages                                   │
├───────────────────────────────────────────────┤
│ Latest deployments                             │
│                                                │
│ ✓ Deploy to GitHub Pages                     │
│   main #1234567                               │
│   Deployed 2 minutes ago                      │
│                                                │
│ ✓ Deploy to GitHub Pages                     │
│   main #1234566                               │
│   Deployed 1 day ago                          │
└───────────────────────────────────────────────┘
```

---

## 문제 해결

### 🔴 "Build and deployment" 섹션이 보이지 않음

**원인**: GitHub Pages 기능이 비활성화됨

**해결**:
1. Repository가 **Public**인지 확인
2. Private repository는 GitHub Pro 계정 필요

---

### 🔴 "GitHub Actions" 옵션이 보이지 않음

**원인**: Organization repository이고 권한 부족

**해결**:
```
Organization Settings → Actions → General
→ Workflow permissions: Read and write permissions 체크
```

---

### 🔴 배포 성공했지만 404 에러

**원인**: Source 설정이 "Deploy from a branch"로 되어 있음

**해결**:
1. Settings → Pages로 이동
2. Source를 **GitHub Actions**로 변경
3. 저장 후 재배포 대기

---

### 🔴 커스텀 도메인 DNS check 실패

**원인**: DNS 레코드 설정 오류 또는 전파 대기 중

**해결**:
```bash
# DNS 전파 확인
dig your-wedding.com

# CNAME 확인
dig www.your-wedding.com CNAME

# 최대 24시간 대기
```

---

## 추가 설정 (선택)

### Branch protection rules

배포 브랜치 보호:
```
Settings → Branches → Add branch protection rule
```

권장 설정:
- ☑ Require a pull request before merging
- ☑ Require status checks to pass before merging
  - 체크할 워크플로우: `build`

---

### Secrets 설정 (필요 시)

환경 변수가 필요한 경우:
```
Settings → Secrets and variables → Actions
→ New repository secret
```

예시:
```
Name: ANALYTICS_ID
Secret: UA-123456789-1
```

워크플로우에서 사용:
```yaml
- name: Build with analytics
  env:
    VITE_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
  run: npm run build
```

---

## 체크리스트

배포 전 최종 확인:

```
□ Settings → Pages 접속
□ Source: GitHub Actions 선택
□ 첫 push 완료 (워크플로우 실행 확인)
□ Actions 탭에서 배포 성공 확인
□ 배포 URL 정상 접속 확인
□ HTTPS 적용 확인 (자물쇠 아이콘)
□ 모바일 테스트 완료
```

커스텀 도메인 사용 시:
```
□ DNS A 레코드 추가
□ DNS CNAME 레코드 추가
□ Settings → Pages → Custom domain 입력
□ DNS check 통과 확인
□ Enforce HTTPS 체크
□ SSL 인증서 발급 대기 (최대 24시간)
□ HTTPS로 접속 확인
```

---

## 참고 자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Custom workflows 가이드](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [커스텀 도메인 설정](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

**설정 완료! 이제 자동 배포가 작동합니다! 🚀**
