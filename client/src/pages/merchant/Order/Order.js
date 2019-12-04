import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Table,
  Header,
  Segment,
} from 'semantic-ui-react';
import {getMerchantOrders} from 'actions';
import {
  selectPaidOrderItems,
  selectProcessedOrderItems,
} from 'selectors/merchants';
import OrderItem from './OrderItem';

const mapStateToProps =(state) => ({
  id: state.user.user.id,
  orders: selectPaidOrderItems(state),
  processedOrderItems: selectProcessedOrderItems(state),
});

class Order extends Component {
  async componentDidMount() {
    await this.props.getMerchantOrders(this.props.id);
  }
  render() {
    const {orders, processedOrderItems} = this.props;
    return (
      <section className="merchant-orderItems">
        <Segment>
          <Header as='h5' attached='top'>
            Paid Order Items
          </Header>
          <Table striped color='red'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order Id</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {orders && orders.length ? null : (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <h3 style={{textAlign: 'center'}}>
                      They are no orders at the moment
                    </h3>
                  </Table.Cell>
                </Table.Row>
              )}
              {orders && orders.map((order) => (
                <OrderItem order={order} key={order.id} />
              ))
              }
            </Table.Body>
          </Table>
        </Segment>
        <Segment>
          <Header as='h5' attached='top'>
            Processed Order Item
          </Header>
          <Table striped color='orange'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order Id</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {processedOrderItems && processedOrderItems.length ? null : (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <h3 style={{textAlign: 'center'}}>
                      They are no <em>processed</em> order items at the moment
                    </h3>
                  </Table.Cell>
                </Table.Row>
              )}
              {processedOrderItems && processedOrderItems.map((order) => (
                <OrderItem order={order} key={order.id} />
              ))
              }
            </Table.Body>
          </Table>
        </Segment>

      </section>
    );
  }
};

export default connect(
  mapStateToProps,
  {getMerchantOrders}
)(Order);
