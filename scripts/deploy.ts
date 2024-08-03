import { ethers, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DataBus = await ethers.getContractFactory("DSMDataBus");
  const contract = await DataBus.deploy();
  const tx = contract.deploymentTransaction();
  await tx?.wait();

  console.log("Contract deployed at:", await contract.getAddress());

  await run(`verify:verify`, {
    address: await contract.getAddress(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
