import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Navbar} from '../layout/navbar';
import TopMenu from './TopMenu/TopMenu';
import MyMenu from 'components/Dashboard/TopMenu/MyMenu';
import {
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Image,
} from 'semantic-ui-react';
import './dashboard_layout.scss';
import mobileLogo from 'assets/icons/OCM-logo-mobiles.svg';
import Footer from 'components/Dashboard/Footer';

const getWidth = () => {
  const isSSR = typeof window === 'undefined';

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

export class DesktopContainer extends Component {
  state = {}
  render() {
    const {children, sideBar} = this.props;
    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Sidebar.Pushable as={Segment}
          id='dashboard-sidebar'>
          <Sidebar
            as={Menu}
            icon='labeled'
            vertical
            visible
            width='wide'
            animation='slide along'
          >
            <Navbar sideBar={sideBar} />
          </Sidebar>

          <Sidebar.Pusher id='body_width' className='body-grey-bg'>
            <Segment
              vertical
            >
              <TopMenu/>
              {children}
            </Segment>
            <Footer />
          </Sidebar.Pusher>
        </Sidebar.Pushable>

      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

export class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({sidebarOpened: false})

  handleToggle = () => this.setState({sidebarOpened: true})

  render() {
    const {children, sideBar} = this.props;
    const {sidebarOpened} = this.state;

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation='push'
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
          style={{marginTop: '2rem'}}
          id='mobile-sidebar'
        >
          <Navbar sideBar={sideBar} />
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}
          className='body-grey-bg'
        >
          <Segment
            textAlign='center'
            style={{padding: '1em 0em'}}
            vertical
          >
            <Menu pointing secondary size='large'
              className='white-bg mobile-top-menu'>

              <Menu.Item onClick={this.handleToggle} position='left'>
                <i
                  className='icofont-md
                    icofont-navigation-menu
                    primary-text'/>
              </Menu.Item>

              <Menu.Item>
                <Image src={mobileLogo} alt='OCM-logo'
                  size='small'
                />
              </Menu.Item>

              <Menu.Item position='right'>
                <MyMenu mobile={true}/>
              </Menu.Item>
            </Menu>
          </Segment>

          {children}
          <Footer m={true}/>
        </Sidebar.Pusher>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};
