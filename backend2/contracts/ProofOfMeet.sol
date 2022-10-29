// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol';
import '@matterlabs/zksync-contracts/l2/system-contracts/SystemContractsCaller.sol';
import "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IAccount.sol";

contract ProofOfMeet {
  bytes32 public aaBytecodeHash;
  mapping(address=>mapping(address=>IAccount)) multiSigs;

  event Approved(address sender, address receiver);
  
  function meet(address receiver, bytes32 _aaBytecodeHash, string calldata metadata) external {
    bytes32 salt = bytes32(0);
    aaBytecodeHash = _aaBytecodeHash;

    address accountAddress = deployAccount(salt, msg.sender, receiver);
    multiSigs[msg.sender][receiver] = IAccount(accountAddress);

    emit Approved(msg.sender, receiver);
  }

  function deployAccount(
    bytes32 salt,
    address owner1,
    address owner2
  ) internal returns (address accountAddress) {
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
}
