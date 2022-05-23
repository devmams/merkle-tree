// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

contract MerkleTest is Ownable {

  bytes32 public root;

  function setRoot(bytes32 _root) external onlyOwner{
    root = _root;
  }

  function isEligible(bytes32[] memory proof) external view returns(bool){
    bytes32 leaf = keccak256(abi.encodePacked((msg.sender)));
    return MerkleProof.verify(proof, root, leaf);
  }
}