import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {
  Header,
  Container,
  Grid,
  Button,
} from 'semantic-ui-react';
import LayoutContainer from 'components/display_layout';

const ResponsiveContainer = ({children, history}) => (
  <div>
    <LayoutContainer children={children} history={history} />
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
                <Header as='h1'>404</Header>
              </Grid.Row>
              <Grid.Row>
                <Header as='h2'>Page Not Found!</Header>
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
