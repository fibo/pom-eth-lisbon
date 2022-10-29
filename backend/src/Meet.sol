// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Meet {
  string metadata;//check visibility chosen by the users
  
  //check visibility to make the connections available to mutual connections 
  address owner1;
  address owner2;

  constructor(address _owner1, address  _owner2, string memory _metadata){
    owner1 = _owner1;
    owner2 = _owner2;
    metadata = _metadata;
  }

  modifier isOwner(address _owner){
    require(_owner == owner1 || _owner == owner2);
    _;
  }

  //check if the input message sender is correct for this modifier verification
  function getMetadata() external isOwner(msg.sender) returns (string memory){
    return metadata;
  }
}
