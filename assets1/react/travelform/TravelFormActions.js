import AuthenticationContract from '../../build/contracts/Authentication.json'
import RideSharingContract from '../../build/contracts/RideSharing.json'

import store from '../store'


import React from 'react';
import ReactDOM from 'react-dom';

const contract = require('truffle-contract')

export const USER_UPDATED = 'USER_UPDATED'
function userUpdated(user) {
  return {
    type: USER_UPDATED,
    payload: user
  }
}

export function addTravel(id,price ,timestamp,updateTravelCb,deleteTravelCb) {

  //console.log('addTravel '+startCity +' ,' + endCity+' ,' + start+' ,' + nbPlaces+' ,' + price);


  //let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k"));

  let web3 = store.getState().web3.web3Instance
   web3.eth.defaultAccount = web3.eth.accounts[0];

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

   
      // Using truffle-contract we create the authentication object.
     // const authentication = contract(AuthenticationContract)

      /////const authentication =  web3.eth.contract(AuthenticationContract,'0x3661a5a703696eb2702f9feba51da416e97a39a2')

      //web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k'));
      //authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance
      var rideInstance
      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        //authentication.deployed().then(function(instance) {
        //  authenticationInstance = instance

          // Attempt to login user.
          //authenticationInstance.update(name, {from: coinbase})
          //const addresseRide =0xa1b1ed8bc61f5d4da6a0837594c71c6959816369;
          //var contract = web3.eth.contract(abi).at(contractAddress);
          
          //var ride = web3.eth.contract(RideSharingContract).at(addresseRide);
          //const ride =  web3.eth.contract(RideSharingContract,'0x736d3760f71a2b39a3cc48b666617026bc15bc68') ;     
          const ride = contract(RideSharingContract)
          ride.setProvider(web3.currentProvider)

          //ride.at(addresseRide).then(function(ins) {
            
          ride.deployed().then(function(ins) {
          rideInstance = ins;
            //var acar
            //acar = Car.new({from: coinbase},name,0,0,0);
          //alert('addr added!' + {from: coinbase})

         function updateTravel(address, id) {
           console.log('updateTravel id ='+id)
            let data  = {
                        'id': id,
                        'address':address
                       };
    
            $.ajax({
                method: 'PUT',
                url: '/api/updateInblockchainRequest/'+id+'/',
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                data: data,
                success: function (response) {
                  //let id = response.id;
                  //console.log('update travel id' +id);
                }
            })
      
          } 


          
          console.log('event');
            let processed = false;

            var addRideEvent = rideInstance.RidePublished({userCID: web3.eth.defaultAccount});
            //var instructorEvent = rideInstance.RidePublished();         
            console.log('callback');
            let callback = function(error, result){
                        let lastid = id;

                  if ( result)
                  {
                      console.log('event (addr='+result.args.userCID + ') , (id=' + result.args.rideId + ')');
                      
                      if( (Number(result.args.rideId) === lastid) && processed == false ){
                        console.log("before updateTravelDb");
                        processed = true;
                        updateTravel(result.args.userCID , Number(result.args.rideId));   
                        //deleteTravelCb(Number(result.args.rideId));
                        const element = <div className="resStatus">Travel added! thank you</div>;
                        ReactDOM.render(element, document.getElementById('resStatus'));
                      }
                      else{
                        console.log('old event');
                      }
                        
                  } else {
                      console.log('event'+error);    
                      const errmessage = 'reservation errors:'+error;
                      const element = '<div className="resStatus">'+errmessage+'</div>';
                      ReactDOM.render(element, document.getElementById('resStatus'));               
                  }
            }
             
             
            addRideEvent.watch(callback);    


           //let startDate = start/1000;
           //console.log('startDate:' +startDate+' start:'+start);
           let priceFinney = [];
           for (let k =0; k < price.length;k++)
           {
               console.log('inter'+price[k]);
                priceFinney[k] = web3.toWei(price[k], 'finney');
           }
           // let priceFinney = web3.toWei(price, 'finney');


            let timestampseconds = Math.round(timestamp/1000);
            console.log('addRide'+'id:'+id+'price:'+priceFinney+'timestamp:'+timestampseconds)
            return rideInstance.addRide( id,timestampseconds,priceFinney, {from: coinbase}).then(function(result) {
              //dispatch(userUpdated({"name": name}))
              //registerVehicle(name,{from: coinbase});
              console.log('travel added' + {from: coinbase});
              console.log('addr ' + web3.eth.defaultAccount);
              //updateTravelCb(id,web3.eth.defaultAccount);
              console.log('travel added result' +  JSON.stringify(result));

              return ;/* alert('travel added!' + JSON.stringify(result)) */
            })
            .catch(function(result) {
              console.log('travel dbg err'+result);
              ////deleteTravelCb(id);
              const errmessage = 'reservation errors:'+result;
              const element = '<div className="resStatus">'+errmessage+'</div>';
              ReactDOM.render(element, document.getElementById('resStatus'));    
              return alert('error travel added!' + 'addr '+ {from: coinbase} + 'res' + result)
            })
          
          })
        //})
      })
    
  } else {
    console.error('Web3 is not initialized.');
    const errmessage = 'check metamask plugin or your wallet account';
    const element = '<div className="resStatus">'+errmessage+'</div>';
    ReactDOM.render(element, document.getElementById('resStatus'));      
    deleteTravelCb(id);

  }
}



export function updateTravel(myid,timestampdate,updateTravelCb) 
{

  //let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k"));

  let web3 = store.getState().web3.web3Instance
  web3.eth.defaultAccount = web3.eth.accounts[0];

 // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    
      // Using truffle-contract we create the authentication object.
      // const authentication = contract(AuthenticationContract)

      /////const authentication =  web3.eth.contract(AuthenticationContract,'0x3661a5a703696eb2702f9feba51da416e97a39a2')

      //web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k'));
      //authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance
      var rideInstance
      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        //authentication.deployed().then(function(instance) {
        //  authenticationInstance = instance

          // Attempt to login user.
          //authenticationInstance.update(name, {from: coinbase})
          //const addresseRide =0xa1b1ed8bc61f5d4da6a0837594c71c6959816369;
          //var contract = web3.eth.contract(abi).at(contractAddress);
          
          //var ride = web3.eth.contract(RideSharingContract).at(addresseRide);
          //const ride =  web3.eth.contract(RideSharingContract,'0x736d3760f71a2b39a3cc48b666617026bc15bc68') ;     
          const ride = contract(RideSharingContract)
          ride.setProvider(web3.currentProvider)

          //ride.at(addresseRide).then(function(ins) {
            
          ride.deployed().then(function(ins) {
          rideInstance = ins;
            //var acar
            //acar = Car.new({from: coinbase},name,0,0,0);
          //alert('addr added!' + {from: coinbase})

          function updateTravel(address, id) {
            console.log('updateTravel id ='+id)
            let data  = {
                        'id': id,
                        'address':address
                        };
    
            $.ajax({
                method: 'PUT',
                url: '/api/updateInblockchainRequest/'+id+'/',
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                data: data,
                success: function (response) {
                  //let id = response.id;
                  //console.log('update travel id' +id);
                }
            })
      
          } 


          
          console.log('event');
            let processed = false;

            var addRideEvent = rideInstance.RidePublished({userCID: web3.eth.defaultAccount});
            //var instructorEvent = rideInstance.RidePublished();         
            console.log('callback');
            let callback = function(error, result){
                        let lastid = id;

                  if ( result)
                  {
                      console.log('event (addr='+result.args.userCID + ') , (id=' + result.args.rideId + ')');
                      
                      if( (Number(result.args.rideId) === lastid) && processed == false ){
                        console.log("before updateTravelDb");
                        processed = true;
                        updateTravel(result.args.userCID , Number(result.args.rideId));   
                        //deleteTravelCb(Number(result.args.rideId));
                        const element = <div className="resStatus">Travel added! thank you</div>;
                        ReactDOM.render(element, document.getElementById('resStatus'));
                      }
                      else{
                        console.log('old event');
                      }
                        
                  } else {
                      console.log('event'+error);    
                      const errmessage = 'reservation errors:'+error;
                      const element = '<div className="resStatus">'+errmessage+'</div>';
                      ReactDOM.render(element, document.getElementById('resStatus'));               
                  }
            }
              
              
            addRideEvent.watch(callback);    


            //let startDate = start/1000;
            //console.log('startDate:' +startDate+' start:'+start);
            let priceFinney = [];
            for (let k =0; k < price.length;k++)
            {
                console.log('inter'+price[k]);
                priceFinney[k] = web3.toWei(price[k], 'finney');
            }
            // let priceFinney = web3.toWei(price, 'finney');


            let timestampseconds = Math.round(timestamp/1000);
            console.log('addRide'+'id:'+id+'price:'+priceFinney+'timestamp:'+timestampseconds)
            return rideInstance.addRide( id,timestampseconds,priceFinney, {from: coinbase}).then(function(result) {
              //dispatch(userUpdated({"name": name}))
              //registerVehicle(name,{from: coinbase});
              console.log('travel added' + {from: coinbase});
              console.log('addr ' + web3.eth.defaultAccount);
              //updateTravelCb(id,web3.eth.defaultAccount);
              console.log('travel added result' +  JSON.stringify(result));

              return ;/* alert('travel added!' + JSON.stringify(result)) */
            })
            .catch(function(result) {
              console.log('travel dbg err'+result);
              ////deleteTravelCb(id);
              const errmessage = 'reservation errors:'+result;
              const element = '<div className="resStatus">'+errmessage+'</div>';
              ReactDOM.render(element, document.getElementById('resStatus'));    
              return alert('error travel added!' + 'addr '+ {from: coinbase} + 'res' + result)
            })
          
          })
        //})
      })
    
  } else {
    console.error('Web3 is not initialized.');
    const errmessage = 'check metamask plugin or your wallet account';
    const element = '<div className="resStatus">'+errmessage+'</div>';
    ReactDOM.render(element, document.getElementById('resStatus'));      
    deleteTravelCb(id);

 }

}

  /*
* Interact with blockchain and list travel from there
*
*/
export function listTravels(object) {

  let web3 = store.getState().web3.web3Instance
  //let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k")); 
   web3.eth.defaultAccount = web3.eth.accounts[0];

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance
      var rideInstance
      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance

          // Attempt to login user.
          //authenticationInstance.update(name, {from: coinbase})
          const ride = contract(RideSharingContract)
          ride.setProvider(web3.currentProvider)

          ride.deployed().then(function(ins) {
            rideInstance = ins;
            //var acar
            //acar = Car.new({from: coinbase},name,0,0,0);
         //alert('addr added!' + {from: coinbase})

    
           return rideInstance.getNumberOfRsv.call( {from: coinbase,gas:80000});

          }).then(function(result) {
              //dispatch(userUpdated({"name": name}))
              //registerVehicle(name,{from: coinbase});
              console.log('ride '+ JSON.stringify(result));
              var ride = result.toString().split(',');
              //document.getElementById('cars').value= web3.toAscii(car[0]);
              //web3.toAscii(car[0])
              console.log("length success" + web3.toAscii(ride[0]) + 'res' + web3.toAscii(ride[1]));

              object.setState({depart :  web3.toAscii(ride[2]) })
              return  
            })
            .catch(function(result) {
              console.log('length error '+ (result));
              return 
            })
          
          
        })
      })
    
  } else {
    console.error('Web3 is not initialized.');
  }
}





