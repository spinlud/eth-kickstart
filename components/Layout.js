import React from 'react';
import { Container } from 'semantic-ui-react';
import { Header } from './Header';

export const Layout = (props) => {
    return (
        <Container>
            <Header />
            {props.children}
            <h1>Footer</h1>
        </Container>
    );
}
