# Frontend Dockerfile for Vintage Market

FROM node:18-alpine as development

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

# 프로덕션 빌드 스테이지
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
# devDependencies를 포함한 모든 의존성 설치 (빌드에 필요)
RUN npm ci

COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM nginx:alpine as production

# 빌드된 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]