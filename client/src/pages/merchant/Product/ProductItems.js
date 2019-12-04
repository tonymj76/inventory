import React from 'react';
import banga from 'assets/imgs/banga.jpg';
import {formatNaira} from 'utils';
import {
  Table,
  Header,
  Image,
  Rating,
} from 'semantic-ui-react';

const ProductItems = ({product}) => (
  <Table.Row>
    <Table.Cell>
      <Header as='h4' image>
        <Image
          src={banga}
          rounded
          size='mini' />
        <Header.Content>
          {product.name}
        </Header.Content>
      </Header>
    </Table.Cell>
    <Table.Cell>
      {product.quantity > 0 ? 'in stuck' : (
        `${product.quantity} not in stuck`
      )}</Table.Cell>
    <Table.Cell>{formatNaira(product.price)}</Table.Cell>
    <Table.Cell>
      <Rating
        icon='star'
        defaultRating={3}
        maxRating={3}
      />
    </Table.Cell>
    <Table.Cell>Categories</Table.Cell>
    <Table.Cell>
      {new Date(product.created_at).toDateString()}</Table.Cell>
  </Table.Row>
);

export default ProductItems;
