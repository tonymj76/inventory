import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  Grid,
  Header,
  Card,
  Button,
  Icon,
} from 'semantic-ui-react';
import {getLoggedInUser} from 'selectors/user';
import {selectState} from 'selectors/state';
import DashboardContainer from '../container/DashboardContainer';

const mapStateToProps = (state) => {
  const user = getLoggedInUser(state);
  const userLocation = {};
  if (user.addresses.length) {
    const userAddress = user.addresses;
    const userState = selectState(state, userAddress[0].state_id);
    const userCity = userState.cities.find(
      (s) => s.id === userAddress[0].city_id);

    userLocation = {
      state: userState.name,
      city: userCity.name,
    };
  }
  return {
    user,
    userLocation,
  };
};

class Dashboard extends PureComponent {
  state = {}

  render() {
    const {user, userLocation} = this.props;
    return (
      <DashboardContainer>
        <Grid stackable container style={{padding: '1rem'}}>
          <Grid.Row>
            <Header as='h2'
              content='Account Overview'
            />
          </Grid.Row>
          <Grid.Column width={8}>
            <Card fluid>
              <Card.Content>
                <Card.Header>Account Details</Card.Header>
              </Card.Content>
              <Card.Content>
                <Button floated='right' compact
                  style={{
                    background: 'transparent',
                  }}>
                  <Icon name='pencil' size='large' />
                </Button>
                <Card.Description>
                  <pre>
                    <Icon name='user' />
                    {user.first_name} {user.last_name}
                  </pre>
                </Card.Description>
                <Card.Description>
                  <pre>
                    <Icon name='mail' />
                    {user.email}
                  </pre>
                </Card.Description>
              </Card.Content>
            </Card>

          </Grid.Column>
          <Grid.Column width={8}>
            <Card fluid>
              <Card.Content>
                <Card.Header>Address Details</Card.Header>
              </Card.Content>
              <Card.Content>
                <Button floated='right' compact
                  style={{
                    background: 'transparent',
                  }}>
                  <Icon name='pencil' size='large' />
                </Button>
                <Card.Description>
                  <p>
                    <Icon name='user' />
                    {user.first_name} {user.last_name}
                  </p>
                </Card.Description>
                {user.addresses && user.addresses.length ? (
                  <Card.Description>
                    <Icon name='map marker alternate' />
                    {user.addresses[0].house_number } {user
                      .addresses[0].street}, {
                      userLocation.city}, {userLocation.state}
                  </Card.Description>

                ) : (
                  <Card.Description>
                    <p>
                      <Icon name='map marker alternate' />
                    Address not set
                    </p>
                  </Card.Description>
                )
                }
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </DashboardContainer>
    );
  }
};

export default connect(
  mapStateToProps,
  null
)(Dashboard);
