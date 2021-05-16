pipeline {
  agent any
  stages {
    stage('deploy') {
      steps {
        sh '''git checkout -b main
docker build --tag web3wallet:latest .'''
      }
    }

  }
}