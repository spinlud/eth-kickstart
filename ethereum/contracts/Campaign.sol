pragma solidity ^0.8.1;
// SPDX-License-Identifier: MIT

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minContribution) public returns (address) {
        address campaign = address(new Campaign(minContribution, msg.sender));
        deployedCampaigns.push(campaign);
        return campaign;
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool completed;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    mapping(uint => Request) public requests;
    uint public requestsCount;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    constructor(uint mC, address creator) {
        manager = creator;
        minimumContribution = mC;
    }

    modifier isManager() {
        require(msg.sender == manager);
        _;
    }

    modifier isApprover() {
        require(approvers[msg.sender]);
        _;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        approvers[msg.sender] = true;
        approversCount += 1;
    }

    function createRequest(
        string memory description,
        uint value,
        address payable recipient
    ) public isManager {
        Request storage newRequest = requests[requestsCount++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.completed = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public isApprover {
        Request storage req = requests[index];

        // Check if this address has already given approval
        require(!req.approvals[msg.sender]);

        req.approvals[msg.sender] = true;
        req.approvalCount += 1;
    }

    function finalizeRequest(uint index) public isManager {
        Request storage req = requests[index];

        require(!req.completed);
        require(req.approvalCount > (approversCount / 2));

        req.recipient.transfer(req.value);
        req.completed = true;
    }
}
