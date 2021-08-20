import React, { Component } from 'react';
import { Message, Button, Table, Label, Menu, Icon } from 'semantic-ui-react';
import { web3 } from '../ethereum/web3';
import { getCampaign } from '../ethereum/campaign';
import { withRouter } from 'next/router';

class RequestRow extends Component {
    state = {
        isManager: false,
        approving: false,
        finalizing: false,
        hasApprovedRequest: false,
    }

    async componentDidMount() {
        const campaign = getCampaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        const hasApprovedRequest = await campaign.methods.hasApprovedRequest(this.props.id, accounts[0]).call();

        this.setState({
            isManager: accounts[0] === this.props.manager,
            hasApprovedRequest: hasApprovedRequest,
        });
    }

    onApprove = async (event) => {
        event.preventDefault();

        try {
            const campaign = getCampaign(this.props.address);
            const accounts = await web3.eth.getAccounts();

            this.setState({ approving: true });
            this.props.setStateError('');

            await campaign.methods.approveRequest(this.props.id).send({ from: accounts[0] });

            this.setState({ approving: false });
            this.props.setStateError('');

            // Refresh page
            await this.props.router.push(`/campaigns/${this.props.address}/requests`);

            this.setState({
                hasApprovedRequest: true,
            });
        }
        catch(err) {
            this.setState({  approving: false });
            this.props.setStateError(err.message);
        }
    }

    onFinalize = async (event) => {
        event.preventDefault();

        try {
            const campaign = getCampaign(this.props.address);
            const accounts = await web3.eth.getAccounts();

            this.setState({ finalizing: true });
            this.props.setStateError('');

            await campaign.methods.finalizeRequest(this.props.id).send({ from: accounts[0] });

            this.setState({ finalizing: false });
            this.props.setStateError('');

            // Refresh page
            await this.props.router.push(`/campaigns/${this.props.address}/requests`);
        }
        catch(err) {
            this.setState({  finalizing: false });
            this.props.setStateError(err.message);
        }
    }

    render() {
        const readyToFinalize = this.props.request.approvalCount > this.props.approversCount / 2;

        return (
            <Table.Row disabled={this.props.request.completed} positive={readyToFinalize && !this.props.request.completed}>
                <Table.Cell>{this.props.id}</Table.Cell>
                <Table.Cell>{this.props.request.description}</Table.Cell>
                <Table.Cell>{this.props.request.value}</Table.Cell>
                <Table.Cell>{this.props.request.recipient}</Table.Cell>
                <Table.Cell>{this.props.request.approvalCount}/{this.props.approversCount}</Table.Cell>
                <Table.Cell textAlign="center">
                    <Button color="green" basic
                            disabled={this.state.hasApprovedRequest}
                            loading={this.state.approving}
                            onClick={this.onApprove}>Approve</Button>
                </Table.Cell>
                <Table.Cell textAlign="center">
                    <Button color="orange" basic
                            disabled={!this.state.isManager || this.props.request.completed}
                            loading={this.state.finalizing}
                            onClick={this.onFinalize}>Finalize</Button>
                </Table.Cell>
            </Table.Row>
        )
    }
}

const component = withRouter(RequestRow);

export {
    component as RequestRow
};
