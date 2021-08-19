import React, { Component } from 'react';
import { factory } from '../ethereum/factory';
import { Button, Card } from 'semantic-ui-react';
import { Layout } from '../components/Layout';
import Link from 'next/link';

export default class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link href={`/campaigns/${address}`}>
                        <a className="item">View campaign</a>
                    </Link>
                ),
                fluid: true,
            }
        });

        return <Card.Group items={items} />;
    }

    render() {
        return <Layout>
            <h3>Open campaigns</h3>

            <Link href="/campaigns/new">
                <a>
                    <Button
                        content="Create Campaign"
                        icon='add circle'
                        primary
                        floated='right'
                    />
                </a>
            </Link>

            {this.renderCampaigns()}
        </Layout>;
    }
}
