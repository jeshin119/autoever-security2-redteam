FROM ubuntu:18.04
ENV DEBIAN_FRONTEND=noninteractive

# 🔑 Use default Ubuntu repositories which support multi-architecture
RUN apt-get update && apt-get install -y \
    curl \
    sudo \
    python3 \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

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

COPY --chown=server:server package*.json ./
RUN npm install
COPY --chown=server:server . .
RUN mkdir -p uploads logs
RUN chmod -R 755 uploads logs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["npm", "run", "dev"]
