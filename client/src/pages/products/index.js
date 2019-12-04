import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
  Responsive,
  Grid,
  Accordion,
  Form,
  Menu,
  Header,
  Breadcrumb,
  Dropdown,
  Pagination,
  Button,
  List,
} from 'semantic-ui-react';

import {formatNaira} from 'utils';
import LayoutContainer from 'components/display_layout';
import {getCategoryProducts, getProductsList} from 'selectors/product';
import ProductCard from 'components/product';
import ProductMobile from 'components/product_mobile';

const getWidth = () => {
  const isSSR = typeof window === 'undefined';

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

const ResponsiveContainer = ({children, history}) => (
  <div id='products-page'>
    <LayoutContainer children={children} history={history} />
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const PriceForm = (
  <Form>
    <Form.Group grouped>
      <Form.Checkbox
        label={`${formatNaira(300)} - ${formatNaira(500)}`} name='color'
        value={`${formatNaira(300)} - ${formatNaira(500)}`} />
      <Form.Checkbox
        label={`${formatNaira(500)} - ${formatNaira(1000)}`} name='color'
        value={`${formatNaira(300)} - ${formatNaira(500)}`} />
      <Form.Checkbox
        label={`${formatNaira(1000)} - ${formatNaira(1500)}`} name='color'
        value={`${formatNaira(300)} - ${formatNaira(500)}`} />
      <Form.Checkbox label={`${formatNaira(1500)} and above`} name='color'
        value={`${formatNaira(1500)} and above`} />
    </Form.Group>
  </Form>
);

const VendorsForm = (
  <Form>
    <Form.Group grouped>
      <Form.Checkbox label='Crunchies Ltd.' name='size'
        value='Crunchies Ltd.' />
      <Form.Checkbox label='Mama Iyabo' name='size'
        value='Mama Iyabo' />
      <Form.Checkbox label='Ace Chops' name='size'
        value='Ace Chops' />
      <Form.Checkbox label='Bottom Belle Foods' name='size'
        value='Bottom Belle Foods' />
    </Form.Group>
  </Form>
);

const sortOptions = [
  {key: 0, value: 'Most Popular', text: 'Most Popular'},
  {key: 1, value: 'Lowest Price', text: 'Lowest Price'},
  {key: 2, value: 'Highest Price', text: 'Highest Price'},
  {key: 3, value: 'Best Rating', text: 'Best Rating'},
  {key: 4, value: 'Newest', text: 'Newest'},
];
const pageOptions = [
  {key: 0, value: 1, text: 'Page 1'},
  {key: 1, value: 2, text: 'Page 2'},
  {key: 2, value: 3, text: 'Page 3'},
  {key: 3, value: 4, text: 'Page 4'},
  {key: 4, value: 5, text: 'Page 5'},
];

const mapStateToProps = (state, props) => {
  const {location} = props;
  if (location.state !== undefined) {
    const category = location.state.category;
    return {
      products: getCategoryProducts(state, category.id),
    };
  } else {
    return {
      products: getProductsList(state),
    };
  }
};

class DesktopProductsLayout extends React.Component {
  state = {
    showFilters: [
      {
        index: 0,
        show: true,
      },
      {
        index: 1,
        show: true,
      },
    ],
    activePage: 1,
    totalPages: 12,
  }

  handleClick = (e, titleProps) => {
    const {index} = titleProps;
    const {showFilters} = this.state;

    const temp = [...showFilters];
    temp[index].show = temp[index].show ? false : true;

    this.setState({
      showFilters: [...temp],
    });
  }

  handlePaginationChange = () => {
    // TODO: Make API request for pagination
  }

  render() {
    const {
      showFilters,
      activePage,
      totalPages,
    } = this.state;
    let category = {};

    const {
      location,
      products,
    } = this.props;
    if (location.state !== undefined) {
      category = location.state.category;
    }

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <div style={{marginBottom: '50px'}}>
          <Grid container>
            <Grid.Row>
              <Breadcrumb>
                <Breadcrumb.Section href='/' style={{color: '#383737'}}>
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider style={{color: '#000'}} content={
                  <i className='icofont-1x icofont-simple-right' />
                } />
                <Breadcrumb.Section active>
                  {category.name ? category.name : ''}
                </Breadcrumb.Section>
              </Breadcrumb>
            </Grid.Row>
            <Grid.Column width={4}>
              <Accordion as={Menu} vertical>
                <Menu.Item>
                  <Accordion.Title
                    active
                    content='Vendors'
                    index={0}
                    onClick={this.handleClick}
                  />
                  <Accordion.Content active={showFilters[0].show}
                    content={VendorsForm} />
                </Menu.Item>

                <Menu.Item>
                  <Accordion.Title
                    active
                    content='Price'
                    index={1}
                    onClick={this.handleClick}
                  />
                  <Accordion.Content active={showFilters[1].show}
                    content={PriceForm} />
                </Menu.Item>
              </Accordion>
            </Grid.Column>
            <Grid.Column width={12}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16} textAlign='center'>
                    <Header as='h2'>
                      {category.name ? category.name.toUpperCase() : ''}
                    </Header>
                  </Grid.Column>
                  <Grid.Column width={16} textAlign='center'>
                    <p style={{color: 'rgba(0,0,0,0.75)', fontSize: '1.2rem'}}>
                      {
                        products && products.length ?
                          products.length : 0
                      } products
                    </p>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3} style={{
                  borderTop: '1px solid rgba(0,0,0,0.3)',
                }}>
                  <Grid.Column computer={6} tablet={6}>
                    <Pagination
                      activePage={activePage}
                      boundaryRange={1}
                      onPageChange={this.handlePaginationChange}
                      size='small'
                      siblingRange={null}
                      totalPages={totalPages}
                      firstItem={null}
                      lastItem={null}
                      prevItem={null}
                      nextItem={null}
                    />
                  </Grid.Column>
                  <Grid.Column verticalAlign='middle'
                    computer={6} tablet={4}>
                    <input type='range' multiple
                      min='0' max='2000' defaultValue='200' />
                  </Grid.Column>
                  <Grid.Column computer={4} tablet={6}>
                    <div style={{
                      border: '1px solid rgba(0,0,0,0.5)',
                      padding: '10px 5px',
                      fontSize: '0.9rem',
                    }}>
                      <span>
                        Sort By:&nbsp;&nbsp;
                        <Dropdown
                          inline
                          options={sortOptions}
                          defaultValue={sortOptions[0].value}
                        />
                      </span>
                    </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{
                  borderTop: '1px solid rgba(0,0,0,0.3)',
                  borderBottom: '1px solid rgba(0,0,0,0.3)',
                  paddingTop: '4em',
                  paddingBottom: '4em',
                }}>
                  {
                    products && products.length ? (
                      products.map((p) => (
                        <Grid.Column key={p.id} computer={4} tablet={5}>
                          <ProductCard item={p} />
                        </Grid.Column>
                      ))
                    ) : ''
                  }
                </Grid.Row>
                <Grid.Row centered>
                  <Pagination
                    activePage={activePage}
                    boundaryRange={1}
                    onPageChange={this.handlePaginationChange}
                    size='small'
                    siblingRange={null}
                    totalPages={totalPages}
                    firstItem={null}
                    lastItem={null}
                    prevItem={null}
                    nextItem={null}
                  />
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
      </Responsive>
    );
  }
};

class MobileProductsLayout extends React.Component {
  state = {
    activePage: 1,
    totalPages: 12,
    // viewType: 'list',
  }

  handlePaginationChange = () => {
    // TODO: Make API request for pagination
  }

  render() {
    const {
      activePage,
      // totalPages,
    } = this.state;

    let category = {};

    const {
      history,
      location,
      products,
    } = this.props;
    if (location.state !== undefined) {
      category = location.state.category;
    }

    return (
      <Responsive
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Grid style={{marginBottom: '1rem', marginTop: 0}}>
          <Grid.Row columns={2} style={{
            paddingBottom: 0,
            paddingTop: 0,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}>
            <Grid.Column width={4}>
              <Button compact style={{background: 'transparent'}}
                onClick={() => history.goBack()}>
                <i className='icofont-3x icofont-thin-left' />
              </Button>
            </Grid.Column>
            <Grid.Column textAlign='center' verticalAlign='middle'>
              <Header as='h4'>
                {category.name ? category.name.toUpperCase() : ''}
                <span>
                  <p style={{
                    color: 'rgba(0,0,0,0.75)',
                    fontSize: '1rem',
                    fontWeight: 100,
                  }}>
                    ({products && products.length ?
                      products.length : 0} products)
                  </p>
                </span>
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{
            paddingBottom: 0,
            paddingTop: 0,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}>
            <Grid.Column width={3} style={{
              paddingLeft: '10px',
              paddingRight: 0,
            }}>
              <Button fluid style={{
                background: 'transparent',
              }}>
                <i className='icofont-md icofont-delicious' />
              </Button>
            </Grid.Column>
            <Grid.Column width={8} style={{
              borderLeft: '1px solid rgba(0,0,0,0.1)',
              borderRight: '1px solid rgba(0,0,0,0.1)',
              paddingLeft: 0,
              paddingRight: 0,
            }}>
              <Button fluid style={{
                background: 'transparent',
              }}>
                <i className='icofont-md icofont-sort-alt' />
                <Dropdown text='Sort By'
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}>
                  <Dropdown.Menu>
                    {
                      sortOptions.map((item) => (
                        <Dropdown.Item text={item.text}
                          value={item.value} key={item.key} />
                      ))
                    }
                  </Dropdown.Menu>
                </Dropdown>
              </Button>
            </Grid.Column>
            <Grid.Column width={4} style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}>
              <Button as={Link} to={{
                pathname: '/catalog/filter',
                search: `?category=${category.name ? category.name : ''}`,
                state: {
                  cat_id: category.id ? category.id : null,
                },
              }} fluid style={{
                background: 'transparent',
              }}>
                <i className='icofont-md icofont-filter' />
                Filter
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid style={{
            marginLeft: '0.2rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}>
            {
              products && products.length ? (
                products.map((item) => (
                  <Grid.Row key={item.id} style={{
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                  }}>
                    <List relaxed='very' style={{width: '100%'}}>
                      <ProductMobile item={item} />
                    </List>
                  </Grid.Row>
                ))
              ) : ''
            }
          </Grid>
          <Grid.Row columns='equal' style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}>
            <Grid.Column textAlign='center'>
              <Button fluid disabled={activePage === 1}
                style={{background: 'transparent'}}>
                <i className='icofont-2x icofont-thin-left' />
              </Button>
            </Grid.Column>
            <Grid.Column verticalAlign='middle'>
              <Dropdown text={`Page ${activePage}`}
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                }}>
                <Dropdown.Menu>
                  {
                    pageOptions.map((item) => (
                      <Dropdown.Item text={item.text}
                        value={item.value} key={item.key} />
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Button fluid style={{background: 'transparent'}}>
                <i className='icofont-2x icofont-thin-right' />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Responsive>
    );
  }
};

class Products extends Component {
  render() {
    return (
      <ResponsiveContainer {...this.props}>
        <DesktopProductsLayout {...this.props} />
        <MobileProductsLayout {...this.props} />
      </ResponsiveContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(Products);
