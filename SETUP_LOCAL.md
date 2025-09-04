# 로컬 환경 설정 가이드

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
# 루트 디렉토리에서 실행
npm run setup
```

### 2. 개발 서버 시작
```bash
npm run dev
```

## 📝 상세 설정

### 필수 요구사항
- Node.js >= 18.0.0
- npm >= 8.0.0

### 단계별 설정

1. **프로젝트 클론**
   ```bash
   git clone https://github.com/godori1012/AutoEver_PJ3_Secondhand-application.git
   cd AutoEver_PJ3_Secondhand-application
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   npm run setup:env
   ```

4. **데이터베이스 초기화**
   ```bash
   npm run setup:db
   ```

5. **개발 서버 시작**
   ```bash
   npm run dev
   ```

## 🔧 문제 해결

### wait-on 모듈 에러
```bash
# 만약 wait-on 관련 에러가 발생하면:
npm install wait-on --save-dev
```

### 포트 충돌 문제
```bash
# 포트 정리
npm run port:clean

# 포트 확인
npm run port:check
```

### 데이터베이스 초기화
```bash
# 데이터베이스 리셋
npm run db:reset
```

## 📱 서비스 접속

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

## 🎯 주요 기능

### 페이지별 기능
1. **중고거래** (`/products`) - 상품 거래 플랫폼
2. **동네생활** (`/community`) - 지역 커뮤니티 소식
3. **부동산** (`/realestate`) - 부동산 매물 정보
4. **알바** (`/jobs`) - 아르바이트 구인구직

### 테스트 계정
- user1@test.com / password123
- user2@test.com / password123
- seller@marketplace.com / password123
- buyer@shop.com / password123
- admin@admin.com / admin123