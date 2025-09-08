# Jenkins 공식 Long-Term Support 버전을 기반으로 합니다.
FROM jenkins/jenkins:lts-jdk11

# 패키지 설치를 위해 사용자를 root로 전환합니다.
USER root

# CI/CD 파이프라인에 필요한 도구들을 설치합니다.
# git: Gitea에서 소스 코드를 가져오기 위해
# docker-ce-cli: Docker 이미지를 빌드하고 컨테이너를 실행/관리하기 위해
RUN for i in 1 2 3; do \
        apt-get update && \
        apt-get install -y --fix-missing apt-transport-https ca-certificates curl gnupg-agent software-properties-common && \
        break || sleep 10; \
    done && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
    for i in 1 2 3; do \
        apt-get update && \
        apt-get install -y --fix-missing git docker-ce-cli && \
        break || sleep 10; \
    done

# Docker BuildKit 설정을 위한 환경 변수 추가
ENV DOCKER_BUILDKIT=1
ENV BUILDKIT_PROGRESS=plain

# 보안을 위해 다시 jenkins 사용자로 전환합니다.
USER jenkins