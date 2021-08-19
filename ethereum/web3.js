import Web3 from 'web3';
const HDWalletProvider = require("@truffle/hdwallet-provider");

let web3;

if (typeof window !== 'undefined' && window.ethereum) {
    // We are in the browser and metamask installed
    web3 = new Web3(window.ethereum);
}
else {
    // We are on the server or metamask not installed
    const provider = new HDWalletProvider({
        mnemonic: process.env.WALLET_SEED,
        providerOrUrl: 'https://rinkeby.infura.io/v3/8a053e42ad9444b99b92cf681d390dd6',
        addressIndex: 0,
    });

    web3 = new Web3(provider);
}

export { web3 };
