const assert = require('assert');
const ganache = require('ganache-core');
const Web3 = require('web3');
const compiledCampaign = require('../ethereum/build/Campaign.json');
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');

const web3 = new Web3(ganache.provider());
const gasLimit = 3000000;
const minConstribution = 1;
let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    // Get ethereum default accounts (created by Ganache automatically)
    accounts = await web3.eth.getAccounts();

    // Deploy factory contract
    factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
        // Prepares the object contract to be deployed
        .deploy({
            data: compiledCampaignFactory.evm.bytecode.object,
            arguments: [],
        })
        // Send a transaction on the blockchain to actually create the contract
        .send({
            from: accounts[0],
            gas: gasLimit,
        });

    // Use factory to create a new campaign
    await factory.methods.createCampaign(minConstribution).send({
        from: accounts[0],
        gas: gasLimit
    });

    // Retrieve the new campaign address
    const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = deployedCampaigns[0];
    campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaign', () => {
    it('Deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Marks caller as campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[0]);
    });

    it('People can contribute', async () => {
        const caller = accounts[1];

        await campaign.methods.contribute().send({
            value: minConstribution,
            from: caller,
        });

        const isApprover = await campaign.methods.approvers(caller).call();
        assert.ok(isApprover);
    });

    it('Requires minimum contribution', async () => {
        await assert.rejects(
            campaign.methods.contribute().send({
                value: minConstribution - 10,
                from: accounts[1],
            })
        );
    });

    it('Manager can make a payment request', async () => {
        await campaign.methods.createRequest(
            'Buy benza',
            minConstribution * 2,
            accounts[0],
        ).send({
            from: accounts[0],
            gas: gasLimit
        });

        const request = await campaign.methods.requests(0).call();
        assert.strictEqual('Buy benza', request.description);
    });

    it('Process request', async () => {
        const contribution = web3.utils.toWei('1');
        const requestAmount = web3.utils.toWei('2');

        let initialBalance = await web3.eth.getBalance(accounts[1]);
        initialBalance = parseFloat(web3.utils.fromWei(initialBalance, 'ether'));

        await campaign.methods.contribute().send({
            from: accounts[0],
            value: contribution
        });

        await campaign.methods.contribute().send({
            from: accounts[1],
            value: contribution
        });

        await campaign.methods.createRequest(
            'First request',
            requestAmount,
            accounts[1]
        ).send({
            from: accounts[0],
            gas: gasLimit
        });

        await Promise.all([
            campaign.methods.approveRequest(0).send({from: accounts[0], gas: gasLimit}),
            campaign.methods.approveRequest(0).send({from: accounts[1], gas: gasLimit}),
        ]);

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: gasLimit
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = parseFloat(web3.utils.fromWei(balance, 'ether'));
        assert((balance - initialBalance) > web3.utils.fromWei(`${(requestAmount - contribution) * 0.9}`, 'ether'));
    });
});




