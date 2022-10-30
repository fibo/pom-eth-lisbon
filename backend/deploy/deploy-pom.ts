// import { utils, Wallet } from "zksync-web3";
// import * as ethers from "ethers";
// import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { parseEther } from "ethers/lib/utils";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet(
    "44a7366f976814652ae4f93dc262618373bb61a2df0dd07e1e22faf373ef55bf"
  );
  console.log("1");
  const deployer = new Deployer(hre, wallet);

  console.log("2");
  const factoryArtifact = await deployer.loadArtifact("ProofOfMeet");
  console.log("3");
  const aaArtifact = await deployer.loadArtifact("TwoUserMultisig");

  console.log("4");
  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  // You can remove the depositing step if the `wallet` has enough funds on zkSync
  const depositAmount = ethers.utils.parseEther("0.0005");
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

  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  const provider = new Provider(hre.config.zkSyncDeploy.zkSyncNetwork);
  const wallet1 = wallet.connect(provider);

  const aaFactory = new ethers.Contract(
    factory.address,
    factoryArtifact.abi,
    wallet1
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
    owner2.address
    /*{
      gasLimit: 100000,
    }*/
  );
  console.log("2");
  await tx.wait();

  console.log("3");
  // Getting the address of the deployed contract
  const abiCoder = new ethers.utils.AbiCoder();
  const multisigAddress = utils.create2Address(
    factory.address,
    await aaFactory.aaBytecodeHash(),
    salt,
    abiCoder.encode(["address", "address"], [owner1.address, owner2.address])
  );

  console.log(`Deployed on address ${multisigAddress}`);
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae
  //atua mae

  console.log("1");
  await (
    await wallet1.sendTransaction({
      to: multisigAddress,
      // You can increase the amount of ETH sent to the multisig
      value: ethers.utils.parseEther("0.001"),
    })
  ).wait();

  console.log("2");
  let aaTx = await aaFactory.populateTransaction.deployAccount(
    salt,
    Wallet.createRandom().address,
    Wallet.createRandom().address
  );

  console.log("3");
  const gasLimit = await provider.estimateGas(aaTx);
  const gasPrice = await provider.getGasPrice();

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
    } as types.Eip712Meta,
    value: ethers.BigNumber.from(0),
  };
  console.log("5");
  const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

  console.log("6");
  const signature = ethers.utils.concat([
    // Note, that `signMessage` wouldn't work here, since we don't want
    // the signed hash to be prefixed with `\x19Ethereum Signed Message:\n`
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
