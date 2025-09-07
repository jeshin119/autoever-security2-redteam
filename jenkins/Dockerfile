# Jenkins 공식 Long-Term Support 버전을 기반으로 합니다.
FROM jenkins/jenkins:lts-jdk11

# 패키지 설치를 위해 사용자를 root로 전환합니다.
USER root

# CI/CD 파이프라인에 필요한 도구들을 설치합니다.
# git: Gitea에서 소스 코드를 가져오기 위해
# docker-ce-cli: Docker 이미지를 빌드하고 컨테이너를 실행/관리하기 위해
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
    apt-get update && \
    apt-get install -y git docker-ce-cli

# 보안을 위해 다시 jenkins 사용자로 전환합니다.
USER jenkins