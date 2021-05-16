const express = require("express");
const BIP39 = require("bip39");
const WalletEthers = require("ethers");
var redis = require("redis");
var bluebird = require("bluebird");
const JSONdb = require('simple-json-db');

require('dotenv').config();

//AKV Node.js tutorial here https://medium.com/@ayanfecrown/azure-key-vault-node-js-step-by-step-tutorial-af131a78e220#:~:text=%20Azure%20Key%20Vault%20Node.js%20Step%20by%20Step,Authentication.%20%206%20Complete%20Code.%20%20More%20
var KeyVault = require('azure-keyvault');
var AuthenticationContext = require('adal-node').AuthenticationContext;
var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
var vaultUri = process.env.VAULT_URI;
var redisCacheHostName = process.env.REDISCACHEHOSTNAME;
var redisCacheKey = process.env.REDISCACHEKEY;

const app = express();
const port = 8080;

app.use(express.static('src'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//console.log(process.env.RPC_URL);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//inputs: email 
app.post('/createaccount', (req, res) => {
    var email = req.body.email;
    var chain = req.body.chain;
    console.log(email);
    createAccount(chain, email, res);
})

app.post('/loginwithemail', (req, res) => {

})

const createAccount = async (chain, email, res) => {
    var mnemonic = BIP39.generateMnemonic();
    const wallet = WalletEthers.Wallet.fromMnemonic(mnemonic);
    //console.log(wallet.address);
    
    //console.log(wallet.privateKey); //Don't print it

    var authenticator = function (challenge, callback) {
        // Create a new authentication context.
        var context = new AuthenticationContext(challenge.authorization);
        // Use the context to acquire an authentication token.
        return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function (err, tokenResponse) {
        if (err) throw err;
        // Calculate the value to be set in the request's Authorization header and resume the call.
        var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
        return callback(null, authorizationValue);
        });
    };

    var credentials = new KeyVault.KeyVaultCredentials(authenticator);
    var client = new KeyVault.KeyVaultClient(credentials);


    let secretName = wallet.address,
        value = mnemonic,
        optionsopt = {
            contentType: 'json',
            // tags: 'sometag',
            // secretAttributes: 'someAttributes',
            // contentType: 'sometype',
            // customHeaders: 'customHeaders'
        };
    client.setSecret(vaultUri, secretName, value, optionsopt).then((results) => {
        //console.log(results);
        //Save email and address in DB/REdis Cache
        var chainAndAddress = {
            "chain": chain,
            "address": wallet.address
        }
        setEmailwithAddress(email, JSON.stringify(chainAndAddress));

        //Send confirmation email to user

        res.json({"chain": chain, "address": wallet.address, "mnemonic": mnemonic});
    })
}

const loginWithEmail = async (email, res) => {

}

async function setEmailwithAddress(email, chainAndAddress) {

    // Connect to the Azure Cache for Redis over the TLS port using the key.
    var cacheConnection = redis.createClient(6380, redisCacheHostName, 
        {auth_pass: redisCacheKey, tls: {servername: redisCacheHostName}});
        
    // Perform cache operations using the cache connection object...

    // Simple PING command
    console.log("\nCache command: PING");
    console.log("Cache response : " + await cacheConnection.pingAsync());

    console.log("\nCache command: SET Message");
    console.log("Cache response : " + await cacheConnection.setAsync(email,
        chainAndAddress));    

    // Simple get and put of integral data types into the cache
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await cacheConnection.getAsync(email));  
  
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})