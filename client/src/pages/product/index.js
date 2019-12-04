import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// import Slider from 'react-slick';
import {
  Responsive,
  Grid,
  // Image,
  Header,
  List,
  Rating,
  Tab,
  Button,
  // Card,
} from 'semantic-ui-react';

import {formatNaira} from 'utils';
import LayoutContainer from 'components/display_layout';
import bg from 'assets/imgs/meals.jpg';
import banga from 'assets/imgs/banga.jpg';
import CartItemModel from 'models/Cart';
import {addItemToCart} from 'actions';

const getWidth = () => {
  const isSSR = typeof window === 'undefined';

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

const ResponsiveContainer = ({children, history}) => (
  <div id='product-page'>
    <LayoutContainer children={children} history={history} />
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const DividedSection = ({children}) => (
  <div style={{
    borderBottom: '2px solid rgba(0, 0, 0, 0.06)',
    paddingBottom: '8px',
    paddingTop: '8px',
  }}>
    {children}
  </div>
);

const productImages = [
  {
    url: bg,
  },
  {
    url: banga,
  },
  {
    url: bg,
  },
];

// const sliderSettingsDesktop = {
//   infinite: true,
//   arrows: true,
//   speed: 2000,
//   slidesToShow: 5,
//   slidesToScroll: 2,
// };

// const sliderSettingsMobile = {
//   infinite: true,
//   arrows: false,
//   speed: 2000,
//   slidesToShow: 1,
//   slidesToScroll: 1,
// };

const mapDispatchToProps = (dispatch) => ({dispatch});
const mapStateToProps = ({user}) => ({userID: user.id});

class DesktopProductLayout extends Component {
  state = {
    positionX: 0,
    positionY: 0,
    currentImage: productImages[0].url,
    product: this.props.location.state,
    quantity: 1,
  };

  handleMouseMove = (e) => {
    const {
      left, top, width, height,
    } = e.target.getBoundingClientRect();
    const x = (e.pageX - left) / width * 100;
    const y = (e.pageY - top) / height * 100;

    this.setState({
      positionX: x,
      positionY: y,
    });
  }

  handleImageChange = (e) => {
    const {src} = e.target;
    console.log(src);
    this.setState({
      currentImage: src,
    });
  }

  incrementQuantity = () => {
    this.setState((prevState) => ({
      quantity: prevState.quantity + 1,
    }));
  }

  decrementQuantity = () => {
    if (this.state.quantity > 1) {
      this.setState((prevState) => ({
        quantity: prevState.quantity - 1,
      }));
    }
  }

  createCartItem = (item) => {
    const {quantity} = this.state;
    const {userID} = this.props;
    const cartItem = new CartItemModel();
    cartItem.user_id = userID;
    cartItem.product_id = item.id;
    cartItem.quantity = quantity;
    cartItem.total_price = item.price * quantity;
    return cartItem;
  }

  dispatchAddToCart = (item) => {
    const {dispatch} = this.props;
    const cartItem = this.createCartItem(item);
    dispatch(addItemToCart(JSON.stringify(cartItem)));
    // TODO: Show a modal to continue shopping or proceed to checkout
  }

  handleBuyNow = (product) => {
    const {history} = this.props;
    const item = this.createCartItem(product);
    history.push({
      pathname: '/checkout',
      state: {
        items: [item],
      },
    });
  }

  render() {
    const {
      positionX,
      positionY,
      currentImage,
      quantity,
    } = this.state;
    const {location} = this.props;
    const product = location.state;

    const panes = [
      {menuItem: 'Overview', render:
        () => <Tab.Pane attached={'bottom'}>
          <div>{product.description}</div>
        </Tab.Pane>,
      },
      {menuItem: 'Customer Reviews', render:
        () => <Tab.Pane attached={'bottom'}>
          Customer Reviews
        </Tab.Pane>,
      },
      {menuItem: 'Specifications', render:
        () => <Tab.Pane attached={'bottom'}>
          Specifications
        </Tab.Pane>,
      },
    ];
    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <div>
          <Grid container columns={3}
            style={{
              marginTop: 0,
              marginBottom: '20px',
            }}>
            <Grid.Column width={6}>
              <Grid.Row>
                <div id='magnifier' onMouseMove={this.handleMouseMove} style={
                  {
                    backgroundImage: `url(${currentImage})`,
                    backgroundPosition: `${positionX}% ${positionY}%`,
                  }
                }>
                  <img src={currentImage} />
                </div>
              </Grid.Row>
              <Grid.Row style={{marginTop: '10px'}}>
                <List horizontal>
                  {
                    productImages.map((img, key) => (
                      <List.Item key={key}>
                        <img src={img.url} width='60px'
                          onMouseOver={this.handleImageChange} />
                      </List.Item>
                    ))
                  }
                </List>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={10}>
              <DividedSection>
                <h3 style={{fontWeight: 400}}>
                  {product.name}
                </h3>
                <List horizontal divided>
                  <List.Item>
                    <List.Content>
                      <Rating icon='star'
                        // defaultRating={product.rating}
                        maxRating={5} />
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Description>
                      {/* {product.no_of_orders} */}
                      orders
                    </List.Description>
                  </List.Item>
                  <List.Item>
                    <List.Description>
                      {/* {product.ProductReviews.length} */}
                      reviews
                    </List.Description>
                  </List.Item>
                </List>
              </DividedSection>
              <DividedSection>
                <Header as='h1'>
                  {formatNaira(product.price)}
                </Header>
              </DividedSection>
              <div style={{paddingTop: '15px', paddingBottom: '5px'}}>
                <div style={{display: 'flex', fontSize: '1.1rem'}}>
                  <p style={{paddingRight: '5px'}}>
                    Quantity:
                  </p>
                  <Button disabled={quantity === 1}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'orange',
                      color: 'white',
                      margin: 0,
                      padding: 0,
                      fontSize: '1rem',
                    }} onClick={this.decrementQuantity}>
                    <i className='icofont icofont-minus' />
                  </Button>
                  <p style={
                    {
                      paddingLeft: '5px',
                      paddingRight: '5px',
                    }
                  }>{quantity}</p>
                  <Button style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'orange',
                    color: 'white',
                    margin: 0,
                    padding: 0,
                    fontSize: '1rem',
                  }} onClick={this.incrementQuantity}>
                    <i className='icofont icofont-plus' />
                  </Button>
                </div>
                <List horizontal>
                  <List.Item>
                    <Button color='red'
                      onClick={() => this.handleBuyNow(product)}>
                      Buy Now
                    </Button>
                  </List.Item>
                  <List.Item>
                    <Button color='orange'
                      onClick={() => this.dispatchAddToCart(product)}>
                      Add To Cart
                    </Button>
                  </List.Item>
                  <List.Item>
                    <Button style={{
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.4)',
                    }}>Add To Wishlist</Button>
                  </List.Item>
                </List>
              </div>
            </Grid.Column>
          </Grid>
          <Grid container style={{
            marginTop: 0,
            marginBottom: '50px',
          }}>
            <Grid.Column width={16}>
              <Tab menu={
                {
                  secondary: true,
                  pointing: true,
                  attached: 'top',
                }
              } panes={panes} />
            </Grid.Column>
          </Grid>
          {/* <Grid container>
            <Grid.Row>
              <Header as='h4'
                style={{textTransform: 'uppercase'}}>
                Sponsored Products Related to this item
              </Header>
              <div style={
                {
                  width: '100%',
                  marginBottom: '20px',
                }
              }>
                <Slider {...sliderSettings}>
                  {
                    product.RelatedProducts.map((item, k) => (
                      <div key={k}>
                        <Card fluid as={Link} to={`/product/${item.slug}`}>
                          <Image src={item.Images[0].url} wrapped ui={false} />
                          <Card.Content>
                            <Card.Header>{item.name}</Card.Header>
                            <Card.Meta>
                              <span className='date'>
                                {formatNaira(item.price)}
                              </span>
                            </Card.Meta>
                            <Card.Description>
                              <Rating defaultRating={item.ProductRating.rating}
                                maxRating={5} />
                            </Card.Description>
                            <Card.Description>
                              Sold by: {item.Merchant.business_name}
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      </div>
                    ))
                  }
                </Slider>
              </div>
            </Grid.Row>
          </Grid>
          <Grid container>
            <Grid.Row>
              <Header as='h4'
                style={{textTransform: 'uppercase'}}>
                Recently Viewed Products
              </Header>
              <div style={
                {
                  width: '100%',
                  marginBottom: '20px',
                }
              }>
                <Slider {...sliderSettings}>
                  {
                    product.RelatedProducts.map((item, k) => (
                      <div key={k}>
                        <Card fluid as={Link} to={`/product/${item.slug}`}>
                          <Image src={item.Images[0].url} wrapped ui={false} />
                          <Card.Content>
                            <Card.Header>{item.name}</Card.Header>
                            <Card.Meta>
                              <span className='date'>
                                {formatNaira(item.price)}
                              </span>
                            </Card.Meta>
                            <Card.Description>
                              <Rating defaultRating={item.ProductRating.rating}
                                maxRating={5} />
                            </Card.Description>
                            <Card.Description>
                              Sold by: {item.Merchant.business_name}
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      </div>
                    ))
                  }
                </Slider>
              </div>
            </Grid.Row>
          </Grid> */}
        </div>
      </Responsive>
    );
  }
};

class MobileProductLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <Responsive
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Grid container style={{margin: '50px auto'}}>

        </Grid>
      </Responsive>
    );
  }
}


class Product extends Component {
  render() {
    return (
      <ResponsiveContainer {...this.props}>
        <DesktopProductLayout {...this.props} />
        <MobileProductLayout {...this.props} />
      </ResponsiveContainer>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Product);
