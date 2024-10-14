import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvContractSchema = z.object({
  FORKING_NETWORK: z.string().optional(),
  CHIADO_BLOCKSCOUT: z.string(),
  GNOSISSCAN: z.string(),
  POLYGONSCAN: z.string(),
  OPTIMISTICSCAN: z.string(),
  BASESCAN: z.string(),
  NODE_HOST: z.string(),
  PK_KEY: z.string(),
});

export type EnvContract = z.infer<typeof EnvContractSchema>;

const EnvMonitoringSchema = z.object({
  NODE_HOST: z.string(),
  DATA_BUS_ADDRESS: z.string(),
});

export type EnvMonitoring = z.infer<typeof EnvMonitoringSchema>;

export const parseContractEnvConfig = (env: NodeJS.ProcessEnv): EnvContract =>
  EnvContractSchema.parse({
    FORKING_NETWORK: env.FORKING_NETWORK,
    CHIADO_BLOCKSCOUT: env.CHIADO_BLOCKSCOUT,
    GNOSISSCAN: env.GNOSISSCAN,
    POLYGONSCAN: env.POLYGONSCAN,
    OPTIMISTICSCAN: env.OPTIMISTICSCAN,
    BASESCAN: env.BASESCAN,
    NODE_HOST: env.NODE_HOST,
    PK_KEY: env.PK_KEY,
  });

export const parseMonitoringConfig = (env: NodeJS.ProcessEnv): EnvMonitoring =>
  EnvMonitoringSchema.parse({
    NODE_HOST: env.NODE_HOST,
    DATA_BUS_ADDRESS: env.DATA_BUS_ADDRESS,
  });
