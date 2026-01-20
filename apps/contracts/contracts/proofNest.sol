// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ProofNest {
  event ProofCreated(address indexed user, string contentHash, uint256 timestamp);

  mapping(string => bool) public proofs;

  function addProof(string memory _contentHash) public {
    require(!proofs[_contentHash], "ProofNest: This content has already been proven!");

    proofs[_contentHash] = true;

    emit ProofCreated(msg.sender, _contentHash, block.timestamp);
  }

  function verifyProof(string memory _contentHash) public view returns(bool) {
    return proofs[_contentHash];
  }
}