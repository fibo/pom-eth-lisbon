import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { parseEther } from "ethers/lib/utils";

// Put the address of your AA factory
const AA_FACTORY_ADDRESS = "0x0Da4ac2FfBAABA5De49C340e90c362840404A37a";

// An example of a deploy script deploys and calls a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.zkSyncDeploy.zkSyncNetwork);
  const wallet = new Wallet(
    "44a7366f976814652ae4f93dc262618373bb61a2df0dd07e1e22faf373ef55bf"
  ).connect(provider);
  const factoryArtifact = await hre.artifacts.readArtifact("ProofOfMeet");

  const aaFactory = new ethers.Contract(
    AA_FACTORY_ADDRESS,
    factoryArtifact.abi,
    wallet
  );

  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();

  console.log("owner1 --- ", owner1.address);
  console.log("owner2 --- ", owner2.address);

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  console.log("SALT --- ", salt);

  console.log("1");
  //TODO change this to call meet function and do create logic in ProofOfMeet contract
  const tx = await aaFactory.deployAccount(
    salt,
    owner1.address, //TODO change this wallet that is conected
    owner2.address,
    {
      gasLimit: 100000,
      nonce: 1,
    }
  );
  console.log("2");
  await tx.wait();

  console.log("3");
  // Getting the address of the deployed contract
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    AA_FACTORY_ADDRESS,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address", "address"], [owner1.address, owner2.address])
  );

  console.log(`Deployed on address ${multisigAddress}`);
}
