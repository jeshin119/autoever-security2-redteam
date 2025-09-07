pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'mitre-project'
        DOCKER_BUILDKIT = '0'
        BUILDKIT_PROGRESS = 'plain'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building Docker Images for Production...'
                sh 'cat > .env << EOF\nNODE_ENV=production\nVITE_API_URL=http://192.168.201.102:3001/api\nREACT_APP_API_URL=http://192.168.201.102:3001/api\nREACT_APP_BACKEND_URL=http://192.168.201.102:3001\nFRONTEND_URL=http://192.168.201.102:5173\nBACKEND_BASE_URL=http://192.168.201.102:3001\nDB_HOST=vintage-market-mysql\nDB_NAME=vintagemarket\nDB_USER=vintage_user\nDB_PASSWORD=vintage_password\nMYSQL_ROOT_PASSWORD=root_password\nMYSQL_DATABASE=vintagemarket\nEOF'
                sh 'docker compose -f docker-compose.yml -f docker-compose.prod.yml build'
            }
        }
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