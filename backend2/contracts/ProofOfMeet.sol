// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';
import '@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol';
import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";
import "hardhat/console.sol";

contract ProofOfMeet {
  bytes32 public aaBytecodeHash;
  mapping(address=>mapping(address=>IAccount)) multiSigs;

  event Approved(address sender, address receiver);

  constructor(bytes32 _aaBytecodeHash) {
    aaBytecodeHash = _aaBytecodeHash;
  }

  //TODO change to internal function , external for testing purposes
  function deployAccount(
    bytes32 salt,
    address owner1,
    address owner2
  ) public returns (address accountAddress) {
    bytes memory returnData = SystemContractsCaller.systemCall(
      uint32(gasleft()),
      address(DEPLOYER_SYSTEM_CONTRACT),
      0,
      abi.encodeCall(
        DEPLOYER_SYSTEM_CONTRACT.create2Account,
        (salt, aaBytecodeHash, abi.encode(owner1, owner2))
      )
    );

    (accountAddress, ) = abi.decode(returnData, (address, bytes));
  }

  function meet(address receiver, string calldata metadata) external {
    bytes32 salt = bytes32(0);

    address accountAddress = deployAccount(salt, msg.sender, receiver);
    IAccount multisig = IAccount(accountAddress);
    multiSigs[msg.sender][receiver] = multisig;

    //TODO tell multisig to mint Meet.sol 
    //TODO send metadata to it
    //TODO maybe we have to also include in the calldata signature
    bytes32 toCallMint = abi.encode("data to call mint Meet.sol");
    multisig.executeTransaction(toCallMint);

    emit Approved(msg.sender, receiver);
  }

  
}
