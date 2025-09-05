# Frontend Dockerfile for Vintage Market

# Development stage
FROM node:10.13.0-alpine as development

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 개발 서버 실행
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM node:10.13.0-alpine as build

WORKDIR /app

COPY package*.json ./
# devDependencies를 포함한 모든 의존성 설치 (빌드에 필요)
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production

# 빌드된 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx 설정은 이미 5173 포트로 설정되어 있음

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]