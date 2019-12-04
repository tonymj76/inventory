import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  DesktopContainer,
  MobileContainer,
} from 'components/Dashboard/dashboard_layout';


class ResponsiveContainer extends PureComponent {
  render() {
    const {children, sideNav} = this.props;
    return (
      <div>
        <DesktopContainer sideBar={sideNav}>
          {children}
        </DesktopContainer>
        <MobileContainer sideBar={sideNav}>
          {children}
        </MobileContainer>
      </div>
    );
  }
}


ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

export default ResponsiveContainer;
