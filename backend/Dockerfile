FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive

# 🔑 Use default Ubuntu repositories which support multi-architecture
RUN for i in 1 2 3; do \
        apt-get update && \
        apt-get install -y --fix-missing \
            curl \
            sudo \
            python3 \
            build-essential && \
        break || sleep 10; \
    done && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m server && \
    echo "server:123456" | chpasswd && \
    echo 'server ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER server
WORKDIR /home/server/app

ENV NODE_VERSION=10.13.0
ENV NVM_DIR=/home/server/.nvm
RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
ENV NODE_PATH=$NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN bash -c "source $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default"

# root로 다시 전환하여 권한 설정
USER root
# package.json과 package-lock.json을 먼저 복사
COPY --chown=server:server package*.json ./

# 디렉토리 권한 설정 (root 권한으로 실행)
RUN chown -R server:server /home/server/app
RUN chmod -R 755 /home/server/app

# server 사용자로 npm install 실행
USER server
RUN npm install

# root로 다시 전환하여 파일 복사
USER root
# 나머지 소스 코드 복사 (.dockerignore에 의해 node_modules는 제외됨)
COPY --chown=server:server . .

# server 사용자로 다시 전환
USER server
RUN mkdir -p uploads logs
RUN chmod -R 755 uploads logs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["npm", "run", "dev"]
