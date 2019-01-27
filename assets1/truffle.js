
//var HDWalletProvider = require("truffle-hdwallet-provider");

//var hdconfig = require("./hdconfig.json");

var mnemonic = "your mnemonic here";

//var mnemonic = hdconfig['mnemonic'];


// ropsten

var HDWalletProvider = require("truffle-hdwallet-provider");



//console.log(provider.getAddress());

//console.log(provider.wallet.getPrivateKey().toString('hex'));


/*
// ropsten netowrk
module.exports = {
    networks: {
      ropsten: {
        provider: function() {
          return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/NQdYsmeXBUG9mtOwUtUH")
        },
        gas: 4600000,
        network_id: 3
      }
    }
  };

*/



module.exports = {

    networks: {


        ropsten: {
            provider: function() {
              return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/yourinfuraidhere")
            },
            gas: 4600000,
            network_id: 3
        },

        mainnet: {
            provider: function() {
              return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/yourinfuraidhere")
            },
            gas: 4712388,
            gasPrice: 40000000000,
            network_id: 1
        },
        development: {

            confirmationBlocks: 0,

            host: "localhost",

            port: 8545,
            gas: 9000000000,

            network_id: "*" // Match any network id

        },


        ropsten_geth: {

            host: "localhost",

            port: 9545,
            gas: 9000000000,

            network_id: 3

        }

    }

};
