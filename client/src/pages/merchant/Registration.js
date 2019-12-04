import React, {PureComponent} from 'react';
import MerchantForm from './MainForm';
import {Menu,
  Container,
  Image,
  Segment,
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from 'assets/icons/OCM-logo-mobiles.svg';


export default class MerchantRegistration extends PureComponent {
  render() {
    return (
      <div>
        <Menu fixed='top'
          className='white'
          size='small'
        >
          <Container>
            <Menu.Item as={Link} to='/'>
              <Image src={logo}
                alt='one city mart' size='small' />
            </Menu.Item>
          </Container>
        </Menu>
        <Container>
          <Segment id='merchant-registration-form'>
            <MerchantForm/>
          </Segment>
        </Container>
      </div>

    );
  }
}
