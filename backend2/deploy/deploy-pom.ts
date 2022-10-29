import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet("");
  console.log("1");
  const deployer = new Deployer(hre, wallet);

  console.log("2");
  const factoryArtifact = await deployer.loadArtifact("ProofOfMeet");
  console.log("3");
  const aaArtifact = await deployer.loadArtifact("TwoUserMultisig");

  console.log("4");
  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  // You can remove the depositing step if the `wallet` has enough funds on zkSync
  const depositAmount = ethers.utils.parseEther("0.005");
  console.log("5");
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
  console.log("6");
  await depositHandle.wait();

  console.log("7");
  // Getting the bytecodeHash of the account
  const bytecodeHash = utils.hashBytecode(aaArtifact.bytecode);

  console.log("8");
  const factory = await deployer.deploy(
    factoryArtifact,
    [bytecodeHash],
    undefined,
    [
      // Since the factory requires the code of the multisig to be available,
      // we should pass it here as well.
      aaArtifact.bytecode,
    ]
  );

  console.log("9");
  console.log(`AA factory address: ${factory.address}`);
}
