const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');

compiledCampaignFactory.name = 'CampaignFactory';
compiledCampaignFactory.arguments = [];

const provider = new HDWalletProvider({
    mnemonic: process.env.WALLET_SEED,
    providerOrUrl: 'https://rinkeby.infura.io/v3/8a053e42ad9444b99b92cf681d390dd6',
    addressIndex: 0,
});

const web3 = new Web3(provider);
const gasLimit = 3000000;

(async () => {
    const account = (await web3.eth.getAccounts())[0];

    const contracts = [
        compiledCampaignFactory,
    ];

    for (const contract of contracts) {
        console.log(`Deploying contract ${contract.name} from account ${account}`);

        const result = await new web3.eth.Contract(contract.abi)
            // Prepares the object contract to be deployed
            .deploy({
                data: contract.evm.bytecode.object,
                arguments: contract.arguments,
            })
            // Send a transaction on the blockchain to actually create the contract
            .send({
                from: account,
                gas: gasLimit,
            });

        console.log('Contract ABI', JSON.stringify(contract.abi, null, 4));
        console.log(`Contract deployed to ${result.options.address}`);
    }
})();

