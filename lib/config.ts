import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
  CHIADO_BLOCKSCOUT: z.string(),
  NODE_HOST: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

const parseConfig = (env: NodeJS.ProcessEnv): Env => {

  return EnvSchema.parse(env);
};

export const parseEnv = (env: NodeJS.ProcessEnv): Env =>
  parseConfig({
    CHIADO_BLOCKSCOUT: env.CHIADO_BLOCKSCOUT,
    NODE_HOST: env.NODE_HOST,
  });
