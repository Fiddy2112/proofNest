// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ProofNestModule = buildModule("ProofNestModule", (m) => {
  const proofNest = m.contract("ProofNest");

  return { proofNest };
});

export default ProofNestModule;

// ProofNestModule#ProofNest - 0xC01e60c898ae81AAfa059ae25EF495b62c08F56f
