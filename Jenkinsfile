pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'mitre-project'
        DOCKER_BUILDKIT = '0'  // Docker BuildKit 비활성화
        BUILDKIT_PROGRESS = 'plain'
    }

    stages {

        stage('Build') {
            steps {
                echo 'Building Docker Image...'
                // Load production environment variables
                sh 'cp .env.prod .env'
                // 현재 디렉토리 확인
                // sh 'pwd'
                // sh 'ls -la'
                
                // package.json 파일 존재 확인
                // sh 'test -f frontend/package.json && echo "Frontend package.json exists" || echo "Frontend package.json NOT FOUND"'
                // sh 'test -f backend/package.json && echo "Backend package.json exists" || echo "Backend package.json NOT FOUND"'
                
                // .dockerignore 파일 확인
                // sh 'test -f frontend/.dockerignore && echo "Frontend .dockerignore exists" || echo "Frontend .dockerignore NOT FOUND"'
                // sh 'test -f backend/.dockerignore && echo "Backend .dockerignore exists" || echo "Backend .dockerignore NOT FOUND"'
                
                // docker-compose.yml 파일 확인
                // sh 'test -f docker-compose.yml && echo "docker-compose.yml exists" || echo "docker-compose.yml NOT FOUND"'
                
                // Production 모드로 빌드 (Jenkins 자기 자신은 제외!)
                // 주의: Jenkins 컨테이너는 빌드하지 않음 (자기 자신을 죽이는 것 방지)
                // sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml build database'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml build backend'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml build frontend'
            }
        }
                //  // 캐시를 무시하고 새로 빌드
                //  sh 'docker compose build --no-cache --pull database'
                //  sh 'docker compose build --no-cache --pull backend'
                //  sh 'docker compose build --no-cache --pull frontend'
        stage('Deploy') {
            steps {
                echo 'Deploy stage: Deploying production application...'
                // 애플리케이션 서비스만 재배포 (Jenkins는 계속 실행 상태 유지)
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml down database'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml down backend'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml down frontend'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml up backend -d'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml up frontend -d'
                //sh 'docker compose exec backend node src/scripts/seedData.js'
                sh 'echo "Deployment complete."'
            }
        }
    }
}