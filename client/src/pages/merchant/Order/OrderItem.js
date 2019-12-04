import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  Button,
  Header,
  Modal,
  Table,
  Icon,
  Label,
  Item,
  Dropdown,
} from 'semantic-ui-react';
import {formatNaira} from 'utils';
import {viewOrderDetails, updateOrderItemStatus} from 'actions';


const mapStateToProps =(state) => ({
  viewDetails: state.merchant.viewOrderDetails,
});

class OrderItem extends PureComponent {
  state = {modalOpen: false}

  openModal = () => {
    const {
      user_id,
      order_id,
      product_id,
    } = this.props.order;
    this.setState({modalOpen: true});
    this.props.viewOrderDetails(user_id, order_id, product_id);
  }

  closeModal = () => this.setState({modalOpen: false})

  changeStatus = () => {
    // TODO --- Send request to the server

    this.closeModal();
  }

  render() {
    const {order} = this.props;
    const {
      buyer_full_name,
      buyer_email,
      product_name,
      courier_company_name,
      courier_number,
      courier_email,
      // image,
    }= this.props.viewDetails;

    const id = order.id.split('-');
    return (
      <Table.Row>
        <Table.Cell>
          {id[id.length - 1]}
        </Table.Cell>
        <Table.Cell>
          {
            order.status === 'paid'? (
              <Label color='green'>
                {order.status}
              </Label>
            ): (order.status === 'processed' ?(
              <Label color='orange'>
                {order.status}
              </Label>
            ):(
              <Label color='red'>
                {order.status}
              </Label>
            )
            )
          }
        </Table.Cell>
        <Table.Cell>
          {order.quantity}
        </Table.Cell>
        <Table.Cell>
          <Label tag color='blue'>{formatNaira(order.total_price)}</Label>
        </Table.Cell>
        <Table.Cell>
          {new Date(order.created_at).toDateString()}
        </Table.Cell>
        <Table.Cell>
          <Modal
            trigger={
              <Button
                size='small'
                basic
                color="teal"
                onClick={this.openModal}
              >
                View
              </Button>
            }
            size='small'
            open={this.state.modalOpen}
            onClose={this.closeModal}
          >
            <Header icon='archive'
              content={`Details for order ${id[id.length - 1]}`}
            />
            <Modal.Content>
              <Item.Group divided>
                <Item>
                  <Icon name='user' color='orange' circular />
                  <Item.Content>
                    <Item.Header as='h4'>
                    Customer Name:  <Label icon='user'
                        content={buyer_full_name} />
                    </Item.Header>
                    <Item.Meta>
                      <span className="cinema">
                      Customer Email: <Label content={buyer_email} />
                      </span>
                    </Item.Meta>
                  </Item.Content>
                </Item>

                <Item>
                  <Icon name='product hunt' color='red' circular />
                  <Item.Content>
                    <Item.Header as='h4'>
                    Product Name:  <Label content={product_name} />
                    </Item.Header>
                    <Item.Description>
                      <Header sub>Price</Header>
                      <span>
                        <Label tag color='orange'>
                          {formatNaira(order.total_price)}
                        </Label>
                      </span>
                      <Header sub>Quantity</Header>
                      <span>
                        <Label color='green'>
                          {order.quantity}
                        </Label>
                      </span>
                    </Item.Description>
                  </Item.Content>
                </Item>

                <Item>
                  <Icon name='paper plane outline' color='green' circular />
                  <Item.Content>
                    <Item.Header as='h4'>
                    Courier Name:  <Label icon='user'
                        content={courier_company_name} />
                    </Item.Header>
                    <Item.Meta>
                      <span className="cinema">
                        <Icon name='mail' color='blue' />
                      Courier Email: <Label content={courier_email} />
                      </span>
                    </Item.Meta>
                    <Item.Description>
                      Courier Phone Number: <Label content={courier_number} />
                    </Item.Description>
                    <Item.Extra>
                      <Button
                        primary
                        floated='right'
                        onClick={this.closeModal}
                      >
                        <Icon name='close' />
                          Close
                      </Button>
                    </Item.Extra>
                  </Item.Content>
                </Item>

              </Item.Group>
            </Modal.Content>
          </Modal>

          <Button.Group color='teal'>
            <Button
              disabled={
                order.status === 'processed' ?(
                  true
                ):(
                  false
                )
              }
            >
              Change Status
            </Button>
            <Dropdown
              className='button icon'
              disabled={
                order.status === 'processed' ?(
                  true
                ):(
                  false
                )
              }
            >
              <Dropdown.Menu>
                <Dropdown.Header icon='tags' content='one time change' />
                <Dropdown.Item
                  onClick={
                    ()=>this.props.updateOrderItemStatus(order.id)
                  }
                >
                  Processed
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    );
  }
};

export default connect(
  mapStateToProps,
  {viewOrderDetails, updateOrderItemStatus}
)(OrderItem);
