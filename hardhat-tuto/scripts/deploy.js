const { ethers } = require('hardhat')

async function main() {
  const web3ForumContract = await ethers.getContractFactory('Web3Forum')

  const deployedWeb3ForumContract = await web3ForumContract.deploy()

  await deployedWeb3ForumContract.deployed()

  console.log("Web3 Forum Contract Address:", deployedWeb3ForumContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })