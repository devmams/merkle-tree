const MerkleTest = artifacts.require('MerkleTest')
const { expectRevert } = require('@openzeppelin/test-helpers');
const {MerkleTree} = require('merkletreejs')
const keccak256 = require('keccak256')

contract('MerkleTest', (accounts) => {
  let merkleTest
  let owner
  let otherAccount

  beforeEach(async () => {
    merkleTest = await MerkleTest.deployed()
    owner = accounts[0]
    otherAccount = accounts[5]
  })

  it('Should deploy smart contract properly', async () =>{
    assert(merkleTest.address !== '')
  })

  it('Should return 0x0000000000000000000000000000000000000000000000000000000000000000', async () =>{
    assert(await merkleTest.root() === '0x0000000000000000000000000000000000000000000000000000000000000000')
  })

  it('Should return 0x9b64cf48917f983ce8bb818f161173c20e332e3542972a3be5399a8111e0b45f', async () =>{
    await merkleTest.setRoot('0x9b64cf48917f983ce8bb818f161173c20e332e3542972a3be5399a8111e0b45f')
    assert(await merkleTest.root() === '0x9b64cf48917f983ce8bb818f161173c20e332e3542972a3be5399a8111e0b45f')
  })

  it('Should not be possible to change root with otherAccount', async () =>{
    await expectRevert.unspecified(
      merkleTest.setRoot('0x9b64cf48917f983ce8bb818f161173c20e332e3542972a3be5399a8111e0b45f',
      {from:otherAccount})
    )
  })

  it('isElligible Should return true', async () =>{
    const leafNodes = [owner, otherAccount].map(x => keccak256(x))
    const tree = new MerkleTree(leafNodes, keccak256, {sortPairs: true})
    const root = '0x' + tree.getRoot().toString('hex')
    const eligibleProof = tree.getHexProof(leafNodes[0])
    await merkleTest.setRoot(root)
    assert(await merkleTest.isEligible(eligibleProof, {from:owner}) === true)
  })

  it('isElligible Should return false', async () =>{
    const leafNodes = [owner, otherAccount].map(x => keccak256(x))
    const tree = new MerkleTree(leafNodes, keccak256, {sortPairs: true})
    const root = '0x' + tree.getRoot().toString('hex')
    const eligibleProof = tree.getHexProof(leafNodes[0])
    await merkleTest.setRoot(root)
    assert(await merkleTest.isEligible(eligibleProof, {from:otherAccount}) === false)
  })


})