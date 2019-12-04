import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  Table,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {getMerchant} from 'actions';
import ProductItems from './ProductItems';

const mapStateToProps =(state) => ({
  id: state.user.user.id,
  merchant: state.merchant.getMerchant,
});

class Product extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  async componentDidMount() {
    await this.props.getMerchant(
      this.props.id
    );
  }
  render() {
    const {products} = this.props.merchant;
    return (
      <section className="merchant-grid">
        {products? (
          <Table striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Stock</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Rate</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {products.length ? null : (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <h3 style={{textAlign: 'center'}}>
                      They are no products at the moment
                    </h3>
                  </Table.Cell>
                </Table.Row>
              )}
              {products.map((p) => (
                <ProductItems product={p} key={p.id} />
              ))
              }
            </Table.Body>
          </Table>
        ) : (<Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>)
        }
      </section>
    );
  }
};

export default connect(
  mapStateToProps,
  {getMerchant}
)(Product);

