import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
  Grid,
  Header,
  Breadcrumb,
} from 'semantic-ui-react';
import StyledComponents from 'components/styled';
import LayoutContainer from 'components/display_layout';
import ProductCard from 'components/product';
import {getSubcategories} from 'selectors/category';
import {getCategoryProducts} from 'selectors/product';

import bg from 'assets/imgs/meals.jpg';

const {
  Banner,
  BannerHeadingWrapper,
  BlackButton,
  Heading,
} = StyledComponents;

const ResponsiveContainer = ({children, history}) => (
  <div>
    <LayoutContainer children={children} history={history} />
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const mapStateToProps = (state, props) => {
  const {location: {state: {cat_id}}} = props;
  const products = getCategoryProducts(state, cat_id);
  const sub_categories = getSubcategories(state, cat_id);

  const sub_categories_products = [];
  if (sub_categories && sub_categories.length) {
    sub_categories.map((sub) => {
      sub_categories_products.push({
        ...sub,
        category_id: sub.id,
        products: getCategoryProducts(state, sub.id),
      });
    });
  }
  return {
    sub_categories,
    sub_categories_products,
    products,
  };
};

class Category extends React.Component {
  state = {}

  render() {
    const {
      location: {state: {cat_name, cat_id}},
      sub_categories_products,
    } = this.props;

    return (
      <ResponsiveContainer {...this.props}>
        <div style={{padding: '1rem'}}>
          {
            cat_name ? (
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
                      {cat_name}
                    </Breadcrumb.Section>
                  </Breadcrumb>
                </Grid.Row>
                <Grid.Row as={Link}
                  to={{
                    pathname: `/products/${cat_name}`,
                    state: {
                      category: {
                        id: cat_id,
                        name: cat_name,
                      },
                    },
                  }} style={{marginBottom: '2rem'}}>
                  <Banner
                    image={bg} style={{height: '30vh'}}>
                    <Grid container padded>
                      <Grid.Row centered>
                        <Grid.Column computer={8}
                          tablet={8} mobile={16}>
                          <BannerHeadingWrapper style={{
                            paddingTop: '30px',
                            paddingBottom: '30px',
                          }}>
                            <Heading>{cat_name} meals</Heading>
                          </BannerHeadingWrapper>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Banner>
                </Grid.Row>
                {
                  sub_categories_products && sub_categories_products.length ? (
                    sub_categories_products.map((sub) => (
                      <Grid padded key={sub.id}
                        style={{paddingLeft: 0, paddingRight: 0}}>
                        <Link to={{
                          pathname: `/products/${sub.name}`,
                          state: {
                            category: {
                              id: sub.id,
                              name: sub.name,
                            },
                          },
                        }} style={{padding: 0, margin: 0}}>
                          <BlackButton style={
                            {margin: 0, padding: '10px 40px'}
                          }>{sub.name}</BlackButton>
                        </Link>
                        <Grid.Row>
                          {
                            sub.products && sub.products.length ? (
                              sub.products.map((p) => (
                                <Grid.Column key={p.id} computer={3}
                                  tablet={5} mobile={16}
                                  style={{
                                    paddingLeft: 0,
                                    paddingBottom: '1rem',
                                  }}>
                                  <ProductCard item={p} />
                                </Grid.Column>
                              ))
                            ) : ''
                          }
                          <Grid.Column computer={2} tablet={4}
                            mobile={8} floated='right'>
                            <Header as={Link}
                              to={{
                                pathname: `/products/${sub.name}`,
                                state: {
                                  category: {
                                    id: sub.id,
                                    name: sub.name,
                                  },
                                },
                              }}
                              style={{
                                fontWeight: 500,
                                fontSize: '1.15em',
                                textDecoration: 'underline',
                                color: 'rgba(0,0,0,0.8)',
                              }}>SEE ALL</Header>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    ))
                  ) : ''
                }
              </Grid>
            ) : ''
          }
        </div>
      </ResponsiveContainer>
    );
  }
};

export default connect(
  mapStateToProps,
  null
)(Category);
