import { web3 } from './web3';
import CampaignFactory from './build/CampaignFactory.json';
const ADDRESS = '0x08bdA6768a868426428b3b34e5C51F31E152CfdF';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    ADDRESS,
);

export {
    instance as factory
};
