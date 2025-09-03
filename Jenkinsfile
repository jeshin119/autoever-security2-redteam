// Jenkinsfile 예제
pipeline {
    agent any // 어떤 Jenkins 에이전트에서든 실행 가능

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from Gitea...'
                // Jenkins가 Gitea 저장소에서 코드를 가져옵니다.
                // YOUR_GITEA_USERNAME을 실제 Gitea 사용자 이름으로 변경하세요.
                git url: 'http://gitea-server:3000/team2/backend.git',
                    branch: 'main'
            }
        }
        stage('Build') {
            steps {
                echo 'Build stage: Pretending to build the application...'
                // 실제로는 여기에 'docker-compose build backend' 같은 명령어가 들어갑니다.
                docker compose build backend
                sh 'echo "Build complete."'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy stage: Pretending to deploy the application...'
                docker-compose up -d --force-recreate backend
                sh 'echo "Deployment complete."'
            }
        }
    }
}