pipeline {
  agent any
  stages {
    stage('deploy') {
      steps {
        sh 'docker build --tag web3wallet:latest .'
      }
    }

  }
}