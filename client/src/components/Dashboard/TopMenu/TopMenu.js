import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Menu, Dropdown, Responsive} from 'semantic-ui-react';
import TopSearch from './TopSearch';
import MyMenu from './MyMenu';
import Notification from '../Notification/Notification';
import './TopMenu.scss';

class TopMenu extends Component {
  state = {activeItem: 'inbox'};

  handleItemClick = (e, {name}) => this.setState({activeItem: name});

  render() {
    const {activeItem} = this.state;

    const iconStyle = {
      margin: '0 10px 0 0',
    };

    return (
      <Menu pointing secondary className="top-menu">
        <Menu.Menu postion="left" className="menu-logo">
          <Menu.Item>
            <Link to="dashboard">Dashboard</Link>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu className="center menu">
          <Menu.Item
            name="home"
            active={activeItem === 'home'}
            onClick={this.handleItemClick}
          >
            <i className='icofont-md icofont-home primary-text'
              style={iconStyle} />
            <Responsive as='p' minWidth={992}>Home</Responsive>
          </Menu.Item>

          <Menu.Item
            name="portfolio"
            active={activeItem === 'portfolio'}
            onClick={this.handleItemClick}
          >
            <i className="icofont-md icofont-cubes" style={iconStyle} />
            <Responsive minWidth={992}>Portfolio</Responsive>
            <Dropdown>
              <Dropdown.Menu>
                <Dropdown.Header>Categories</Dropdown.Header>
                <Dropdown.Item>Home Goods</Dropdown.Item>
                <Dropdown.Item>Bedroom</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Order</Dropdown.Header>
                <Dropdown.Item>Status</Dropdown.Item>
                <Dropdown.Item>Cancellations</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu.Menu>

        <Menu.Menu position="right">
          <Menu.Item>
            <TopSearch />
          </Menu.Item>
          <Menu.Item name="notification"
            onClick={this.handleItemClick}
            style={{paddingRight: '0px', paddingLeft: '0px'}}
          >
            <Notification icon="icofont-md icofont-alarm" numOfNew={3} />
          </Menu.Item>
          <Menu.Item name="message"
            onClick={this.handleItemClick}
            style={{paddingRight: '0px', paddingLeft: '0px'}}
          >
            <i className="icofont-md icofont-ui-messaging" style={iconStyle} />
          </Menu.Item>
          <Menu.Item
            name="setting"
            onClick={this.handleItemClick}
            style={{paddingLeft: '0px'}}
          >
            <MyMenu mobile={false}/>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default TopMenu;
