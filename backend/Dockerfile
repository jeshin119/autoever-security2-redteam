# [2번 기반] 베이스 이미지로 Ubuntu 18.04를 사용합니다.
FROM ubuntu:18.04

# Docker 빌드 중 대화형 프롬프트가 뜨는 것을 방지합니다.
ENV DEBIAN_FRONTEND=noninteractive

# [1, 2번 결합] 시스템 패키지를 업데이트하고 필수 도구를 설치합니다.
# 1번의 python3, make, g++ (build-essential 패키지에 포함)와 2번의 curl, sudo를 설치합니다.
RUN apt-get update && apt-get install -y \
    curl \
    sudo \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# [2번 기반] 'server' 사용자를 생성하고 sudo 권한을 부여합니다.
# 보안을 위해 root 사용자가 아닌 별도의 사용자로 애플리케이션을 실행하는 것이 좋습니다.
RUN useradd -m server && \
    echo "server:123456" | chpasswd && \
    echo 'server ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# 생성된 'server' 사용자로 전환합니다.
USER server

# [1, 2번 결합] 작업 디렉토리를 'server' 사용자의 홈 디렉토리 아래에 설정합니다.
WORKDIR /home/server/app

# [2번 기반] nvm(Node Version Manager)을 설치하고 Node.js 버전을 지정합니다.
ENV NODE_VERSION=10.13.0
ENV NVM_DIR=/home/server/.nvm
RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 설치된 Node.js를 시스템 PATH에 추가하여 모든 셸에서 node와 npm 명령어를 바로 사용할 수 있도록 설정합니다.
ENV NODE_PATH=$NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# nvm을 사용하여 지정된 버전의 Node.js를 설치하고 기본값으로 설정합니다.
RUN bash -c "source $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default"

# --- 여기서부터 1번 Dockerfile의 애플리케이션 설정 부분을 따릅니다. ---

# [1번 기반] 패키지 파일 복사 (소유자를 'server' 사용자로 지정)
COPY --chown=server:server package*.json ./

# [1번 기반] 의존성 설치
RUN npm install

# [1번 기반] PM2를 글로벌로 설치 (프로세스 관리용)
RUN npm install -g pm2

# [1번 기반] 소스 코드 복사 (소유자를 'server' 사용자로 지정)
COPY --chown=server:server . .

# [1번 기반] 업로드 및 로그 디렉토리 생성
RUN mkdir -p uploads logs

# [1번 기반] 생성된 디렉토리에 권한 설정
RUN chmod -R 755 uploads logs

# [1번 기반] 포트 노출
EXPOSE 5000

# [1번 기반] PM2 ecosystem 파일 복사 (소유자를 'server' 사용자로 지정)
COPY --chown=server:server ecosystem.config.js .

# [1번 기반] 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# [1번 기반] 컨테이너 실행 명령어
CMD ["npm", "run", "dev"]