import { parseMonitoringConfig } from "../lib/config";
import { sendTestTx } from "./lib/test-tx";

const envConfig = parseMonitoringConfig(process.env);

sendTestTx(envConfig.DATA_BUS_ADDRESS).catch(console.error);
