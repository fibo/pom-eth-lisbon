// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';
import '@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol';
import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/TransactionHelper.sol";
import "hardhat/console.sol";

contract ProofOfMeet {
  bytes32 public aaBytecodeHash;
  mapping(address=>mapping(address=>IAccount)) multiSigs;

  event Approved(address sender, address receiver);

  constructor(bytes32 _aaBytecodeHash) {
    aaBytecodeHash = _aaBytecodeHash;
  }

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

    IAccount multisig = IAccount(accountAddress);
    multiSigs[msg.sender][receiver] = multisig;
  }

  /* function meet(address receiver, Transaction calldata transaction) external { */
  /*   bytes32 salt = bytes32(0); */

  /*   address multisigAddress = deployAccount(salt, msg.sender, receiver); */
  /*   IAccount multisig = IAccount(multisigAddress); */
  /*   multiSigs[msg.sender][receiver] = multisig; */

  /*   multisig.executeTransactionFromOutside(transaction); */

  /*   //TODO maybe emit metadata as well */
  /*   emit Approved(msg.sender, receiver); */
  /* } */

  
}
