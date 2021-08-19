import React, { Component } from 'react';
import { Layout } from '../../../../../components/Layout';
import { web3 } from '../../../../../ethereum/web3';
import Link from 'next/link';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import { getCampaign } from '../../../../../ethereum/campaign';

class NewRequest extends Component {
    state = {
        value: '',
        recipient: '',
        description: '',
        errorMessage: '',
        loading: false,
    }

    static async getInitialProps(props) {
        const { address } = props.query;

        return {
            address,
        };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ errorMessage: '', loading: true });

        try {
            const campaign = getCampaign(this.props.address);
            const { description, value, recipient } = this.state;
            const accounts = await web3.eth.getAccounts();

            await campaign.methods
                .createRequest(
                    description,
                    web3.utils.toWei(value, 'ether'),
                    recipient
                )
                .send({ from: accounts[0] });

            this.setState({ errorMessage: '', loading: false });
        }
        catch(err) {
            this.setState({ errorMessage: err.message, loading: false });
        }

    }

    render() {
        return (
            <Layout>
                <Link href={`/campaigns/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <h3>Create new request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value in ether</label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => this.setState({ recipient: event.target.value })}
                        />
                    </Form.Field>

                    <Message error header="Oops" content={this.state.errorMessage} />

                    <Button primary loading={this.state.loading}>Create!</Button>
                </Form>
            </Layout>
        )
    }
}

export default NewRequest;
