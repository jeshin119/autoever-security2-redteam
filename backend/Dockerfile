# Backend Dockerfile for Vintage Market

FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필수 도구 설치
RUN apk update && apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# PM2를 글로벌로 설치 (프로세스 관리용)
RUN npm install -g pm2

# 소스 코드 복사
COPY . .

# 업로드 디렉토리 생성
RUN mkdir -p uploads logs

# 권한 설정
RUN chmod -R 755 uploads logs

# 포트 노출
EXPOSE 5000

# PM2 ecosystem 파일 복사
COPY ecosystem.config.js .

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# 개발환경에서는 nodemon, 프로덕션에서는 PM2 사용
CMD ["npm", "run", "dev"]