import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {
  Card,
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

class ProductCard extends React.Component {
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
      <Card fluid>
        {/* <Image src={item.image}
            wrapped ui={false} /> */}
        <Image src={bg} fluid ui={false}
          style={{height: '150px'}} />
        <Card.Content>
          <Card.Header>{item.name}</Card.Header>
          <Card.Meta style={{fontSize: '1.1rem'}}>
            <span className='date'>
              {formatNaira(item.price)}
            </span>
          </Card.Meta>
          <Card.Description>
            <Rating
              defaultRating={4}
              maxRating={5} />
          </Card.Description>
          <Card.Meta>
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
                width: '70%',
              }
            } value={quantity}
            onChange={(e) => this.handleQuantityChange(e)} />
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
          </Card.Meta>
          <Card.Description
            style={{fontSize: '0.9rem'}}>
                Sold by: {item.merchant.business_name}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button fluid onClick={this.dispatchAddToCart}>Add to cart</Button>
        </Card.Content>
        <Card.Content extra>
          <Button fluid onClick={this.handleBuyNow}>Buy</Button>
        </Card.Content>
      </Card>
    );
  }
};

export default connect(
  mapStateToProps,
  {addItemToCart, addOrderItem},
)(withRouter(ProductCard));
