import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

import { ProofNest } from "../typechain-types";

describe("ProofNest – Bugfix Tests", function () {
  async function deployFixture(){
    const [owner,user] = await hre.ethers.getSigners();

    const ProofNestFactory = await hre.ethers.getContractFactory("ProofNest");
    const proofNest = (await ProofNestFactory.deploy()) as unknown as ProofNest;

    const PLAN_ID = 1;
    const PRICE = await proofNest.getPrice(PLAN_ID, false);
    console.log("PRICE", PRICE);

    await proofNest.connect(user).subscribe(PLAN_ID, false, {
      value: PRICE,
    });

    return {proofNest, owner, user} ;
  }

  describe("Bugfix: addProof logic",  function (){
    it("", async function () {
      const { proofNest, user } = await loadFixture(deployFixture);

      const hash = hre.ethers.keccak256(
        hre.ethers.toUtf8Bytes("new-proof")
      );

      await expect(proofNest.connect(user).addProof(hash)).to.not.be.reverted;

      const proof = await proofNest.proofs(hash);
      
      expect(proof.owner).to.equal(user.address);
    });

    it("Should revert when adding DUPLICATE proof", async function(){
      const {proofNest, user} = await loadFixture(deployFixture);

      const hash = hre.ethers.keccak256(
        hre.ethers.toUtf8Bytes("duplicate-proof")
      );

      await proofNest.connect(user).addProof(hash);

      await expect(
        proofNest.connect(user).addProof(hash)
      ).to.be.revertedWith("Proof already exists");
    });
  });
});