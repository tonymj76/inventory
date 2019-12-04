import React, {PureComponent} from 'react';
import ResponsiveContainer from '../MainContainer';
import Header from 'components/Dashboard/Header/Header';
import {MerchantMenu} from 'models/Menus';

class Merchant extends PureComponent {
  render() {
    return (
      <ResponsiveContainer sideNav={MerchantMenu}>
        <Header menu={this.props.children.props.name}/>
        {this.props.children}
      </ResponsiveContainer>
    );
  }
}

export default Merchant;
