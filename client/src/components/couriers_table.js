import React from 'react';
import {Table, Radio} from 'semantic-ui-react';
import {formatNaira} from 'utils';

class CouriersTable extends React.PureComponent {
  state = {
    courier: '',
  }

  toggleCheck = (e, value) => {
    this.setState({
      courier: value,
    });
  }

  sendSelectedCourier = (courier) => {
    this.props.setSelectedCourier(courier);
  }

  render() {
    const {items} = this.props;
    const {courier} = this.state;
    return (
      <Table unstackable={true} basic='very' style={{
        marginLeft: '1rem',
      }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Estimated Delivery
            </Table.HeaderCell>
            <Table.HeaderCell>
              Cost
            </Table.HeaderCell>
            <Table.HeaderCell>
              Courier
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            items && items.length ? (
              items.map((item) => (
                <Table.Row key={item.id}
                  style={
                    {
                      fontWeight: item.company_name === courier ?
                        'bold' : 'normal',
                    }
                  }>
                  <Table.Cell>
                    <Radio
                      checked={item.company_name === courier}
                      onChange={(e) => {
                        this.toggleCheck(e, item.company_name);
                        this.sendSelectedCourier(item);
                      }} />
                    <span style={{
                      paddingLeft: '1rem',
                    }}>40-45 minutes</span>
                  </Table.Cell>
                  <Table.Cell>
                    {formatNaira(item
                      .delivery_price
                      .default_price)}
                  </Table.Cell>
                  <Table.Cell>
                    {item.company_name}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : ''
          }
        </Table.Body>
      </Table>
    );
  }
};

export default CouriersTable;
