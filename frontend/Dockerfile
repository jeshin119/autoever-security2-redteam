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

# 환경 변수를 빌드 시점에 전달하기 위한 ARG 선언
ARG REACT_APP_API_URL
ARG REACT_APP_BACKEND_URL
ARG VITE_API_URL

# 환경 변수 설정
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV VITE_API_URL=$VITE_API_URL

# 개발 서버 실행
EXPOSE 5173
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