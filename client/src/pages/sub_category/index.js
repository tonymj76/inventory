import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {
  Grid,
  Header,
  Card,
  Image,
} from 'semantic-ui-react';

import {formatNaira} from 'utils';
import StyledComponents from 'components/styled';
import LayoutContainer from 'components/display_layout';
import bg from 'assets/imgs/meals.jpg';

const {BlackButton} = StyledComponents;

const ResponsiveContainer = ({children, history}) => (
  <div>
    <LayoutContainer children={children} history={history} />
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};


class SubCategory extends React.Component {
  render() {
    const {match, location} = this.props;
    const category = location.state;
    return (
      <ResponsiveContainer {...this.props}>
        <div style={{padding: '1rem'}}>
          {
            // Checks that requested route matches category
            match.params.sub_category_name === category.name.toLowerCase() ? (
              // The line below will cater for subcategories of a category
              // category.subcategories.map((s, key) => (
              <Grid container>
                <Link to={{
                  pathname: `/products/${category.name}`,
                  state: {
                    items: category.Products,
                    category: category.name,
                  },
                }} style={{padding: 0}}>
                  <BlackButton style={
                    {margin: 0, padding: '10px 40px'}
                  }>{category.name}</BlackButton>
                </Link>
                <Grid.Row>
                  {
                    category.Products.map((p, key) => (
                      <Grid.Column key={key} computer={3}
                        tablet={5} mobile={8}
                        style={{
                          paddingLeft: 0,
                          paddingBottom: '1rem',
                        }}>
                        <Card fluid as={Link} to={{
                          pathname: `/product/${p.slug}`,
                          state: p,
                        }}>
                          {/* <Image src={p.image} wrapped ui={false} /> */}
                          <Image src={bg} wrapped ui={false} />
                          <Card.Content>
                            <Card.Header>{p.name}</Card.Header>
                            <Card.Meta style={{fontSize: '1.1rem'}}>
                              <span className='date'>
                                {formatNaira(p.price)}
                              </span>
                            </Card.Meta>
                            {/*
                              <Card.Description style={{fontSize: '0.9rem'}}>
                                Sold by: {p.Merchant.business_name}
                              </Card.Description> */}
                          </Card.Content>
                        </Card>
                      </Grid.Column>
                    ))
                  }
                </Grid.Row>
                <Grid.Column computer={2} tablet={4}
                  mobile={8} floated='right'>
                  <Header as={Link}
                    to={{
                      pathname: `/products/${category.name}`,
                      state: {
                        items: category.Products,
                        category: {
                          id: category.id,
                          name: category.name,
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
              </Grid>
            ) : ''
          }
        </div>
      </ResponsiveContainer>
    );
  }
};

export default SubCategory;
