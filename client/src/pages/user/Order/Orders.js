import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
  Header,
  Icon,
  Dimmer,
  Loader,
  Grid,
  Card,
  List,
  Image,
  Button,
} from 'semantic-ui-react';
import {getCustomerOrders} from 'actions';
import {getUserOrders} from 'selectors/order';
import {getProduct} from 'selectors/product';
import {getLoggedInUser} from 'selectors/user';

import DashboardContainer from '../container/DashboardContainer';
import bg from 'assets/imgs/meals.jpg';


const mapStateToProps = (state) => {
  const user = getLoggedInUser(state);
  const orders = getUserOrders(state);
  const orders_with_products = [];
  const products = [];
  if (orders && orders.length) {
    orders.map((order) => {
      order.order_items.map((item) => {
        const p = getProduct(state,
          item.product_id);

        products.push({
          images: p['images'],
          name: p['name'],
        });

        orders_with_products.push({
          id: order['id'],
          created_at: order['created_at'],
          products,
        });
      });
    });
  }
  return {
    user_id: user.id,
    orders_with_products,
  };
};

class Orders extends PureComponent {
  state = {}
  async componentDidMount() {
    await this.props.getCustomerOrders(this.props.user_id);
  }
  render() {
    const {orders_with_products} = this.props;
    return (
      <DashboardContainer>
        <section className="order-grid">
          {
            orders_with_products ? (
              orders_with_products.length ? (
                <Grid stackable container
                  style={{padding: '1rem'}}>
                  <Grid.Row>
                    <Header as='h2'
                      content={`Orders (${orders_with_products.length})`}
                    />
                  </Grid.Row>
                  {
                    orders_with_products.map((order, index) => (
                      <Grid.Row key={order.id}>
                        <Grid.Column width={12}>
                          <Card fluid style={{
                            borderRadius: 0,
                            padding: '1rem',
                          }}>
                            <List>
                              <List.Item>
                                <Image src={bg} size='small' />
                                <List.Content>
                                  <List.Item style={{
                                    fontWeight: '600',
                                    fontSize: '1.2rem',
                                  }}>
                                    {order.products[index].name}
                                  </List.Item>
                                  <List.Item style={{
                                    paddingTop: '1rem',
                                    paddingBottom: '1.5rem',
                                  }}>
                                    <Icon name='calendar outline' />
                                    Placed On {
                                      new Date(order.created_at).toDateString()
                                    }
                                  </List.Item>
                                  <List.Item>
                                    <Button
                                      className='primary text'
                                      as={Link}
                                      to=''
                                      style={{
                                        background: 'transparent',
                                        color: 'orange',
                                        textTransform: 'uppercase',
                                        margin: '0',
                                        padding: '0',
                                      }}>
                                      view details
                                      <Icon name='chevron right' />
                                    </Button>
                                  </List.Item>
                                </List.Content>
                              </List.Item>
                            </List>
                          </Card>
                        </Grid.Column>
                      </Grid.Row>
                    ))
                  }
                </Grid>
              ) : (
                <Grid stackable container
                  style={{
                    paddingTop: '8rem',
                    paddingBottom: '8rem',
                  }}>
                  <Grid.Row centered>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Header as='h3' style={{
                        fontWeight: '500',
                        fontSize: '1.6rem',
                      }}>
                        <Icon name='shipping' />
                        <br />
                          You have placed 0 orders
                      </Header>
                    </div>
                  </Grid.Row>
                </Grid>
              )
            ) : (
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
            )
          }
        </section>
      </DashboardContainer>
    );
  }
};

export default connect(
  mapStateToProps,
  {getCustomerOrders}
)(Orders);
