import React from 'react';
import mobileLogo from 'assets/icons/OCM-logo-mobiles.svg';
import {Grid, Image, Item, List} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default function Footer({m: mobile=false}) {
  return (
    <footer id="dashboard-footer">
      <Grid container stackable={mobile}>
        <Grid.Row>
          <Grid.Column width={4}>
            <Item as={Link} to='/'>
              <Image
                src={mobileLogo}
                size={mobile ? 'small': 'big'}
                floated={mobile? 'left' : 'right'}
                centered={mobile}
              />
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
  );
};
