import { ethers, run, config, network } from "hardhat";

const verify = async (address: string) => {
  const currentNetworkName = network.name;
  const verifyParamsExists = config.etherscan.customChains.find(
    ({ network }) => currentNetworkName === network
  );

  if (!verifyParamsExists) {
    console.log(
      `Not found config for "${currentNetworkName}" chain, etherscan verify skipped`
    );
    return;
  }

  await run(`verify:verify`, {
    address,
  });
};

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DataBus = await ethers.getContractFactory("DSMDataBus");
  const contract = await DataBus.deploy();
  const tx = contract.deploymentTransaction();
  await tx?.wait();

  console.log("Contract deployed at:", await contract.getAddress());

  await verify(await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
