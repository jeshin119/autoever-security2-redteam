pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'mitre-project'
    }

    stages {
        // 이 디버깅 단계를 추가했습니다.
        stage('Debug Workspace') {
            steps {
                echo 'Listing all files in the workspace...'
                // 작업 공간의 모든 파일 목록을 자세히 출력합니다.
                // 이 결과를 보면 package.json 파일의 존재 여부와 위치를 알 수 있습니다.
                sh 'ls -al'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker Image...'
                sh 'docker compose build backend frontend database'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy stage: Pretending to deploy the application...'
                sh 'docker compose down backend'
                sh 'docker compose down frontend'
                sh 'docker compose up backend -d'
                sh 'docker compose up frontend -d'
                //sh 'docker compose exec backend node src/scripts/seedData.js'
                sh 'echo "Deployment complete."'
            }
        }
    }
}