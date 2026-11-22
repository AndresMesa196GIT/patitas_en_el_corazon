pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        COMPOSE_CI = 'docker compose -p ci -f docker-compose.yml -f docker-compose.ci.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                withCredentials([file(credentialsId: 'patitas-env', variable: 'ENV_FILE')]) {
                    sh 'cp "$ENV_FILE" .env'
                    sh 'docker compose build'
                }
            }
        }

        stage('Test') {
            steps {
                sh '$COMPOSE_CI up -d --build --wait'
                sh 'sh tests/test_comunicacion.sh'
            }
        }
    }

    post {
        always {
            sh '$COMPOSE_CI logs --tail=30 || true'
            sh '$COMPOSE_CI down -v || true'
            sh 'rm -f .env'
        }
        success {
            echo 'Pipeline completado correctamente'
        }
        failure {
            echo 'El pipeline fallo'
        }
    }
}