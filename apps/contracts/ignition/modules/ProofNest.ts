// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ProofNestModule = buildModule("ProofNestModule", (m) => {
  const proofNest = m.contract("ProofNest");

  return { proofNest };
});

export default ProofNestModule;

// ProofNestModule#ProofNest - 0x1EB671894900576462Fa00aF882911a4345dEd73
