import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {
  Header,
  Container,
  Grid,
  Button,
} from 'semantic-ui-react';

const ResponsiveContainer = ({children}) => (
  <div>
    {children}
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

export default class NotFound extends React.PureComponent {
  render() {
    return (
      <ResponsiveContainer {...this.props}>
        <div style={{
          marginTop: '60px',
          marginBottom: '120px',
        }}>
          <Container>
            <Grid textAlign='center'>
              <Grid.Row>
                <Header as='h1'>Restricted Page</Header>
              </Grid.Row>
              <Grid.Row>
                <Header as='h2'>
                  Sorry you don't have access to this page
                </Header>
              </Grid.Row>
              <Grid.Row style={{
                paddingTop: '60px',
              }}>
                <Button as={Link} to='/'
                  style={{
                    borderRadius: '1px',
                    backgroundColor: 'transparent',
                    boxShadow: '0px 0px 1px rgb(0,0,0)',
                  }}>
                  Back To Home</Button>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      </ResponsiveContainer>
    );
  }
};
