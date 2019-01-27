import AuthenticationContract from '../../build/contracts/Authentication.json'
import { loginUser } from './LoginButtonActions'
import store from '../store'
//import MobilityRegistryContract from '../../../../build/contracts/MobilityRegistry.json'

// for post calls 
import fetch from 'isomorphic-fetch';


const contract = require('truffle-contract')

export function signUpUser(name) {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance
      var mobilityInstance
      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance

          // Attempt to sign up user.
          authenticationInstance.signup(name, {from: coinbase})
          .then(function(result) {
            // If no error, login user.
            console.log(result)
            return dispatch(loginUser())
          })
          .catch(function(result) {
            // If error...
            console.log(result)
          })
        })

      })
   /* }  */
  } else {
    console.error('Web3 is not initialized.');
  }
}



/*
 *
 * 
 * 
 */
export function createUserPost(data) {
return fetch('http://localhost:4000/account', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    if (response.status >= 200 && response.status < 300) {
        return response;
        console.log(response);
        window.location.reload();
      } else {
       console.log('Somthing happened wrong');
      }
}).catch(err => err);
}
