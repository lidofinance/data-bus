import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DataBus", (m) => {
  const token = m.contract("DataBus", []);

  return { token };
});
