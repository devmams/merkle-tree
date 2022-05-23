const MerkleTest = artifacts.require("MerkleTest");
const {MerkleTree} = require('merkletreejs')
const keccak256 = require('keccak256')

module.exports = async function (deployer, _, accounts) {
  await deployer.deploy(MerkleTest);
  let merkleTest = await MerkleTest.deployed()

  let whitelistAddresses = accounts

  const leafNodes = whitelistAddresses.map(x => keccak256(x))
  const tree = new MerkleTree(leafNodes, keccak256, {sortPairs: true})
 
  const bufferToHex = x => '0x' + x.toString('hex') //function to convert buffer to string

  const root = bufferToHex(tree.getRoot())
  
  console.log('tree : \n'+ tree.toString())

  const num_account = 2
  let eligibleAddress = accounts[num_account]
  const eligibleLeaf = leafNodes[num_account]
  const eligibleProof = tree.getHexProof(eligibleLeaf)
  console.log('eligibleAddress : '+ eligibleAddress)
  console.log('eligibleLeaf : '+ bufferToHex(eligibleLeaf))
  console.log('eligibleProof : '+ JSON.stringify(eligibleProof))
  
  await merkleTest.setRoot(root) //set MerkleTest root variable
  console.log('contract root : '+await merkleTest.root())

  console.log('account is eligible : '+ await merkleTest.isEligible(eligibleProof, {from:eligibleAddress}))

};
