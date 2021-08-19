import React, { Component } from 'react';
import { Layout } from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { factory } from '../../ethereum/factory';
import { web3 } from '../../ethereum/web3';
import { withRouter } from 'next/router';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false,
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });

            // Redirect to home
            await this.props.router.push('/');
        }
        catch(err) {
            this.setState({ errorMessage: err.message });
        }
    }

    render() {
        return (
            <Layout>
                <h1>New campaign</h1>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                        />
                    </Form.Field>

                    <Message error header="Oops" content={this.state.errorMessage} />

                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
        )
    };
}

export default withRouter(CampaignNew);
