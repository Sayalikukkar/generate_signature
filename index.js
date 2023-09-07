const { ethers } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
let signer = new ethers.Wallet(privateKey);

const tx = {
  account: "0x0000000000000000000000000000000000000000",
  paymentToken: "0x0000000000000000000000000000000000000000",
  paymentTokenAmount: "20583656817552459",
  claimAmount: "32000000",
  totalLocked: "1000000000000000000",
  chainId: 137,
  contractAddress: "0x0000000000000000000000000000000000000000",
  nonce: "1",
};

async function generatedSignature() {
  var sig = await generateSignature(
    tx.contractAddress,
    tx.paymentToken,
    signer,
    tx.nonce
  );

  console.log("sig :", sig);
}

async function generateSignature(
  contractAddress,
  mockPaymentTokenAddr,
  deployer,
  nonce
) {
  const typedData = await getClaimTypedData(
    contractAddress,
    mockPaymentTokenAddr,
    deployer.address,
    nonce
  );
  return await signer._signTypedData(
    typedData.domain,
    typedData.types,
    typedData.message
  );
}

async function getClaimTypedData(
  contractAddress,
  mockPaymentTokenAddr,
  deployerAddr,
  nonce
) {
  const Claim = [
    { name: "account", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "paymentToken", type: "address" },
    { name: "claimAmount", type: "uint256" },
    { name: "paymentTokenAmount", type: "uint256" },
    { name: "totalLocked", type: "uint256" },
  ];

  const domain = {
    name: "SevenMarvelLockHelper",
    version: "1",
    chainId: tx.chainId,
    verifyingContract: contractAddress,
  };

  const message = {
    account: tx.account,
    nonce: nonce,
    paymentToken: mockPaymentTokenAddr,
    claimAmount: tx.claimAmount,
    paymentTokenAmount: tx.paymentTokenAmount,
    totalLocked: tx.totalLocked,
  };

  const typedData = {
    types: {
      Claim,
    },
    primaryType: "Claim",
    domain,
    message,
  };

  return typedData;
}

generatedSignature();
