pipeline {
  agent any
  stages {
    stage('deploy') {
      steps {
        sh '''docker build --tag web3wallet:latest .
docker tag web3wallet:latest saneevkumar761/web3wallet:latest
docker login docker.io -u ${DOCKERHUB_USER} -p ${DOCKERHUB_PASSWORD}
docker push saneevkumar761/web3wallet:latest'''
      }
    }

  }
}