//import AuthenticationContract from '../../build/contracts/Authentication.json'
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

export function requestFundTravel( rideID,  nbPlaces) {


  let web3 = store.getState().web3.web3Instance;
  //let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k"));
   web3.eth.defaultAccount = web3.eth.accounts[0];



  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {


      // Using truffle-contract we create the authentication object.
      //const authentication = contract(AuthenticationContract)
      //authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      //var authenticationInstance
      var rideInstance
      var ev 
      var pricefraction
      var pricemain

      console.log('requestFundTravel ');
      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

      console.log('requestFundTravel web3');

  //      authentication.deployed().then(function(instance) {
  //        authenticationInstance = instance

          console.log('requestFundTravel auth');
      // Attempt to login user.
          //authenticationInstance.update(name, {from: coinbase})
          const ride = contract(RideSharingContract)
          ride.setProvider(web3.currentProvider)

          ride.deployed().then(function(ins) {
            rideInstance = ins;
            //var acar
            //acar = Car.new({from: coinbase},name,0,0,0);
         //alert('addr added!' + {from: coinbase})
            var val=0;
             console.log('requestFundTravel rideinstance');

            /*
              ev = rideInstance.RideReserved();
              ev.watch(function(err, resu){
                if (!error)
                    {
                      console.log(resu);
                      val = resu;
                      
                    } else {
                        console.log(err);
                    }
            });       
          */   
              web3.eth.getBalance(ride.address, function (error, result) {
                if (!error) {
                  console.log('balance='+result.toNumber());
                } else {
                  console.error('balance='+error);
                }
              })

              


              function fundRequestDbUpdate(rideID)
              {

                  console.log('fundRequestDbUpdate rideID' +rideID )

                let data = {
                            'travel_id': rideID
                
                            };

                $.ajax({
                      method: 'PUT',
                      url: '/api/updateRequesttravel/'+rideID+'/',
                      datatype: 'json',
                      headers: {
                          'Authorization': 'Token ' + localStorage.token
                      },
                      data: data,
                      success: function (response) {
                      }
                  })
            

              }

              console.log('event');
              let processed = false;
  
              var requestFundsEvent = rideInstance.FundtoOnwerInfos({userCID: web3.eth.defaultAccount});
              //var instructorEvent = rideInstance.RidePublished();         
  
              let callback = function(error, result){
                    let lastid = rideID;
  
                    if ( result)
                    {
                        console.log('event (addr='+result.args.userCID + ') , (id=' + result.args.id + ', (sum=' + result.args.sum + '), (nbreserv=' + result.args.nbRsvt +')');
                        
                        if( (Number(result.args.id) === lastid) && processed == false ){
                          console.log("before requestFundTravel");
                          processed = true;
                          fundRequestDbUpdate(Number(result.args.id));   
                          //deleteTravelCb(Number(result.args.rideId));
                          const element = <div className="fundStatus">Travel funds got !</div>;
                          ReactDOM.render(element, document.getElementById('fundStatus'));
                        }
                        else{
                          console.log('old event');
                        }
                          
                    } else {
                        console.log('event'+error);    
                        const errmessage = 'request funds errors:'+error;
                        const element = '<div className="fundStatus pull-right">'+errmessage+'</div>';
                        ReactDOM.render(element, document.getElementById('fundStatus'));               
                    }
              }
               
               
              requestFundsEvent.watch(callback);    

                // console.log('reservation res before balance = ' + web3.eth.getBalance(RideSharingContract) );

                /*

                pricefraction =Math.round (1000 * nbPlaces*(price * (5/100)));

                if( price < 10)
                {
                  pricemain = Math.round ( 1000* nbPlaces *(price *(100/100))) ;
                }
                else
                {
                  pricemain =Math.round (1000*  nbPlaces *(price *(100/100))) ;
                }
                let weiprice = web3.toWei(pricemain, "szabo");
               console.log('travel reservation' + 'id:' + rideID + 'place:'+ nbPlaces + 'price:'+pricemain);

               */
                return  rideInstance.requestFundsOwner( rideID,  {from: coinbase}).then(function(result) {
              //dispatch(userUpdated({"name": name}))
              //registerVehicle(name,{from: coinbase});              
              console.log('travel reserved' +  JSON.stringify(result));

               // console.log(val);
 
                if( result == 1)
                {
                  /*
                    rideInstance.payFees( rideID,  nbPlaces,pricefraction,{from: coinbase,value: web3.toWei(pricefraction, "finney"), gas:80000}).then(function(result) {
                      //dispatch(userUpdated({"name": name}))
                      //registerVehicle(name,{from: coinbase});
                      console.log('travel added' + {from: coinbase});
        
                      return 
                    })
                    .catch(function(result) {
                      console.log('travel '+JSON.stringify(result));
                      return alert('error travel added!' + 'addr '+ {from: coinbase} + 'res' + result)
                    }) 
                    */
              
                }else
                {
                  
                }

                //fundRequestDbCallback(rideID);

                web3.eth.getBalance(ride.address, function (error, result) {
                  if (!error) {
                    console.log('balance='+result.toNumber());
                  } else {
                    console.error('balance='+error);
                  }
                })
              
              return; // alert('travel added!' + web3.toAscii(result))
            })
            .catch(function(result) {
              console.log(' reservation  error'+result.stack);
              //return alert('error travel added!' + 'addr '+ {from: coinbase} + 'res' + result)
            })
        
          })

        //  })  
      })
      
    
  } else {
    console.error('Web3 is not initialized.');
  }
}




export function requestCancelReservationTravel( rideID, resID, address, nbPlaces, price,iddepart,idarrivee, cancelResevationDbCallback  ) {

  //let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k"));
  let web3 = store.getState().web3.web3Instance
  web3.eth.defaultAccount = web3.eth.accounts[0];



  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {


      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance
      var rideInstance
      var ev 
      var pricefraction
      var pricemain


      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

      console.log('requestFundTravel web3');

         // Attempt to login user.
          //authenticationInstance.update(name, {from: coinbase})
          const ride = contract(RideSharingContract)
          ride.setProvider(web3.currentProvider)

          ride.deployed().then(function(ins) {
            rideInstance = ins;
            //var acar
            //acar = Car.new({from: coinbase},name,0,0,0);
         //alert('addr added!' + {from: coinbase})
            var val=0;
             console.log('requestFundTravel rideinstance');



              // Or pass a callback to start watching immediately
              var events = rideInstance.allEvents();
              
              // watch for changes
              events.watch(function(error, event){
                if (!error)
                  console.log('event'+event);
              });
              
            
                web3.eth.getBalance(ride.address, function (error, result) {
                  if (!error) {
                    console.log('balance='+result.toNumber());
                  } else {
                    console.error('balance='+error);
                  }
                })
                // console.log('reservation res before balance = ' + web3.eth.getBalance(RideSharingContract) );
                let rank  = 0;
                let state = 0;
                pricefraction =Math.round (1000 * nbPlaces*(price * (5/100)));

                if( price < 10)
                {
                  pricemain = Math.round ( 1000* nbPlaces *(price *(100/100))) ;
                }
                else
                {
                  pricemain =Math.round (1000*  nbPlaces *(price *(100/100))) ;
                }
               console.log('travel reservation call requestFundsReserver' + ' id:' + rideID + ' place:'+ nbPlaces + ' address'+address+' price:'+pricemain);
                return  rideInstance.requestFundsReserver( rideID, web3.toWei(pricemain,'szabo'), {from: coinbase}).then(function(result) {
              //dispatch(userUpdated({"name": name}))
              //registerVehicle(name,{from: coinbase});              
              console.log(' reservation canceld' +  JSON.stringify(result));

               // console.log(val);
                //console.log('requestFundsReserver result:'+result.());


               
                web3.eth.getBalance(ride.address, function (error, result) {
                  if (!error) {
                    console.log('balance='+result.toNumber());
                  } else {
                    console.error('balance='+error);
                  }
                })
              
              // update database
              cancelResevationDbCallback(rideID,resID, nbPlaces,address,iddepart,idarrivee);
              return; // alert('travel added!' + web3.toAscii(result))
            })
            .catch(function(result) {
              console.log('cancel reservation  error'+result.stack);
              //return alert('error travel added!' + 'addr '+ {from: coinbase} + 'res' + result)
            })
        
          })


      })
      
    
  } else {
    console.error('Web3 is not initialized.');
  }
}




export function setProofLitigeAsReserver( rideID ) {
  
    //let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k"));
    let web3 = store.getState().web3.web3Instance
    web3.eth.defaultAccount = web3.eth.accounts[0];
  
  
  
    // Double-check web3's status.
    if (typeof web3 !== 'undefined') {
  
  
        // Declaring this for later so we can chain functions on Authentication.
        var authenticationInstance
        var rideInstance
        var ev 
        var pricefraction
        var pricemain
  
  
        // Get current ethereum wallet.
        web3.eth.getCoinbase((error, coinbase) => {
          // Log errors, if any.
          if (error) {
            console.error(error);
          }
  
        console.log('setProofLitigeAsReserver web3');
  
           // Attempt to login user.
            //authenticationInstance.update(name, {from: coinbase})
            const ride = contract(RideSharingContract)
            ride.setProvider(web3.currentProvider)
  
            ride.deployed().then(function(ins) {
              rideInstance = ins;
              //var acar
              //acar = Car.new({from: coinbase},name,0,0,0);
           //alert('addr added!' + {from: coinbase})
              var val=0;
 
              
                  web3.eth.getBalance(ride.address, function (error, result) {
                    if (!error) {
                      console.log('balance='+result.toNumber());
                    } else {
                      console.error('balance='+error);
                    }
                  })


                  return  rideInstance.setProofLitigeAsReserver( rideID, {from: coinbase}).then(function(result) {
                //dispatch(userUpdated({"name": name}))
                //registerVehicle(name,{from: coinbase});              
                console.log(' reservation canceld' +  JSON.stringify(result));
  
                 // console.log(val);
                  //console.log('requestFundsReserver result:'+result.());
  
  
                 
                  web3.eth.getBalance(ride.address, function (error, result) {
                    if (!error) {
                      console.log('balance='+result.toNumber());
                    } else {
                      console.error('balance='+error);
                    }
                  })
                
                // update database
                
                return; // alert('travel added!' + web3.toAscii(result))
              })
              .catch(function(result) {
                console.log('setProofLitigeAsReserver  error'+result.stack);
                //return alert('error travel added!' + 'addr '+ {from: coinbase} + 'res' + result)
              })
          
            })
  
  
        })
        
      
    } else {
      console.error('Web3 is not initialized.');
    }
  }
  


export function listTravels(object,depart,arrivee,date) {

  //let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k"));
  let web3 = store.getState().web3.web3Instance
   web3.eth.defaultAccount = web3.eth.accounts[0];

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    
      // Using truffle-contract we create the authentication object.
      //const authentication = contract(AuthenticationContract)
      //authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance
      var rideInstance
      var nbRides 
      var rides = []
      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        //authentication.deployed().then(function(instance) {
         // authenticationInstance = instance
         
           console.log('depart'+depart+' '+arrivee+' '+date)
          // Attempt to login user.
          //authenticationInstance.update(name, {from: coinbase})
          const ride = contract(RideSharingContract)
          ride.setProvider(web3.currentProvider)

          ride.deployed().then(function(ins) {
            rideInstance = ins;
            //var acar
            //acar = Car.new({from: coinbase},name,0,0,0);
            //alert('addr added!' + {from: coinbase})
              return rideInstance.retrieveNumberOfRides.call(0, {from: coinbase,gas:80000});

           }).then(function(res) {
                nbRides =parseInt( res);
                let startDate = date/1000;
                 console.log('startDate:' +startDate+' start:'+date);
               
                var bigNamuberDate = web3.fromDecimal(startDate);
              
                for(var i=0;i < nbRides;i++)
                  {
                    
                    rides[i]  =   rideInstance.retrieveRides.call(i,bigNamuberDate, depart,arrivee, {from: coinbase,gas:80000}).then(function(res){
   
                          return res;
                    });
                    console.log('i:'+i);  
                  } 
             
              console.log('nbrides:'+nbRides);  
    
              //return rideInstance.retrieveRides.call(0,'7122017', 'rennes','nantes', {from: coinbase,gas:80000});
              return Promise.all(rides);

              }).then(values => {
                 
                
                  for( var i= 0; i < values.length; i++)
                  {
                     console.log('ride0'+values[i]);
                

                    var ride = values[i].toString().split(',');

                      if(parseInt(ride[3]) !='0' ){
                        console.log(' count:'+typeof(ride[3])); 
                        //var rideAscii = (ride[0],ride[1],web3.toAscii(ride[2]),web3.toAscii(ride[3]),ride[4],ride[5]);
                        var rideAscii = {
                                      start:ride[0],        
                                      startCity:web3.toAscii(ride[1]).replace(/\u0000/g, ''),
                                      endCity:web3.toAscii(ride[2]).replace(/\u0000/g, ''),
                                      nbPlaces:ride[3],
                                      reservedPlaces:ride[4],
                                      price:ride[5]}                                                      
                                    ;
                    
                        object.Rides.push( rideAscii);
                      }
                      else{
                        console.log('not count');
                      }

                   /* 
                    object.setState({start :  ride[0]}) 
                    object.setState({end :  ride[1]}) 
                     object.setState({startCity :  web3.toAscii(ride[2])}) 
                    object.setState({endCity :  web3.toAscii(ride[3])}) 
                    object.setState({nbPlaces :  ride[4]}) 
                    object.setState({reservedPlaces :  ride[5]}) 
                    object.setState({price :  ride[6]}) 
                    */
                  }
                  
                  return  
                })
                .catch(function(err) {
                  //
                  console.log('length error ' + (err.stack));
                  return 
                })
        
     /*     
          })
          .catch(function(err) {
             //
              console.log(' error nbrides ' + (err));
             return 
          })      
*/

        })
     // })
    
  } else {
    console.error('Web3 is not initialized.');
  }
}





