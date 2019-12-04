import React, {PureComponent} from 'react';
import './Header.scss';

class Header extends PureComponent {
  render() {
    const menu = this.props.menu;
    return (
      <div className="header-container white-bg">
        <h2 className="top-header">{menu}</h2>
        <div className="sub-header">
          <h5>
            <i className="icofont-md icofont-ui-calendar"
              style={{paddingRight: '5px'}}/>
            {menu} &emsp; / &emsp;
            <i className="calendar icofont-ui-calendar"
              style={{paddingRight: '5px'}}/>
            {menu}
          </h5>
        </div>
      </div>
    );
  }
}

export default Header;
