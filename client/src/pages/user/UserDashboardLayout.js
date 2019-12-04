import React, {PureComponent} from 'react';
import ResponsiveContainer from '../MainContainer';
import Header from 'components/Dashboard/Header/Header';
import {UserDashboardMenu} from 'models/Menus';

class UserDashboardLayout extends PureComponent {
  render() {
    return (
      <ResponsiveContainer sideNav={UserDashboardMenu}>
        <Header menu={this.props.children.props.name}/>
        {this.props.children}
      </ResponsiveContainer>
    );
  }
}

export default UserDashboardLayout;
