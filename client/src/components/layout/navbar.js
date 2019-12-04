import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Menu,
  Divider,
  Image,
  Dropdown,
  Icon,
  Accordion,
} from 'semantic-ui-react';
import Auth from 'services/auth';


export const Navbar = (props) => {
  const {sideBar: menus} = props;
  return (
    menus.map((menu) => {
      if (menu.type === 'divider') {
        return <Divider />;
      }
      if (menu.type === 'image') {
        return (
          <Menu.Item as={Link} to={menu.link} key={menu.url}>
            <Image src={menu.url} alt={menu.alt} size={menu.size}/>
          </Menu.Item>
        );
      }
      if (menu.type === 'accordion') {
        return (
          <Accordion
            defaultActiveIndex={0}
            panels={menu.panels}
            key={menu.name}
            as={Menu.Item}
            // styled
          />
        );
      }
      return (
        <Menu.Item as={Link} to={menu.link} key={menu.name.toLowerCase()}>
          <Icon name={menu.icon}
            size={menu.size}
            color={menu.color}
          />
          {menu.name.toUpperCase()}
        </Menu.Item>
      );
    })
  );
};

Navbar.propTypes = {
  menus: PropTypes.array,
};

export const UserAccount = (props) => {
  const {topBar: menus} = props;
  return (
    menus.map((menu, i) => {
      if (menu.type === 'divider') {
        return (
          <Menu.Item>
            |
          </Menu.Item>
        );
      }
      if (menu.type === 'avatar') {
        return (
          <Menu.Item>
            <Image src={menu.url} alt={menu.alt} size={menu.size} circular/>
          </Menu.Item>
        );
      }
      if (menu.type === 'header') {
        return (
          <Dropdown text={menu.name} pointing className='link item'>
            <Dropdown.Menu>
              <Dropdown.Header>Profile</Dropdown.Header>
              <Dropdown.Item>{menu.name_s}</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() =>
                Auth.logout(props)}>
                {menu.name_logout}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
      return (
        <Menu.Item as={Link} to={menu.link} key={i}>
          <i className={`icofont-${menu.icon} icofont-${menu.size}`}
            style={{color: menu.color}} />
        </Menu.Item>
      );
    })
  );
};

UserAccount.propTypes = {
  menus: PropTypes.array,
};
