const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Check if we're on Mainnet network
  const network = await hre.ethers.provider.getNetwork();
  //ChatGPTSubscription CONTRACT

  // Deploy ChatGPTSubscription Contract
  console.log("\nDeploying ChatGPTSubscription contract...");
  const ChatGPTSubscription = await hre.ethers.getContractFactory(
    "ChatGPTSubscription"
  );
  const chatGPTSubscription = await ChatGPTSubscription.deploy(
    deployer.address
  );

  await chatGPTSubscription.deployed();

  console.log("\nDeployment Successful!");
  console.log("------------------------");
  console.log("NEXT_PUBLIC_OWNER_ADDRESS:", deployer.address);
  console.log(
    "NEXT_PUBLIC_chatGPTSubscription_ADDRESS:",
    chatGPTSubscription.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
