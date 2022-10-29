// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract ProofOfMeet {
 
  event Approved(address sender, address receiver);

  modifier check(address receiver, string calldata signature) {
    require(true);
    _;
  }

  function meet(address receiver, string calldata signature, string calldata metadata) external check (receiver, signature) {
    emit Approved(msg.sender, receiver);
  }

}
