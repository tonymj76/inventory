import React from 'react';
import {
  Card,
  Image,
  Rating,
} from 'semantic-ui-react';
import {formatNaira} from 'utils';
import bg from 'assets/imgs/meals.jpg';

class ProductCard extends React.Component {
  render() {
    const {item, merchantName} = this.props;
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
          <Card.Description
            style={{fontSize: '0.9rem'}}>
                Sold by: {merchantName}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
};

export default ProductCard;
