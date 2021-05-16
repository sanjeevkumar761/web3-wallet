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
  environment {
    DOCKERHUB_USER = 'saneevkumar761'
    DOCKERHUB_PASSWORD = 'Hdwj#10590'
    CLIENT_ID = '7a0f5345-7b41-41ad-b68f-a3387579cf5f'
    CLIENT_SECRET = 'I_r_0I3ou3R8cpEf-mYkQ-meKcpQJw6J.0'
    VAULT_URI = 'https://newwalletkv.vault.azure.net/'
    REDISCACHEHOSTNAME = 'emailtoaddress.redis.cache.windows.net'
    REDISCACHEKEY = 'EPpwtl9TkiZJxm8Ahrvi1bapddfkIQPlDDOhpIxet28='
  }
}