require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/vUkxM_FzjvjnbcW9FFn2zxAS-4d3wCG9',
      accounts: ['956523ae6d084ced5c6469953167cca94dc0a303950aeddc139e1628293b5f05']
    }
  }
};
