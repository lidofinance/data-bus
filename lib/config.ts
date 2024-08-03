import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvContractSchema = z.object({
  CHIADO_BLOCKSCOUT: z.string(),
  NODE_HOST: z.string(),
});

export type EnvContract = z.infer<typeof EnvContractSchema>;

const EnvMonitoringSchema = z.object({
  NODE_HOST: z.string(),
  DATA_BUS_ADDRESS: z.string(),
});

export type EnvMonitoring = z.infer<typeof EnvMonitoringSchema>;

export const parseContractEnvConfig = (env: NodeJS.ProcessEnv): EnvContract =>
  EnvContractSchema.parse({
    CHIADO_BLOCKSCOUT: env.CHIADO_BLOCKSCOUT,
    NODE_HOST: env.NODE_HOST,
  });

export const parseMonitoringConfig = (env: NodeJS.ProcessEnv): EnvMonitoring =>
  EnvMonitoringSchema.parse({
    NODE_HOST: env.NODE_HOST,
    DATA_BUS_ADDRESS: env.DATA_BUS_ADDRESS,
  });
