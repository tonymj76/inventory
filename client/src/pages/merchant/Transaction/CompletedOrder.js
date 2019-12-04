import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  Table,
  Header,
  Segment,
} from 'semantic-ui-react';
import {
  selectDeliveredOrderItems,
} from 'selectors/merchants';
import OrderItem from './CompletedOrderItem';

const mapStateToProps =(state) => ({
  deliveredOrderItems: selectDeliveredOrderItems(state),
});

class Order extends PureComponent {
  render() {
    const {deliveredOrderItems} = this.props;
    return (
      <section className="merchant-orderItems">
        <Segment>
          <Header as='h5' attached='top'>
            Paid Order Items
          </Header>
          <Table striped color='green'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order Id</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Delivered</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {deliveredOrderItems && deliveredOrderItems.length ? null : (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <h3 style={{textAlign: 'center'}}>
                      They are no delivered Order Items at the moment
                    </h3>
                  </Table.Cell>
                </Table.Row>
              )}
              {deliveredOrderItems && deliveredOrderItems.map((order) => (
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
  null
)(Order);
