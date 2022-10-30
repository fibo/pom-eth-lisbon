// import { utils, Wallet } from "zksync-web3";
// import * as ethers from "ethers";
// import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { parseEther } from "ethers/lib/utils";

export default async function (hre: HardhatRuntimeEnvironment) {
  const provider = new Provider(hre.config.zkSyncDeploy.zkSyncNetwork);

  const wallet = new Wallet(
    "44a7366f976814652ae4f93dc262618373bb61a2df0dd07e1e22faf373ef55bf"
  ).connect(provider);
  // The two owners of the multisig
  const owner1 = Wallet.createRandom();
  const owner2 = Wallet.createRandom();
  const factoryArtifact = await hre.artifacts.readArtifact("ProofOfMeet");

  const FACTORY_ADDRESS = "0x3bF094000048eBfBD867a69D705991ff12349741";
  const aaFactory = new ethers.Contract(
    FACTORY_ADDRESS,
    factoryArtifact.abi,
    wallet
  );

  // For the simplicity of the example, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  // deploys multisig for owner1 and owner2
  const tx = await aaFactory.deployAccount(
    salt,
    owner1.address,
    owner2.address
  ); //todo maybe mudar para wallet1
  await tx.wait();

  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    aaFactory.address,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address", "address"], [owner1.address, owner2.address])
  );

  await (
    await wallet.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther("0.001"),
    })
  ).wait();

  console.log("2");

  let aaTx = await aaFactory.populateTransaction.meet(
    owner2.address,
    undefined
  );

  console.log("3");

  console.log(`Multisig deployed on address ${multisigAddress}`);

  const gasLimit = await provider.estimateGas(aaTx);
  const gasPrice = await provider.getGasPrice();
  const metadata = abiCoder.encode(["string"], ["pseudo-metadata"]); //todo change string

  console.log("4");
  aaTx = {
    ...aaTx,
    from: multisigAddress,
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(multisigAddress),
    type: 113,
    customData: {
      ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
      metadata: metadata,
    } as types.Eip712Meta,
    value: ethers.BigNumber.from(0),
  };
  console.log("5");
  const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

  console.log("6");
  const signature = ethers.utils.concat([
    ethers.utils.joinSignature(owner1._signingKey().signDigest(signedTxHash)),
    ethers.utils.joinSignature(owner2._signingKey().signDigest(signedTxHash)),
  ]);

  console.log("7");
  aaTx.customData = {
    ...aaTx.customData,
    customSignature: signature,
  };

  console.log("8");
  console.log(
    `The multisig's nonce before the first tx is ${await provider.getTransactionCount(
      multisigAddress
    )}`
  );

  const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
  await sentTx.wait();

  // Checking that the nonce for the account has increased
  console.log(
    `The multisig's nonce after the first tx is ${await provider.getTransactionCount(
      multisigAddress
    )}`
  );
}
