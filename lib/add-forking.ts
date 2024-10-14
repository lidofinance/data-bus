import { parseContractEnvConfig } from "./config";

const envConfig = parseContractEnvConfig(process.env);

export function addForking(hhNetConfig: any, networks: any) {
  const networkName = envConfig.FORKING_NETWORK as string;
  if (!networkName) return hhNetConfig;

  if (!networks[networkName]) {
    throw new Error("The network config must be specified");
  }

  console.log(
    `The program is running in fork mode for network "${networkName}" with url ${
      networks[networkName as any].url
    }`
  );
  return { ...hhNetConfig, forking: { url: networks[networkName as any].url } };
}
