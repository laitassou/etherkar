pragma solidity ^0.4.18;

contract CarTypes {
   
   /*
    enum Color { WHITE, BLACK, BLUE, RED}
    enum Transmission {MANUAL, AUTOMATIC}
    enum CarStatus {AVAILABLE, UNAVAILABLE}
    enum Brand {PEUGEOT, RENAULT, CITROEN, FORD, BMW, AUDI, MERCEDES,FIAT, TESLA}
  */
    struct Car {
        bytes16 brand;
        bytes16 model;
        uint8 color ;
        bool exists;

    }

    uint constant CAR_ACCESS_UNLOCK = 1;
    uint constant CAR_ACCESS_LOCK = 2;
    uint constant CAR_ACCESS_REMOTE_START = 4;
    uint constant CAR_ACCESS_ALL = CAR_ACCESS_UNLOCK | CAR_ACCESS_LOCK | CAR_ACCESS_REMOTE_START;
}