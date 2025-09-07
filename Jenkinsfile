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
                echo 'Building Docker Images for Production...'
                
                // 프로덕션 환경변수 설정
                sh '''
                    echo "NODE_ENV=production" > .env
                    echo "VITE_API_URL=http://192.168.201.102:3001/api" >> .env
                    echo "REACT_APP_API_URL=http://192.168.201.102:3001/api" >> .env
                    echo "REACT_APP_BACKEND_URL=http://192.168.201.102:3001" >> .env
                    echo "FRONTEND_URL=http://192.168.201.102:5173" >> .env
                    echo "BACKEND_BASE_URL=http://192.168.201.102:3001" >> .env
                    echo "DB_HOST=vintage-market-mysql" >> .env
                    echo "DB_NAME=vintagemarket" >> .env
                    echo "DB_USER=vintage_user" >> .env
                    echo "DB_PASSWORD=vintage_password" >> .env
                    echo "MYSQL_ROOT_PASSWORD=root_password" >> .env
                    echo "MYSQL_DATABASE=vintagemarket" >> .env
                    echo "FRONTEND_PORT=5173" >> .env
                    echo "BACKEND_PORT=3001" >> .env
                    echo "PMA_PORT=8081" >> .env
                    echo "PMA_ABSOLUTE_URI=http://192.168.201.102:8081/" >> .env
                    echo "JWT_SECRET=prod-jwt-secret-key" >> .env
                    echo "SESSION_SECRET=prod-session-secret-key" >> .env
                '''
                
                // 프로덕션 모드로 빌드
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml build'
            }
        }
                //  // 캐시를 무시하고 새로 빌드
                //  sh 'docker compose build --no-cache --pull database'
                //  sh 'docker compose build --no-cache --pull backend'
                //  sh 'docker compose build --no-cache --pull frontend'
        stage('Deploy') {
            steps {
                echo 'Deploying to Production...'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml down'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d'
                sh 'echo "Production deployment complete."'
            }
        }
    }
}