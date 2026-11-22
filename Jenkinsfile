pipeline {
    agent any

    options {
        timestamps()
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
    }

    post {
        always {
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