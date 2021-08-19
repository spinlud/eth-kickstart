import { web3 } from './web3';
import CampaignFactory from './build/CampaignFactory.json';
const ADDRESS = '0x968759f25D2a2C1970BD62EFC41748C857E613Dd';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    ADDRESS,
);

export {
    instance as factory
};
