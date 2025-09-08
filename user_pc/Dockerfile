# ./user_pc/Dockerfile

# Ubuntu 20.04 이미지를 기반으로 합니다.
FROM ubuntu:20.04

# Non-interactive 모드로 설정하여 패키지 설치 시 대화형 프롬프트를 비활성화합니다.
ENV DEBIAN_FRONTEND=noninteractive

# 일반적인 사용자 PC에 있을 법한 기본 도구들을 설치합니다.
RUN apt-get update && apt-get install -y ca-certificates && \
    sed -i 's/archive.ubuntu.com/kr.archive.ubuntu.com/g' /etc/apt/sources.list && \
    sed -i 's/http:\/\//https:\/\//g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y \
        sudo \
        curl \
        wget \
        net-tools \
        iputils-ping \
        vim \
        git \
        openssh-server \
        netcat \
        dnsutils && \
    rm -rf /var/lib/apt/lists/*

# 'devuser'라는 일반 사용자 계정을 생성하고, sudo 그룹에 추가합니다.
RUN useradd -m -s /bin/bash devuser && \
    echo "devuser:password" | chpasswd && \
    adduser devuser sudo

# 공격자를 유인하기 위한 '미끼' 파일 및 디렉토리 생성
USER devuser
WORKDIR /home/devuser
RUN mkdir -p /home/devuser/documents/confidential
RUN echo "Jenkins_admin_password_backup: jenkins_backup_!@#$" > /home/devuser/documents/memo.txt
RUN echo "DB_SERVER_IP: 172.21.0.20" > /home/devuser/documents/server_info.txt
