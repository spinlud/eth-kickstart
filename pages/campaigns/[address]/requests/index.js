import React, { Component } from 'react';
import { Layout } from '../../../../components/Layout';
import { web3 } from '../../../../ethereum/web3';
import { getCampaign } from '../../../../ethereum/campaign';
import Link from 'next/link';
import {Button, Table, Label, Menu, Icon, Message} from 'semantic-ui-react';
import { RequestRow } from '../../../../components/RequestRow';

class Request extends Component {
    state = {
        errorMessage: '',
    }

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = getCampaign(address);
        const accounts = await web3.eth.getAccounts();

        const requests = (await campaign.methods.getRequests().call())
            .map(e => {
                const [
                    description,
                    value,
                    recipient,
                    completed,
                    approvalCount,
                ] = e;

                return {
                    description,
                    value: web3.utils.fromWei(value, 'ether'),
                    recipient,
                    completed,
                    approvalCount: parseInt(approvalCount, 10),
                };
            });

        const approversCount = await campaign.methods.approversCount().call();

        return {
            address,
            requests,
            approversCount,
        };
    }

    setStateError = (message) => {
        this.setState({ errorMessage: message });
    }

    render() {
        return (
            <Layout>
                <h3>Requests</h3>

                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.props.requests.map((e, i) =>
                            <RequestRow
                                key={i}
                                id={i}
                                address={this.props.address}
                                request={e}
                                approversCount={this.props.approversCount}
                                setStateError={this.setStateError}
                            />
                        )}
                    </Table.Body>
                </Table>

                {
                    !!this.state.errorMessage &&
                    <Message error header="Oops" content={this.state.errorMessage} />
                }

                <Link href={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary>Add Request</Button>
                    </a>
                </Link>
            </Layout>
        )
    }
}

export default Request;
