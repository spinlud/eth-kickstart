import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import { getCampaign } from '../../../ethereum/campaign';
import { web3 } from '../../../ethereum/web3';
import { CardGroup, Grid, Button } from 'semantic-ui-react';
import Link from 'next/link';
import { ContributeForm } from '../../../components/ContributeForm';

class CampaignView extends Component {
    static async getInitialProps(props) {
        const campaign = getCampaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        const [
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        ] = Object.values(summary);

        return {
            address: props.query.address,
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager,
        };
    }

    renderCards() {
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager,
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Manager address',
                description: 'The manager owns this campaign',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: web3.utils.fromWei(balance),
                meta: 'Balance (ether)',
                description: 'How much money this campaign has left to spend',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: minimumContribution,
                meta: 'Minimum contribution (wei)',
                description: 'Minimum contribution to join this campaign',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have donated to this campaign',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: requestsCount,
                meta: 'Number of requests',
                description: 'Number of spending requests',
                style: { overflowWrap: 'break-word' },
            },
        ]

        return <CardGroup items={items}/>
    }

    render() {
        return (
            <Layout>
                {/*<h3>Campaign {this.props.router.query.address}</h3>*/}
                <h3>Campaign {this.props.address}</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link href={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
            </Layout>
        )
    }
}

// export default withRouter(CampaignView);
export default CampaignView;
