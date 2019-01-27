pragma solidity ^0.4.18;

import "./CarTypes.sol";
import "./ErrorTypes.sol";

contract MobilityRegistry is CarTypes, ErrorTypes {

    mapping (address => Car)  cars;

    uint countCars;

    address  internal owner ;

    //Authentication auth;
    function MobilityRegistry () {
        countCars = 0;
      }

    event UserRegistered(address indexed account, bytes32 indexed name);
    event CarListed(address userAccount, uint carAccount);
    
   function getCarInfo( ) public constant returns(bytes16,bytes16 , uint8) {
        address cid = msg.sender; //countCars;
        Car car = cars[cid];
        if (car.exists) {
            return (car.brand, car.model,car.color);
        } else{
            return ('', '',uint8(0));
        }
        
    }



/*
   function getName(uint cid) public constant returns(bytes32,address) {
        Authentication.UserAccount user = auth.users[msg.sender];
        return (auth.users[msg.sender].name,msg.sender);
    }
*/


    /// Register a car.
    function addCar(bytes16 brand , bytes16 model, uint8 color) payable returns(uint error) {

        address cid = msg.sender; //countCars;
        Car car = cars[cid];
        if (car.exists) {
            return CAR_ALREADY_REGISTERED;
        }

        car.exists = true;
        car.brand = brand;
        car.model = model;
        car.color = color;
      //  user.cars.push(cid);
      //  CarListed(msg.sender, cid);

        countCars++;
        return SUCCESS;
    }

    /// delete a car.
    function deleteCar () payable returns(uint error) {

        address cid = msg.sender; //countCars;
        Car car = cars[cid];
        if (car.exists) {
            delete cars[cid];
            countCars--;
            return SUCCESS;
        }
        return ERROR;
    }

/*
    /// Register as user. 
    function registerUser(bytes32 name, bytes16 license) payable returns (uint error) {
        Authentication.UserAccount user = auth.users[msg.sender];
        if (user.exists) {
            return ACCOUNT_ALREADY_EXIST;
        }

        user.addr = msg.sender;
        user.name = name;
        user.license = license;
        user.exists = true;
        auth.users[msg.sender] = user;

        UserRegistered(user.addr, name);
        return SUCCESS;
    }

*/
}