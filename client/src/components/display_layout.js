import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import validate from 'react-joi-validation';
import desktopLogo from 'assets/icons/OCM-logo-mobiles.svg';
import mobileLogo from 'assets/icons/OCM-logo-fav.svg';
import Auth from 'services/auth';
import {
  Button,
  Container,
  Menu,
  Responsive,
  Segment,
  Visibility,
  Image,
  Header,
  Input,
  Sidebar,
  Grid,
  Popup,
  Item,
  List,
  Form,
  Select,
  Accordion,
  Icon,
  Modal,
} from 'semantic-ui-react';

import {LocationSchema, LocationModel} from 'models/Location';
import {
  selectorCategoryOptionList,
  selectorCategorized,
} from 'selectors/category';
import {getCartList} from 'selectors/cart';
import {getLoggedInUser} from 'selectors/user';
import {getStatesList, getTransformedStatesByName} from 'selectors/state';
import {
  searchProducts,
  getMerchantsProductsByLocation,
  addLocation} from 'actions';
import StyledComponents from './styled';

const {Error} = StyledComponents;

const phoneNumber = '08012312312';

const getWidth = () => {
  const isSSR = typeof window === 'undefined';

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '.5em',
  marginTop: '0em',
  transition: 'box-shadow 0.7s ease,padding 0.5s ease, border 0.7s ease-in-out',
};
const mobileMenuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  margin: '0em',
  transition: 'box-shadow o.5s ease, padding 0.5s ease',
};

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
};

const menuLogoSizeFix = {
  height: '60px',
};

const menuLogoSize = {
  height: '30px',
};

const mapStateToProps = (state) => ({
  token: state.token,
  deliveryLocation: state.location,
  user: getLoggedInUser(state),
  categoriesOptionsList: selectorCategoryOptionList(state),
  ...selectorCategorized(state),
  cartCount: getCartList(state).length,
  transformedStates: getTransformedStatesByName(state),
  states: getStatesList(state),
});

const mapDispatchToProps = (dispatch) => ({dispatch});

class DesktopContainer extends Component {
  state = {
    menuFixed: false,
    overlayFixed: false,
    searchInput: '',
    searchCategory: '',
    cities: [],
  }

  categoryMenu = React.createRef();

  showCategoryMenu = () => {
    const categoryMenuElement = this.categoryMenu.current;
    categoryMenuElement.style.visibility = 'visible';
  }

  hideCategoryMenu = () => {
    const categoryMenuElement = this.categoryMenu.current;
    categoryMenuElement.style.visibility = 'hidden';
  }

  stickTopMenu = () => this.setState({menuFixed: true})

  unStickTopMenu = () => this.setState({menuFixed: false})

  handleSearchChange = (e) => {
    const {target: {value}} = e;
    this.setState({
      searchInput: value,
    });
  }

  handleSearchCategorySelect = (e, category) => {
    this.setState({
      searchCategory: category.value,
    });
  }

  handleProductsSearch = () => {
    const {searchInput, searchCategory} = this.state;
    const {dispatch, history} = this.props;
    const searchData = searchCategory ?
      {
        q: searchInput,
        category_id: searchCategory,
      } : {q: searchInput};

    dispatch(searchProducts(searchData));
    history.push('/products/search');
  }

  openModal = () => this.setState({isModalOpen: true});
  closeModal = () => this.setState({isModalOpen: false});

  fetchProducts = async (data) => {
    const {dispatch} = this.props;
    await dispatch(getMerchantsProductsByLocation(data));
  }

  handleLocationChange = () => {
    this.closeModal();
    const {selectedCity, selectedState} = this.state;
    if (selectedState && selectedCity) {
      const queryParams = {
        state: selectedState,
        city: selectedCity,
      };

      this.fetchProducts(queryParams);
      addLocation({
        state: selectedState,
        city: selectedCity,
      });
    }
  }

  handleCancelClick = () => {
    const {deliveryLocation} = this.props;
    if (_.isEmpty(deliveryLocation)) {
      this.setState({
        selectedCity: '',
        selectedState: '',
      }, () => this.closeModal());
    }
    this.closeModal();
  }

  handleStateSelect = (event, new_state) => {
    const {changeValue, states} = this.props;
    const cities = this.transformCitiesByName(_.find(states,
      ['name', new_state.value]).cities);
    changeValue('state', new_state.value);
    this.setState({
      selectedState: new_state.value,
      cities,
    });
  };

  handleCitySelect = (event, new_city) => {
    const {changeValue} = this.props;
    changeValue('city', new_city.value);
    this.setState({selectedCity: new_city.value});
  };

  transformCitiesByName = (values) => {
    const citiesOptions = [];
    _.forEach(values,
      (value) => {
        citiesOptions.push({
          key: value.id,
          text: value.name,
          value: value.name,
        });
      });
    return citiesOptions;
  };

  render() {
    const {
      menuFixed,
      searchInput,
      searchCategory,
      cities,
      isModalOpen,
    } = this.state;
    const {
      children,
      token,
      user,
      deliveryLocation,
      categoriesOptionsList,
      categorize: categories,
      cartCount,
      transformedStates,
      location: {
        state,
        city,
      },
      validateHandler,
      errors,
      dispatch,
      history,
    } = this.props;

    return (
      <Responsive getWidth={getWidth} id="layout-container-desktop"
        minWidth={Responsive.onlyTablet.minWidth}>
        <Modal
          open={isModalOpen}
          onClose={this.closeModal}
          size='mini'
          closeIcon>
          <Modal.Header>
            Choose Delivery Location
          </Modal.Header>
          <Modal.Content scrolling
            style={{minHeight: '40vh'}}>
            <Form>
              <Form.Field>
                <label htmlFor='state'>State</label>
                <Select
                  search
                  id='state'
                  name='state'
                  options={transformedStates}
                  placeholder='State'
                  value={state}
                  onChange={this.handleStateSelect}
                  onBlur={validateHandler('state')}
                />
                <Error>{errors.state}</Error>
              </Form.Field>
              <Form.Field>
                <label htmlFor='city'>City</label>
                <Select
                  disabled={cities.length <= 0}
                  search
                  id='city'
                  name='city'
                  options={cities}
                  placeholder='City'
                  value={city}
                  onChange={this.handleCitySelect}
                  onBlur={validateHandler('city')}
                />
                <Error>{errors.city}</Error>
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='blue'
              onClick={this.handleLocationChange}
              inverted>
              Done
            </Button>
            <Button color='red'
              onClick={this.handleCancelClick} inverted>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
        <div className='header'>
          <Menu
            borderless
            style={{margin: '0px'}}
            size='small'
          >
            <Container style={{marginTop: '.7rem'}}>
              <Menu.Item position='left'
                as={Link} to='/'
                style={{paddingLeft: '0em'}}>
                <Image src={desktopLogo}
                  style={menuFixed ? menuLogoSizeFix : menuLogoSize} />
              </Menu.Item>
              <Menu.Item position='right'>
                {/* <Icon name='phone volume' color='blue' size='large'/> */}
                <i className='icofont-lg icofont-ui-dial-phone' />
              &nbsp;{phoneNumber}
              </Menu.Item>


              <Menu.Item as={Link} to='/cart'
                className='flex-links'>
                {
                  cartCount && (
                    <div className='tmj' style={{
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      border: '2px solid',
                      borderRadius: '50%',
                      left: '27px',
                      top: '5px',
                      position: 'absolute',
                    }}>{cartCount}</div>
                  ) || ''
                }
                {/* <Icon name='cart' size='large' /> */}
                <i className="icofont-2x icofont-cart-alt" />
                <Responsive as='p' className='one-pt-one-rem' minWidth={992}>
                My Cart
                </Responsive>
              </Menu.Item>

              <Menu.Item as={Link} to='/wishlist' className='flex-links'>
                <Icon name='heart outline' size='large'/>
                <Responsive as='p' className='one-pt-one-rem' minWidth={992}>
                Wishlist
                </Responsive>
              </Menu.Item>

              <Popup on='hover' hoverable position='bottom right'
                flowing trigger={
                  <Menu.Item className='flex-links'>
                    <Icon name='user outline' size='large' />
                    <Responsive as='p'
                      className='one-pt-one-rem'
                      minWidth={992}>
                      My Account
                    </Responsive>
                  </Menu.Item>
                }>
                {
                  token ? (
                    <div>
                      <p>Welcome, {user.user_name}</p>
                      <Button fluid className='tmj white-text'
                        as={Link} to={'/customer/dashboard'}>
                        My Account
                      </Button>
                      <br />
                      <Button fluid
                        onClick={() => Auth.logout({dispatch, history})}>
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button fluid className='tmj white-text'
                        as={Link} to='/login'>
                          Sign in
                      </Button>
                      <p style={{
                        marginBottom: 0,
                        paddingTop: '4px',
                      }}>New customer?</p>
                      <Button fluid className='tmj white-text'
                        as={Link} to='/signup'>
                          Join now
                      </Button>
                    </div>
                  )
                }
              </Popup>

              <Menu.Item position='right'>
                {
                  token ? (
                    <div>
                      <Button inverted={menuFixed}
                        primary={menuFixed} style={{marginLeft: '0.5em'}}
                        onClick={() => Auth.logout({dispatch, history})}>
                      Logout
                      </Button>
                      <Button as={Link} to={'/customer/dashboard'}
                        inverted={menuFixed} primary={menuFixed}
                        style={{marginLeft: '0.5em'}} >
                      Dashboard
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button as={Link}
                        to='/login' inverted={menuFixed}
                        primary={menuFixed} style={{marginLeft: '0.5em'}}>
                        Log in
                      </Button>
                      <Button as={Link} to='/signup'
                        inverted={menuFixed} primary={menuFixed}
                        style={{marginLeft: '0.5em'}}>
                        Sign Up
                      </Button>
                    </div>
                  )
                }

              </Menu.Item>

            </Container>
          </Menu>

          <Visibility
            once={false}
            onBottomPassed={this.stickTopMenu}
            onBottomVisible={this.unStickTopMenu}
          >
            <Menu
              borderless
              fixed={menuFixed ? 'top' : null}
              style={menuFixed ? fixedMenuStyle : menuStyle}
            >
              <Grid container verticalAlign='middle'>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Popup on='click' hoverable position='bottom left'
                      flowing trigger={
                        <Menu.Item style={{paddingLeft: '0em'}}>
                          <Icon name='indent' />
                        Categories
                        </Menu.Item>
                      }>
                      {
                        categories && categories.length ? (
                          <Grid relaxed divided
                            columns={categories.length}>
                            {
                              categories.map((item) => (
                                <Grid.Column key={item.id}>
                                  <Header as={Link}
                                    to={{
                                      pathname: `/category/${(item.name)
                                        .toLowerCase()}`,
                                      state: {
                                        cat_id: item.id,
                                        cat_name: item.name,
                                      },
                                    }}>{item.name}</Header>
                                  <List link>
                                    {
                                      item.sub_categories.map((sub) => (
                                        <List.Item as={Link} key={sub.id}
                                          to={{
                                            pathname: `/products/${sub.name}`,
                                            state: {
                                              category: {
                                                id: sub.id,
                                                name: sub.name,
                                              },
                                            },
                                          }}>
                                          {sub.name}
                                        </List.Item>
                                      ))
                                    }
                                  </List>
                                </Grid.Column>
                              ))
                            }
                          </Grid>
                        ) : 'No categories loaded'
                      }
                    </Popup>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Menu.Item content={
                      <Form onSubmit={this.handleProductsSearch}
                        style={{width: '100%'}}>
                        <Input as={Form.Input}
                          placeholder='Search products...'
                          action>
                          <input name="search" type='text'
                            style={{borderRadius: 0}}
                            value={searchInput}
                            onChange={(e) => this.handleSearchChange(e)} />
                          <Select compact
                            value={searchCategory}
                            options={categoriesOptionsList}
                            onChange={
                              (e, cat) =>
                                this.handleSearchCategorySelect(e, cat)}
                            style={{borderRadius: 0}} />
                          <Button icon
                            style={{borderRadius: 0}}
                            onClick={() => this.handleProductsSearch}>
                            <i className='icofont-md icofont-search' />
                          </Button>
                        </Input>
                      </Form>
                    } />
                  </Grid.Column>
                  <Grid.Column width={6} style={{padding: '0'}}>
                    {
                      _.isEmpty(deliveryLocation) && (
                        <div style={{display: 'flex'}}>
                          <p style={{marginBottom: 0, color: '#000'}}>
                            <Icon name='location arrow'
                              className='tmj-text' />
                          No delivery location
                          </p>
                          <Button compact
                            className='tmj-text'
                            onClick={this.openModal}
                            style={{
                              padding: 0,
                              marginLeft: '4px',
                              background: 'transparent'}}>
                          SET LOCATION
                            <Icon name='chevron right' />
                          </Button>
                        </div>
                      ) || (
                        <div style={{display: 'flex'}}>
                          <p className='tmj-text'
                            style={{marginBottom: 0}}>
                            <Icon name='location arrow'
                              className='tmj-text' />
                            {deliveryLocation.city.name}, {deliveryLocation
                              .state.name}
                          </p>
                          <Button compact
                            onClick={this.openModal}
                            style={{
                              padding: 0,
                              marginLeft: '4px',
                              background: 'transparent',
                            }}>
                            CHANGE LOCATION
                            <Icon name='chevron right' />
                          </Button>
                        </div>
                      )
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Menu>
          </Visibility>
        </div>
        <div className='categories-nav'>
          <div className='category-container'>
            <div className='categories'>
              <ul className='catalog-submenu'>
                {
                  categories.map((c, index) => (
                    <li className='submenu-item'
                      key={index}
                      onMouseEnter={this.showCategoryMenu}
                      onMouseLeave={this.hideCategoryMenu}>
                      <i className='icofont icofont-phone link-icon' />
                      <a className='link-text'>{c.name}</a>
                      <i className='icofont icofont-caret-right link-arrow' />
                      <div className='category-menu-wrapper'
                        ref={this.categoryMenu}>
                        <div className='category-column'>
                          {
                            c.sub_categories.map((s, index) => (
                              <div className='category-item' key={index}>
                                <a className='category-title'>{s.name}</a>
                                <ul className='category-item-list'>
                                  <li className='category-list-item'>
                                    <a className='category-list-item-link'>
                                      iPhone</a>
                                    <a className='category-list-item-link'>
                                      Samsung</a>
                                    <a className='category-list-item-link'>
                                      Infinix</a>
                                    <a className='category-list-item-link'>
                                      Huawei</a>
                                  </li>
                                </ul>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
        <div className='main'>
          {children}
        </div>
        <div className='adverts-nav'>
        </div>

        <footer>
          <Grid container>
            <Grid.Row>
              <Grid.Column width={4}>
                <Item as={Link} to='/'>
                  <Image src={desktopLogo} size='small' floated='right' />
                </Item>
              </Grid.Column>
              <Grid.Column width={6}>
                <List link floated='right'>
                  <List.Item as={Link} to='/'
                    className='footer-link'>Help &amp; Information
                  </List.Item>
                  <List.Item as={Link} to='/'
                    className='footer-link'>Contact &amp; Support</List.Item>
                  <List.Item as={Link} to='/'
                    className='footer-link'>Vendor</List.Item>
                  <List.Item as={Link} to='/'
                    className='footer-link'>Track Deliveries</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={6}>
                <List link floated='right'>
                  <List.Item as={Link} to='/'
                    className='footer-link'>About Us</List.Item>
                  <List.Item as={Link} to='/'
                    className='footer-link'>Terms &amp; Conditions</List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid container textAlign='center'>
                <Grid.Column>
                  &copy; {(new Date()).getFullYear()}.
                  All Rights Reserved.
                </Grid.Column>
              </Grid>
            </Grid.Row>
          </Grid>
        </footer>
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};


class MobileContainer extends Component {
  state = {
    searchInput: '',
    activeIndex: 0,
    cities: [],
  }

  handleSearchChange = (e) => {
    const {target: {value}} = e;
    this.setState({
      searchInput: value,
    });
  }

  handleAccordionCollapse = (e, titleProps) => {
    const {index} = titleProps;
    const {activeIndex} = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({activeIndex: newIndex});
  }

  handleProductsSearch = () => {
    const {searchInput} = this.state;
    const {dispatch, history} = this.props;
    const searchData = {q: searchInput};
    dispatch(searchProducts(searchData));
    history.push('/products/search');
  }

  handleSidebarHide = () => this.setState({sidebarOpened: false})

  handleToggle = () => this.setState({sidebarOpened: true})

  openModal = () => this.setState({isModalOpen: true});
  closeModal = () => this.setState({isModalOpen: false});

  fetchProducts = async (data) => {
    const {dispatch} = this.props;
    await dispatch(getMerchantsProductsByLocation(data));
  }

  handleLocationChange = () => {
    this.closeModal();
    const {selectedCity, selectedState} = this.state;
    if (selectedState && selectedCity) {
      const queryParams = {
        state: selectedState,
        city: selectedCity,
      };

      this.fetchProducts(queryParams);
      dispatch(addLocation({
        state: selectedState,
        city: selectedCity,
      }));
    }
  }

  handleCancelClick = () => {
    const {deliveryLocation} = this.props;
    if (_.isEmpty(deliveryLocation)) {
      this.setState({
        selectedCity: '',
        selectedState: '',
      }, () => this.closeModal());
    }
    this.closeModal();
  }

  handleStateSelect = (event, new_state) => {
    const {changeValue, states} = this.props;
    const cities = this.transformCitiesByName(_.find(states,
      ['name', new_state.value]).cities);
    changeValue('state', new_state.value);
    this.setState({
      selectedState: new_state.value,
      cities,
    });
  };

  handleCitySelect = (event, new_city) => {
    const {changeValue} = this.props;
    changeValue('city', new_city.value);
    this.setState({selectedCity: new_city.value});
  };

  transformCitiesByName = (values) => {
    const citiesOptions = [];
    _.forEach(values,
      (value) => {
        citiesOptions.push({
          key: value.id,
          text: value.name,
          value: value.name,
        });
      });
    return citiesOptions;
  };

  render() {
    const {
      children,
      dispatch,
      history,
      cartCount,
      categorize: categories,
      fetch: fetching,
      token,
      user,
      deliveryLocation,
      transformedStates,
      location: {
        state,
        city,
      },
      validateHandler,
      errors,
    } = this.props;
    const {
      sidebarOpened,
      searchInput,
      activeIndex,
      cities,
      isModalOpen,
    } = this.state;

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Modal
          open={isModalOpen}
          onClose={this.closeModal}
          size='mini'
          closeIcon>
          <Modal.Header>
            Choose Delivery Location
          </Modal.Header>
          <Modal.Content scrolling
            style={{minHeight: '40vh'}}>
            <Form>
              <Form.Field>
                <label htmlFor='state'>State</label>
                <Select
                  search
                  id='state'
                  name='state'
                  options={transformedStates}
                  placeholder='State'
                  value={state}
                  onChange={this.handleStateSelect}
                  onBlur={validateHandler('state')}
                />
                <Error>{errors.state}</Error>
              </Form.Field>
              <Form.Field>
                <label htmlFor='city'>City</label>
                <Select
                  disabled={cities.length <= 0}
                  search
                  id='city'
                  name='city'
                  options={cities}
                  placeholder='City'
                  value={city}
                  onChange={this.handleCitySelect}
                  onBlur={validateHandler('city')}
                />
                <Error>{errors.city}</Error>
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='blue'
              onClick={this.handleLocationChange}
              inverted>
              Done
            </Button>
            <Button color='red'
              onClick={this.handleCancelClick} inverted>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
          style={{
            marginTop: '1em',
            backgroundColor: '#fff',
          }}
        >
          <Header style={{
            padding: '5px',
            marginBottom: '0em',
          }}>
            <i className="icofont icofont-spoon-and-fork" />
            Categories
          </Header>
          {
            !fetching && (
              <Accordion as={Menu} vertical fluid
                style={{
                  borderRadius: 0,
                  border: 'none',
                }}>
                {
                  categories.map((item, index) => (
                    <Menu.Item key={item.id}>
                      <Accordion.Title
                        active={activeIndex === index}
                        content={
                          <p>
                            <i className="icofont icofont-restaurant" />
                            {item.name}
                          </p>
                        }
                        index={index}
                        onClick={this.handleAccordionCollapse}
                      />
                      <Accordion.Content active={activeIndex === index}>
                        {
                          item.sub_categories.map((sub) => (
                            <Menu.Item as={Link} key={sub.id}
                              to={{
                                pathname: `/category/${(sub.name)
                                  .toLowerCase()}`,
                                state: {
                                  cat_id: sub.id,
                                  cat_name: sub.name,
                                },
                              }}>
                              <i className="icofont icofont-soup-bowl" />
                              {sub.name}
                            </Menu.Item>
                          ))
                        }
                      </Accordion.Content>
                    </Menu.Item>
                  ))
                }
              </Accordion>
            ) || ''
          }
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment vertical style={{padding: '0'}}>
            <Menu pointing borderless
              secondary style={mobileMenuStyle}>
              <Container text>
                <Menu.Item onClick={this.handleToggle}>
                  <i className="icofont-md icofont-navigation-menu"></i>
                </Menu.Item>
                <Menu.Item as={Link} to='/'>
                  <Image src={mobileLogo} style={{height: '30px'}}
                    alt='investlift logo' />
                </Menu.Item>
              </Container>
              <Menu.Menu position='right'>
                <Menu.Item as={Link} to='/cart'>
                  <i className="icofont-2x icofont-cart-alt" />
                  {
                    cartCount && (
                      <div className='tmj' style={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        borderRadius: '50%',
                        border: '2px solid',
                        left: '28px',
                        top: '-1px',
                        position: 'absolute',
                      }}>{cartCount}</div>
                    ) || ''
                  }
                </Menu.Item>
                <Menu.Item>
                  <i className="icofont-md icofont-heart-alt" />
                </Menu.Item>
                <Menu.Item>
                  <Popup on='hover' hoverable position='bottom right'
                    flowing trigger={
                      <Menu.Item style={{marginBottom: '-8px'}}>
                        <i className="icofont-md icofont-ui-user" />
                      </Menu.Item>
                    }>
                    {
                      token ? (
                        <div>
                          <p>Welcome, {user.user_name}</p>
                          <Button fluid color='red'
                            as={Link} to={'/customer/dashboard'}>
                            My Account
                          </Button>
                          <br/>
                          <Button fluid
                            onClick={() => Auth.logout({dispatch, history})}>
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Button fluid color='red'
                            as={Link} to='/login'>
                            Sign in
                          </Button>
                          <p style={{
                            marginBottom: 0,
                            paddingTop: '4px',
                          }}>New customer?</p>
                          <Button fluid color='red'
                            as={Link} to='/signup'>
                            Join now
                          </Button>
                        </div>
                      )
                    }
                  </Popup>
                </Menu.Item>
              </Menu.Menu>
            </Menu>

            <Menu pointing secondary>
              <Grid container>
                <Grid.Row>
                  <Grid.Column width={12} style={{padding: '0'}}>
                    <Menu.Item content={
                      <Form onSubmit={this.handleProductsSearch}
                        style={{width: '100%'}}>
                        <Form.Input name="search" type='text'
                          value={searchInput}
                          onChange={(e) => this.handleSearchChange(e)}
                          placeholder='Search products...' />
                      </Form>
                    }>
                    </Menu.Item>
                  </Grid.Column>
                  <Grid.Column width={4} verticalAlign='middle'>
                    <Popup on='click' position='bottom right'
                      trigger={
                        <Menu.Item>
                          <Icon name='location arrow'
                            size='large'
                            className='tmj-text' />
                        </Menu.Item>
                      }>
                      {
                        _.isEmpty(deliveryLocation) && (
                          <div>
                            <p style={{marginBottom: 0}}>
                              No delivery location
                            </p>
                            <Button compact
                              className='tmj-text'
                              onClick={this.openModal}
                              style={{
                                padding: 0,
                                background: 'transparent',
                              }}>
                              SET LOCATION
                            </Button>
                          </div>
                        ) || (
                          <div>
                            <p style={{marginBottom: 0}}>
                              Delivering to:&emsp;
                              <span className='tmj-text'>
                                {deliveryLocation.city.name}, {deliveryLocation
                                  .state.name}
                              </span>
                            </p>
                            <Button compact
                              className='tmj-text'
                              onClick={this.openModal}
                              style={{
                                padding: 0,
                                background: 'transparent',
                              }}>
                              CHANGE LOCATION
                            </Button>
                          </div>
                        )
                      }
                    </Popup>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Menu>
          </Segment>

          {children}
          {/* Footer */}
          <footer>
            <Grid container stackable>
              <Grid.Row>
                <Grid.Column>
                  <Item as={Link} to='/'>
                    <Image src={mobileLogo} size='small' />
                  </Item>
                </Grid.Column>
                <Grid.Column>
                  <List link>
                    <List.Item as={Link} to='/'
                      className='footer-link'>Help &amp; Information</List.Item>
                    <List.Item as={Link} to='/'
                      className='footer-link'>Contact &amp; Support</List.Item>
                    <List.Item as={Link} to='/'
                      className='footer-link'>Vendor</List.Item>
                    <List.Item as={Link} to='/'
                      className='footer-link'>Track Deliveries</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List link>
                    <List.Item as={Link} to='/'
                      className='footer-link'>About Us</List.Item>
                    <List.Item as={Link} to='/'
                      className='footer-link'>Terms &amp; Conditions</List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row centered>
                <Grid container textAlign='center'>
                  <Grid.Column>
                    &copy; {(new Date()).getFullYear()}.
                    All Rights Reserved.
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid>
          </footer>
        </Sidebar.Pusher>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

class LayoutContainer extends Component {
  render() {
    return (
      <React.Fragment>
        <DesktopContainer {...this.props} />
        <MobileContainer {...this.props} />
      </React.Fragment>
    );
  }
}

LayoutContainer.defaultProps = {
  location: {
    ...LocationModel,
  },
};

const validationOptions = {
  joiSchema: LocationSchema,
  only: 'location',
  joiOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};


export default validate(connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayoutContainer), validationOptions);
