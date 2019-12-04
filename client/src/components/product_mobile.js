import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {
  Grid,
  List,
  Image,
  Rating,
  Button,
} from 'semantic-ui-react';
import {formatNaira, showToast} from 'utils';
import {getLoggedInUser} from 'selectors/user';
import {addItemToCart, addOrderItem} from 'actions';
import CartItemModel from 'models/Cart';
import OrderItemModel from 'models/OrderItem';
import bg from 'assets/imgs/meals.jpg';

const mapStateToProps = (state) => {
  const user = getLoggedInUser(state);

  return {
    user_id: user.id,
  };
};

class ProductMobile extends React.Component {
  state = {
    quantity: 1,
  }

  handleQuantityChange = (e) => {
    const {target: {value}} = e;
    // convert value to an integer
    const newQuantity = parseInt(value) ? parseInt(value) : value;
    this.setState({
      quantity: newQuantity,
    });
  }

  incrementQuantity = () => {
    this.setState((prevState) => {
      prevState.quantity += 1;
      return {
        quantity: prevState.quantity,
      };
    });
  }

  decrementQuantity = () => {
    if (this.state.quantity > 1) {
      this.setState((prevState) => {
        prevState.quantity -= 1;
        return {
          quantity: prevState.quantity,
        };
      });
    }
  }

  createCartItem = () => {
    const {quantity} = this.state;
    const {item, user_id} = this.props;
    const cartItem = new CartItemModel();
    cartItem.user_id = user_id;
    cartItem.product_id = item.id;
    cartItem.quantity = quantity;
    cartItem.total_price = item.price * quantity;
    return cartItem;
  }

  createOrderItem = () => {
    const {quantity} = this.state;
    const {item, user_id} = this.props;
    const orderItem = new OrderItemModel();
    orderItem.user_id = user_id;
    orderItem.product_id = item.id;
    orderItem.merchant_id = item.merchant.id;
    orderItem.quantity = quantity;
    orderItem.total_price = item.price * quantity;
    return orderItem;
  }

  displayErrorToast = () => (
    showToast('error',
      'Please Login or Sign Up to continue',
      'Operation not permitted!'));

  dispatchAddToCart = () => {
    const {addItemToCart, user_id} = this.props;
    if (user_id) {
      const cartItem = this.createCartItem();
      addItemToCart(JSON.stringify(cartItem));
    } else {
      this.displayErrorToast();
    }
    // TODO: Show a modal to continue shopping or proceed to checkout
  }

  // Handler for 'Buy' button
  handleBuyNow = () => {
    const {addOrderItem, user_id, history} = this.props;
    if (user_id) {
      const orderItem = this.createOrderItem();
      addOrderItem(orderItem);
      history.push('/checkout');
    } else {
      this.displayErrorToast();
    }
  }

  render() {
    const {item} = this.props;
    const {quantity} = this.state;
    return (
      <List.Item>
        <Grid columns={2} style={{padding: 0, margin: 0}}>
          <Grid.Column style={{
            padding: '0em 0.1em 0em 0.5em',
          }}>
            <Image src={bg} fluid
              style={{
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }} />
          </Grid.Column>
          <Grid.Column style={{
            padding: '0em 0.1em 0em 0.5em',
          }}>
            <List.Content style={{fontSize: '1rem'}}>
              <List.Description>
                Sold by: {
                  item.merchant.business_name
                }
              </List.Description>
              <List.Header style={
                {
                  paddingTop: '4px',
                  paddingBottom: '4px',
                }
              }>
                {
                  item.name
                }
              </List.Header>
              <List.Description>
                {formatNaira(item.price)}
              </List.Description>
              <List.Description style={
                {
                  paddingTop: '4px',
                  paddingBottom: '4px',
                }
              }>
                <Rating
                  defaultRating={4}
                  maxRating={5} />
              </List.Description>
              <List.Description style={{paddingBottom: '4px'}}>
                <Button disabled={
                  quantity === 1}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'white',
                  margin: 0,
                  padding: 0,
                  fontSize: '1rem',
                }} onClick={this.decrementQuantity}>
                  <i className='icofont-minus' />
                </Button>
                <input type='number' style={
                  {
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    width: '60%',
                  }
                } value={quantity}
                onChange={() => this.handleQuantityChange(e)} />
                <Button style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'white',
                  margin: 0,
                  padding: 0,
                  fontSize: '1rem',
                }} onClick={this.incrementQuantity}>
                  <i className='icofont-plus' />
                </Button>
              </List.Description>
              <Button icon='plus cart'
                onClick={this.dispatchAddToCart} />
              <Button onClick={this.handleBuyNow}>Buy</Button>
            </List.Content>
          </Grid.Column>
        </Grid>
      </List.Item>
    );
  }
};

export default connect(
  mapStateToProps,
  {addItemToCart, addOrderItem},
)(withRouter(ProductMobile));

