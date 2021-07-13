const path = require('path');
const fs = require('fs');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.rmdirSync(buildPath, { recursive: true });
fs.mkdirSync(buildPath);

const campaignSource = fs.readFileSync(path.resolve(__dirname, 'contracts', 'Campaign.sol'), 'utf8');

const getCompilerInput = (name, source) => {
    return {
        language: 'Solidity',
        sources: {
            [name]: {
                content: source
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };
}

const contracts = JSON.parse(solc.compile(JSON.stringify(getCompilerInput('Campaign', campaignSource))))
    .contracts['Campaign'];

for (const [k, v] of Object.entries(contracts)) {
    fs.writeFileSync(path.resolve(buildPath, `${k}.json`), JSON.stringify(v, null, 2));
}
