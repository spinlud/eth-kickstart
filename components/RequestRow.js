import React, { Component } from 'react';
import { Message, Button, Table, Label, Menu, Icon } from 'semantic-ui-react';
import { web3 } from '../ethereum/web3';
import { getCampaign } from '../ethereum/campaign';
import { withRouter } from 'next/router';

class RequestRow extends Component {
    state = {
        approving: false,
        finalizing: false,
    }

    onApprove = async () => {
        const campaign = getCampaign(this.props.address);
        const accounts = await web3.eth.getAccounts();

        this.setState({ approving: true });
        this.props.setStateError('');

        try {
            await campaign.methods.approveRequest(this.props.id).send({ from: accounts[0] });

            this.setState({ approving: false });
            this.props.setStateError('');

            // Refresh page
            await this.props.router.push(`/campaigns/${this.props.address}/requests`);
        }
        catch(err) {
            this.setState({  approving: false });
            this.props.setStateError(err.message);
        }
    }

    render() {
        return (
            <Table.Row>
                <Table.Cell>{this.props.id}</Table.Cell>
                <Table.Cell>{this.props.request.description}</Table.Cell>
                <Table.Cell>{this.props.request.value}</Table.Cell>
                <Table.Cell>{this.props.request.recipient}</Table.Cell>
                <Table.Cell>{this.props.request.approvalCount}/{this.props.approversCount}</Table.Cell>
                <Table.Cell>
                    <Button color="green" basic loading={this.state.approving} onClick={this.onApprove}>Approve</Button>
                </Table.Cell>
                <Table.Cell>
                    <Button color="orange" basic loading={this.state.finalizing} onClick={() => {}}>Finalize</Button>
                </Table.Cell>
            </Table.Row>
        )
    }
}

const component = withRouter(RequestRow);

export {
    component as RequestRow
};
