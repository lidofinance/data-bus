import { ethers, run, config, network } from "hardhat";
import { sleep } from "./utils";

const verify = async (address: string) => {
  const currentNetworkName = network.name;
  const verifyParamsExists = config.etherscan.customChains.find(
    ({ network }) => currentNetworkName === network,
  );

  if (!verifyParamsExists) {
    console.log(
      `Not found config for "${currentNetworkName}" chain, etherscan verify skipped`,
    );
    return;
  }

  await run(`verify:verify`, {
    address,
  });
};

export const deploy = async () => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DataBus = await ethers.getContractFactory("DataBus");
  const contract = await DataBus.deploy();
  const tx = contract.deploymentTransaction();
  await tx?.wait();

  console.log("Contract deployed at:", await contract.getAddress());

  await sleep(5000);

  try {
    await verify(await contract.getAddress());
  } catch (error) {
    console.error(error);
  }

  return contract;
};
