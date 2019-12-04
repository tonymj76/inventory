import React, {useState, useEffect} from 'react';
import {getAllCategories, getMerchant} from 'actions';
import {connect} from 'react-redux';
import LayoutContainer from 'components/display_layout';
import Product from './product';
import {
  Segment,
  Image,
  Grid,
  Menu,
  Header,
  Container,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import bgImage from 'assets/imgs/ocm-slide1.jpg';
import styled from 'styled-components';
import {selectSubCategoriesList} from 'selectors/category';

const mapStateToProps =(state) => ({
  id: state.user.user.id,
  merchant: state.merchant.getMerchant,
  categories: selectSubCategoriesList(state),
});

const ResponsiveContainer = (props) => {
  const {children, history} = props;
  return (
    <div id='product-page'>
      <LayoutContainer children={children} history={history} />
    </div>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const ImageContainer = styled.div`
  object-fit: cover;
  height: 46vh;
  width: 100%;
`;

const MerchantInfo = styled.ul`
  list-style: none;
  display: flex;

  li {
    margin-left: 2rem;
  }
`;

const VerticalMenu = styled.menu`
  width: 9rem !important;
`;

const MyPage = (props) => {
  const [activeCategoryId, setActiveCategoryId] = useState();
  const [activeCategoryName, setActiveCategoryName] = useState();
  const handleItemClick = (e, {name, id}) => {
    setActiveCategoryId(id);
    setActiveCategoryName(name);
  };
  const {categories, merchant} = props;

  const products = (merchant && merchant.products) ? merchant.products : [];

  useEffect(() => {
    props.getMerchant(props.id);
    props.getAllCategories();
  }, []);

  return (
    <ResponsiveContainer {...props}>
      <ImageContainer as={Image} src={bgImage} />
      <Segment style={{margin: '1rem 0em 3rem'}}>
        <MerchantInfo>
          <li>Home</li>
          <li>page</li>
          <li>vision</li>
        </MerchantInfo>
      </Segment>
      <Grid as={Container}>
        <Grid.Row>
          <Grid.Column computer={2} mobile={4}>
            <VerticalMenu as={Menu} pointing secondary vertical>
              <Menu.Item
                name='All My Products'
                active={!activeCategoryId}
                onClick={handleItemClick}
              />
              {categories.map((category) => (
                <Menu.Item
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  active={activeCategoryId === category.id}
                  onClick={handleItemClick}
                />
              ))}
            </VerticalMenu>
          </Grid.Column>

          <Grid.Column computer={14} mobile={12}>
            <Header as="h2">
              {`My ${activeCategoryId ? activeCategoryName + ' ' : 'Products'}`}
            </Header>
            <Grid container>
              <Grid.Row>
                {products.map((p) => activeCategoryId &&
                activeCategoryId!=p.category_id ? null :(
                    <Grid.Column key={p.id} computer={4}
                      tablet={5} mobile={16}
                      style={{
                        paddingLeft: 0,
                        paddingBottom: '1rem',
                      }}>
                      <Product item={p} merchantName={merchant.business_name} />
                    </Grid.Column>
                  ))}
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </ResponsiveContainer>
  );
};

export default connect(
  mapStateToProps,
  {getAllCategories, getMerchant}
)(MyPage);
