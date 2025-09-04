# Vintage Market 실행 가이드

## 🚨 중요: macOS 포트 충돌 해결
macOS Monterey 이상에서는 ControlCenter가 포트 5000을 사용합니다. 
따라서 백엔드를 포트 5001에서 실행하도록 설정했습니다.

## 방법 1: Docker로 실행하기 (권장)

### 사전 준비
```bash
# 기존 Docker 컨테이너 정리
docker-compose down
docker system prune -f

# 포트 사용 확인
lsof -i :5000  # ControlCenter가 사용 중일 것임
lsof -i :5001  # 비어있어야 함
lsof -i :3000  # 비어있어야 함
```

### Docker 실행
```bash
# 프로덕션 스타일 빌드로 실행 (권장)
docker-compose -f docker-compose-prod.yml up -d --build

# 로그 확인
docker-compose -f docker-compose-prod.yml logs -f

# 상태 확인
docker-compose -f docker-compose-prod.yml ps
```

### 접속 URL
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- phpMyAdmin: http://localhost:8080
  - Username: root
  - Password: rootpassword

## 방법 2: 로컬에서 직접 실행하기

### 1. 터미널 1 - Backend 실행
```bash
cd backend

# 환경변수 확인 (.env 파일)
# PORT=5001이 설정되어 있는지 확인

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

### 2. 터미널 2 - Frontend 실행
```bash
cd frontend

# 의존성 설치 (처음 한 번만)
npm install

# vite.config.js 확인
# proxy target이 http://localhost:5001로 설정되어 있는지 확인

# 개발 서버 실행
npm run dev
```

### 접속 URL
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api

## 방법 3: PM2로 실행하기

### PM2 설치
```bash
npm install -g pm2
```

### 실행
```bash
# Backend 실행
cd backend
pm2 start ecosystem.config.js

# Frontend 실행
cd ../frontend
pm2 start ecosystem.config.js

# 상태 확인
pm2 status

# 로그 확인
pm2 logs --nostream
```

## 🔧 문제 해결

### 1. 프론트엔드가 빈 화면일 때
```bash
# Frontend 디렉토리에서
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
npm run dev
```

### 2. API 연결이 안 될 때
- `frontend/vite.config.js`의 proxy 설정 확인
- `backend/.env`의 PORT 설정 확인
- 백엔드가 5001 포트에서 실행 중인지 확인

### 3. Docker 실행 오류
```bash
# 모든 컨테이너 중지 및 삭제
docker-compose down -v
docker system prune -a

# 다시 빌드 및 실행
docker-compose -f docker-compose-prod.yml up -d --build
```

### 4. 포트 충돌 오류
```bash
# 사용 중인 프로세스 확인
lsof -i :5001
lsof -i :3000

# 필요시 프로세스 종료
kill -9 [PID]

# PM2 프로세스 확인 및 종료
pm2 list
pm2 delete all
```

## 📝 설정 파일 위치
- Backend 포트 설정: `backend/.env` (PORT=5001)
- Frontend 프록시 설정: `frontend/vite.config.js` (target: 'http://localhost:5001')
- Docker 포트 매핑: `docker-compose-prod.yml` (ports: "5001:5000")
- PM2 설정: `backend/ecosystem.config.js`, `frontend/ecosystem.config.js`

## 🔐 보안 취약점 (교육 목적)
이 프로젝트는 보안 교육 목적으로 의도적인 취약점이 포함되어 있습니다:
- SQL Injection
- XSS (Cross-Site Scripting)
- 약한 인증
- 기타 OWASP Top 10 취약점들

**주의: 실제 운영 환경에서는 절대 사용하지 마세요!**

## 데이터베이스 초기 계정
- 관리자: admin@vintage.com / admin123
- 테스트 사용자: user1@test.com / password123

## 지원
문제가 지속되면 다음을 확인하세요:
1. Node.js 버전 (18.x 이상)
2. npm 버전 (최신 버전)
3. Docker Desktop 실행 여부
4. 포트 충돌 여부