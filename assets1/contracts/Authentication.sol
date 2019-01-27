pragma solidity ^0.4.18;

import './zeppelin/lifecycle/Killable.sol';

contract Authentication is Killable {


    struct UserAccount {
        address addr;
        bytes32 name;
     } 
   
    mapping (address => bytes32) internal users;

  uint private id; // Stores user id temporarily

  modifier onlyExistingUser {
    // Check if user exists or terminate

    require(!(users[msg.sender] == 0x0));
    _;
  }

  modifier onlyValidName(bytes32 name) {
    // Only valid names allowed

    require(!(name == 0x0));
    _;
  }

  function login() constant
  onlyExistingUser
  returns (bytes32) {
    return (users[msg.sender]);
  }

  function getUser(address addr) constant
  onlyExistingUser
  returns (bytes32) {
    return ("hello");
  }

  function signup(bytes32 name)
   payable
  onlyValidName(name)
  returns (bytes32) {
    // Check if user exists.
    // If yes, return user name.
    // If no, check if name was sent.
    // If yes, create and return user.
   bytes32 lName = users[msg.sender];
    if (lName == 0x0)
    {

       // user.addr = msg.sender;
        //user.name = name;
        users[msg.sender] = name;

        return (users[msg.sender]);
    }

    return (users[msg.sender]);
  }

  function update(bytes32 name)
  payable
  onlyValidName(name)
  onlyExistingUser
  returns (bytes32) {
    // Update user name.

    if (users[msg.sender] != 0x0)
    {
        users[msg.sender] = name;

        return (users[msg.sender]);
    }
  }
}
