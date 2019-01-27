import AuthenticationContract from '../../build/contracts/Authentication.json'
import RideSharingContract from '../../build/contracts/RideSharing.json'

import store from '../store'

const contract = require('truffle-contract')

export const FRACTION = 105; // 105

export const USER_UPDATED = 'USER_UPDATED'
function userUpdated(user) {
  return {
    type: USER_UPDATED,
    payload: user
  }
}

export function reserveTravel( rideID,  nbPlaces, price, iddepart, idarrivee, callbackReserveToDb ) {

  //let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/vRtx5LtC6D1enY0g6x0k"));
  let web3 = store.getState().web3.web3Instance
   web3.eth.defaultAccount = web3.eth.accounts[0];



  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {


      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance
      var rideInstance
      var ev 
      var pricefraction
      var pricemain

      console.log('reserveTravel ');
      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

      console.log('reserveTravel web3');



          console.log('reserveTravel auth');
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
             console.log('reserveTravel rideinstance');

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
              console.log('balance res='+result.toNumber());
            } else {
              console.error('balance err='+error);
            }
          })
               let addr = {from: coinbase};
                // console.log('reservation res before balance = ' + web3.eth.getBalance(RideSharingContract) );

                pricefraction =Math.round (1000 * nbPlaces*(price * (5/100)));
               /*
                if( price < 10)
                {
                  pricemain = Math.round ( 1000* nbPlaces *(price *(110/100))) ;
                }
                else
                {
                  pricemain =Math.round (1000*  nbPlaces *(price *(107/100))) ;
                }
                */
                pricemain =Math.round (1000*  nbPlaces *(price *(FRACTION/100))) ;
               console.log('travel reservation' + 'id:' + rideID + 'place:'+ nbPlaces + 'price:'+pricemain+' iddep'+iddepart+' idarr'+idarrivee);
                return  rideInstance.reserveRide( rideID,  nbPlaces, iddepart, idarrivee, {from: coinbase,value: web3.toWei(pricemain, "szabo")}).then(function(result) {
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
                console.log('addr ' + web3.eth.defaultAccount);
                callbackReserveToDb(rideID, iddepart, idarrivee, web3.eth.defaultAccount);
                
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


      })
      
    
  } else {
    console.error('Web3 is not initialized.');
  }
}



export function listTravels(object,depart,arrivee,date) {

  let web3 = store.getState().web3.web3Instance
   web3.eth.defaultAccount = web3.eth.accounts[0];

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

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

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance
         
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
      })
    
  } else {
    console.error('Web3 is not initialized.');
  }
}





