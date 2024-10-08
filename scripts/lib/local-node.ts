import { run } from "hardhat";
import { parseContractEnvConfig } from "../../lib/config";

const envConfig = parseContractEnvConfig(process.env);

export const runLocalNode = async () => {
  const result = envConfig.NODE_HOST.match(/https?:\/\/([^:\/\s]+)(?::(\d+))?/);
  if (!result)
    throw new Error(
      `Please, provide correct NODE_HOST, received "${envConfig.NODE_HOST}"`
    );
  const [_, hostname, port] = result;

  await run("node", { port: parseInt(port), hostname: hostname });

  return { hostname, port };
};
