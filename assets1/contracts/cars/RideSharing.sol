pragma solidity ^0.4.18;


import "../zeppelin/lifecycle/Killable.sol";
import "../libs/libCLL.sol";

contract RideSharing is Killable  {

    uint8  constant RESERVERS_MAX = 4;
    uint8 constant RES_FREE      = 0;
    uint8 constant RES_RESERVED  = 1;
    uint8 constant RES_CANCELED  = 2; 
    uint8 constant RES_FINISHED  = 3;     
    uint8 constant RES_LITIGE    = 4; 
    uint  constant MAX_DEBLOCK_FUNDS  = 5; //43200 ;// 12H in seconds  ), 5s for test only

    uint  constant MAX_FREE_CANCEL  = 86400 ;// 24H in seconds  
    uint  constant HALF_FREE_CANCEL = 21600 ;// 6H in seconds  

    uint constant  RESERVATIONLASTHOURSCANCELWINDOW = 10800; // 3Hours in  seconds

    uint8 constant MAX_RESERVATIONS = 32;

    uint WINDOW_LITIGE_MIN = 300; //  5 minutes
    uint WINDOW_LITIGE_MAX = 1800; // 30 minutes

    using LibCLLu for LibCLLu.CLL;

    struct requestObject {
        address addr;
        uint8 status;
        uint reservationdate; // Epoch time.
        uint8 nbplaces;
        uint paidprice;
    }

/*
    struct litigeObject {
        address addr;
        uint resid;
        //uint lat;
        //uint long;
        uint litigedate; // Epoch time.       
    }
*/
    struct Ride {
        address userCID;
        ///uint rideId;
        uint [] prices ;
        uint traveldate; // Epoch time.
        requestObject []  requests;
        //litigeObject []  litiges;
     }
 

 
    // The circular linked list storage structure
    LibCLLu.CLL private list;


    uint private priceFraction;
    mapping (uint => Ride) private reservations;
    address internal  owner ;  //   address internal  owner ;


    event RidePublished(address indexed userCID, uint rideId);
    event RideReserved(address indexed userCID, uint rideId);
    event ResNotFound(address  indexed userCID, uint nb);
    event FundtoOnwerInfos(address indexed userCID, uint id, uint sum,  uint nbRsvt);
    event LitigeResolved(address indexed userCID, uint, uint, uint, uint);
    event FundtoReserverInfos(address indexed userCID, uint rideId, uint status);

    event RideDateupdated(address indexed userCID, uint rideId);

    event LitigeRequested(address indexed userCID, uint rideId, uint resId);

    function RideSharing() { owner = msg.sender;priceFraction=100;}
 



    /// publish ride 
    function addRide( uint id ,  uint startdate, uint [] prices) public payable returns (uint) {

        Ride rsvt = reservations[id];
        rsvt.userCID= msg.sender;
        ////rsvt.rideId = id;
        
       
        for(uint i= 0; i < prices.length;i++)
        {

            rsvt.prices.push( prices[i]) ;
        }
        
        rsvt.traveldate = startdate;
        //reservations[id] = rsvt;

        RidePublished(msg.sender, id);

        return id;
    }



    function sumprices(uint rsvtId,uint idx, uint idy) internal returns (uint)
    {
        Ride rsvt = reservations[rsvtId];
        uint sum =0;
        for (uint i = 0; i < rsvt.prices.length; i++)
        {

            if( i >= idx && i <= idy)
            sum = sum +  rsvt.prices[i];
        }
        return sum;
    }
    

    //
    function reserveRide(uint rsvtId, uint8 nbPlaces,uint idx, uint idy) public payable returns (uint)
    {
       Ride rsvt = reservations[rsvtId];
       uint price  = rsvt.prices[0];
       if (rsvt.prices.length> 1)
       {
            price = sumprices(rsvtId,idx, idy);
       }
      //uint baseprice =  price;
      ///uint baseprice =  price;

       require(msg.value >= ((price* priceFraction)/100));
       if( msg.sender == rsvt.userCID)  return 0;
       requestObject obj;
       obj.addr= msg.sender;
       obj.status = RES_RESERVED;
       obj.nbplaces=nbPlaces;
       obj.reservationdate = now;
       obj.paidprice =price;
       rsvt.requests.push(obj);
       RideReserved(msg.sender,  rsvtId);

       return 1;
    }



    function updateRideDate(uint rsvtId,  uint startdate) public payable returns (uint)
    {
       Ride rsvt = reservations[rsvtId];
       if( msg.sender != rsvt.userCID)  return  0;

       if(rsvt.requests.length == 0)
       {
            rsvt.traveldate = startdate;
            RideDateupdated(msg.sender, reservations[rsvtId].traveldate);
            return 1;
       }

    }
    


    function requestFundsReserver(uint rsvtId,  uint price) public payable returns (uint)
    {
        Ride rsvt = reservations[rsvtId];

        bool found = false;
        uint id = 0;
 
        for(uint8 i= 0; i < rsvt.requests.length; i++)
        {
            if (rsvt.requests[i].addr == msg.sender && rsvt.requests[i].status == RES_RESERVED)
            {
                found = true;
                id = i;
                
                break;
            }
        }
        if(  found == false)
        { 
            //ResNotFound(rsvt.requests[i].addr,rsvt.requests.length);
            FundtoReserverInfos(msg.sender,  rsvtId, 0);
            return 0;
        }

        requestObject obj = rsvt.requests[id];

        if( (now +  MAX_FREE_CANCEL  < rsvt.traveldate) || (now < obj.reservationdate + RESERVATIONLASTHOURSCANCELWINDOW ) )
        {
            obj.status=RES_CANCELED;     
            msg.sender.transfer(obj.paidprice);     
            FundtoReserverInfos(msg.sender,  rsvtId, 1);     
            return 1;          
        }       
        else if (now +  HALF_FREE_CANCEL  < rsvt.traveldate)
        {
            obj.status=RES_CANCELED;  
            msg.sender.transfer((obj.paidprice)/2);
            FundtoReserverInfos(msg.sender,  rsvtId, 2);     
            return 2;
        }
        else 
        {
            // obj.status=RES_LITIGE;   
            FundtoReserverInfos(msg.sender,  rsvtId, 3); 
            return 3;
        }     

        return 4;


    }


    function requestFundsOwner(uint rsvtId) public payable returns (uint8)
    {
        uint sumFunds = 0;
        bool nolitige = true;
        Ride rsvt = reservations[rsvtId];
        if( msg.sender != rsvt.userCID)  return  0;

       if(now >= ( rsvt.traveldate + MAX_DEBLOCK_FUNDS))
       {
            for(uint i= 0; i < rsvt.requests.length; i++)
            {
                
                if (rsvt.requests[i].status == RES_RESERVED)
                {
                    sumFunds = sumFunds + rsvt.requests[i].paidprice;
                    rsvt.requests[i].status == RES_FINISHED;

                }
                else{
                    nolitige = false;
                }

            } 
        }

        
        if(sumFunds > 0)
        {
           msg.sender.transfer(sumFunds);
           FundtoOnwerInfos( rsvt.userCID , rsvtId,sumFunds,rsvt.requests.length);
            if(nolitige == true) {
               delete  reservations[rsvtId];
           }
        }

        return 1;
    }


/*    
    function setProofLitigeAsOwner(uint rsvtId,address resrAddr) payable returns(uint8)
    {
        Ride rsvt = reservations[rsvtId];
 
        if( msg.sender != rsvt.userCID)  return  0; 

       return 1;
    }
*/
    
    function setProofLitigeAsReserver(uint rsvtId) payable returns(uint8)
    {
        Ride rsvt = reservations[rsvtId];

        bool found = false;
        uint id = 0;
        if( (now >=  rsvt.traveldate +WINDOW_LITIGE_MIN)  && ( now <rsvt.traveldate + WINDOW_LITIGE_MAX ))
        {
            for(uint8 i= 0; i < rsvt.requests.length; i++)
            {
                if (rsvt.requests[i].addr == msg.sender )
                {
                    found = true;
                    id = i;
                    
                    break;
                }
            }
            if(  found == false)
            { 
                ResNotFound(msg.sender,rsvt.requests.length);
                return 0;
            }

            /*
            litigeObject ltgObject;
            ltgObject.addr= msg.sender;
            ltgObject.resid = id;
            //ltgObject.lat=latitude;
            //ltgObject.long = longitude;
            ltgObject.litigedate =now;
            rsvt.litiges.push(ltgObject);
            */
            rsvt.requests[id].status = RES_LITIGE;
            LitigeRequested(msg.sender,rsvtId,id);
        }

       return 1;
    }




    function resolveLitige(uint rsvtId, address addr, uint ratio, uint complementratio) onlyOwner payable returns (uint)
    {
        Ride rsvt = reservations[rsvtId];

        bool found = false;
        uint id = 0;


        for(uint8 i= 0; i < rsvt.requests.length; i++)
        {
            if (rsvt.requests[i].addr == addr && rsvt.requests[i].status == RES_LITIGE)
            {
                found = true;
                id = i;
                
                break;
            }
        }
        if(  found == false)
        { 
            ResNotFound(rsvt.requests[i].addr,rsvt.requests.length);
            return 0;
        }


        requestObject obj = rsvt.requests[id];
        rsvt.requests[id].status = RES_FINISHED;
        uint sumtoOwer    = obj.paidprice * ratio /100;
        uint sumtoReserver =  (obj.paidprice * complementratio /100);

        (rsvt.requests[id].addr).transfer(sumtoReserver) ;
        rsvt.userCID.transfer(sumtoOwer);

        LitigeResolved(rsvt.userCID,rsvtId,id, sumtoOwer,sumtoReserver);

        return 1;
    }


/*
    function endRide(uint rsvtId) public payable returns(address)
    {

         
       Ride rsvt = reservations[rsvtId];
       if( msg.sender != rsvt.userCID)  return  msg.sender;       
       //rsvt.userCID.transfer(msg.value- 1 ether);
       //owner.transfer(1  ether);
       rsvt.userCID.transfer(msg.value);
       //owner.transfer(1  ether);
       RideDeleted(rsvt.userCID, 1);
       return reservations[rsvtId].userCID;

    }


    // 
    function deleteRide (uint id)  payable returns(bool)
    {
        Ride rsvt = reservations[id];
        if(msg.sender !=rsvt.userCID ) return false;

        // only the ride owner can delete
        delete (reservations[id]);
        //list.remove(id);
        
        return true;
    }

*/


/***********************************************************************
 * get infos methods, can be used for front end or for debug and status 
 ***********************************************************************
 */

/*

    function retrieveNumberOfRides(uint rid) public constant returns(uint){
        return curRsvtNum;
    }   



    function retrieveRides(uint id ,uint start, bytes32 cityA , bytes32 cityB) public constant returns(uint,bytes32,bytes32,uint8,uint8,uint8,uint){
        
 
        if( reservations[id].startCity == cityA && reservations[id].endCity == cityB && reservations[id].start >= start ) 
        {
            Ride rsvt = reservations[id];
            return (rsvt.start,
                    rsvt.startCity,
                    rsvt.endCity,
                    rsvt.nbPlaces,
                    rsvt.reservedPlaces,
                    rsvt.price,
                    rsvt.rideId);
        }
        else 
        {
            return (0,'','',0,0,0,0);
        }
        
    }   

     /// Retrieve details about the ride 
    function retrieveRidesInfo(uint rid) public constant returns(uint,bytes32,bytes32,uint8,uint8,uint8) {
        Ride rsvt = reservations[rid];
        return (rsvt.start,
                rsvt.startCity,
                rsvt.endCity,
                rsvt.nbPlaces,
                rsvt.reservedPlaces,
                rsvt.price);
    }

 */


/***********************************************************************
 * admin functions to supervise plateforme 
 ***********************************************************************
    /*
     * admin functions
     */
    function getEarns(uint sum)  onlyOwner returns (bool)
    {
        owner.transfer(sum);
        return true;
    }

    /*
     * admin functions
     */
    function setNewAddressForFunds(address newaddr)  onlyOwner returns (bool)
    {
        owner = newaddr;
        return true;
    }
    /*
     *
     */
    function setRatio(uint newRatio)  onlyOwner  payable returns (bool) {

         priceFraction = newRatio;   
         return true;
    }

   /*
    *
    */
    function getRatio () private onlyOwner returns (uint){
       return priceFraction;
    }
}