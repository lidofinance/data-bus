import { ethers, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const DataBus = await ethers.getContractFactory("DSMDataBus");
  const contract = await DataBus.deploy();

  console.log("Contract deployed at:", await contract.getAddress());
  const tx = contract.deploymentTransaction();
  await tx?.wait();

  await run(`verify:verify`, {
    address: await contract.getAddress(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
