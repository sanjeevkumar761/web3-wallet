pipeline {
  agent any
  stages {
    stage('deploy') {
      steps {
        sh '''ls ./kubeconfig
docker build --tag web3wallet:${BUILD_NUMBER} .
docker tag web3wallet:${BUILD_NUMBER} saneevkumar761/web3wallet:${BUILD_NUMBER}
docker login docker.io -u ${DOCKERHUB_USER} -p ${DOCKERHUB_PASSWORD}
docker push saneevkumar761/web3wallet:${BUILD_NUMBER}'''
        sh 'kubectl get all'
        sh '''helm list
helm uninstall web3wallet
helm install web3wallet ./helm-chart --set env.CLIENT_ID=${CLIENT_ID} --set env.CLIENT_SECRET=${CLIENT_SECRET} --set env.VAULT_URI=${VAULT_URI} --set env.REDISCACHEHOSTNAME=${REDISCACHEHOSTNAME} --set env.REDISCACHEKEY=${REDISCACHEKEY}
sleep 20
export serviceLBIP=$(kubectl get services web3wallet-helm-chart  --output jsonpath=\'{.status.loadBalancer.ingress[0].ip}\')
lt --port 4000 --local-host $serviceLBIP > localtunnel.log &
sleep 5
cat ./localtunnel.log
'''
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
    KUBECONFIG = './kubeconfig'
  }
}