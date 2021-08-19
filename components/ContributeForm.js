import React, { Component } from 'react';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import { getCampaign } from '../ethereum/campaign';
import { web3 } from '../ethereum/web3';

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: '',
        loading: false,
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            errorMessage: '',
            loading: true,
        });

        try {
            const campaign = getCampaign(this.props.address);
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });

            this.setState({
                errorMessage: '',
                loading: false,
            });

            // Refresh page to update component data
            await this.props.router.push(`/campaigns/${this.props.address}`);
        }
        catch(err) {
            this.setState({ errorMessage: err.message });
        }
    }

    render() {
        return (
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                  <label>Amount to contribute</label>
                  <Input
                      label="Ether"
                      labelPosition="right"
                      value={this.state.value}
                      onChange={event => this.setState({ value: event.target.value })}
                  />
              </Form.Field>

              <Message error header="Oops" content={this.state.errorMessage} />

              <Button primary loading={this.state.loading}>Contribute!</Button>
          </Form>
        );
    }
}

const component = withRouter(ContributeForm);

export {
    component as ContributeForm
};
