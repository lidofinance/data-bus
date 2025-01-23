import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvContractSchema = z.object({
  FORKING_NETWORK: z.string().optional(),
  CHIADO_BLOCKSCOUT: z.string().optional(),
  GNOSISSCAN: z.string().optional(),
  POLYGONSCAN: z.string().optional(),
  OPTIMISTICSCAN: z.string().optional(),
  BASESCAN: z.string().optional(),
  NODE_HOST: z.string().optional(),
  PK_KEY: z.string(),
  DEVNET_RPC: z.string().optional()
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
    DEVNET_RPC: env.DEVNET_RPC
  });

export const parseMonitoringConfig = (env: NodeJS.ProcessEnv): EnvMonitoring =>
  EnvMonitoringSchema.parse({
    NODE_HOST: env.NODE_HOST,
    DATA_BUS_ADDRESS: env.DATA_BUS_ADDRESS,
  });
