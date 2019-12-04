import React from 'react';
import logo from 'assets/icons/OCM-logo-desktops.svg';
import {Menu, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';


export const UserDashboardMenu = [
  {
    type: 'image',
    url: logo,
    size: 'small',
    link: '/',
    alt: 'lifthub logo',
    attr: '',
    subMenu: [],

  },
  {
    link: '/customer/dashboard',
    icon: 'dashboard',
    name: 'Dashboard',
    size: 'small',
    subMenu: [],
  },
  {
    link: '/customer/orders',
    icon: 'dolly',
    name: 'orders',
    size: 'small',
    subMenu: [],
  },
  {
    link: '/customer/complaints',
    icon: 'clipboard outline',
    name: 'lodge complaints',
    size: 'small',
    subMenu: [],
  },
  {
    link: '/merchant-signup',
    icon: 'shopping bag',
    name: 'become a merchant',
    size: 'small',
    subMenu: [],
  },
  {
    link: '/customer/inbox',
    icon: 'envelope open outline',
    name: 'inbox',
    size: 'small',
    subMenu: [],
  },
  {
    type: 'accordion',
    name: 'settings',
    panels: [
      {
        key: 'settings-menu',
        title: {
          content: 'SETTINGS',
        },
        content: {
          content: (
            <div>
              <Menu.Item as={Link}
                to='/customer/account/edit'
              >
                <Icon
                  name='edit outline'
                  size='tiny'
                />
                Edit Profile
              </Menu.Item>
              <Menu.Item as={Link}
                to='/customer/account/change-pwd'
              >
                <Icon
                  name='lock'
                  size='tiny'
                />
                Change Password
              </Menu.Item>
            </div>
          ),
        },
      },
    ],
  },
];

export const CourierMenu = [
  {
    type: 'image',
    url: logo,
    size: 'small',
    link: '/',
    alt: 'lifthub logo',
    attr: '',
    subMenu: [],

  },
  {
    link: '/courier/dashboard',
    icon: 'dashboard',
    name: 'Dashboard',
    color: 'blue',
    size: 'small',
    subMenu: [],
  },
  {
    link: '/courier/orders',
    icon: 'product hunt',
    name: 'all orders',
    size: 'small',
    color: 'teal',
    subMenu: [],
  },

  {
    link: '/courier/transaction',
    icon: 'payment',
    name: 'transaction',
    size: 'small',
    color: 'teal',
    subMenu: [],
  },
  {
    link: '/courier/inbox',
    icon: 'inbox',
    name: 'inbox',
    size: 'small',
    color: 'olive',
    subMenu: [],
  },
  {
    link: '/courier/settings',
    icon: 'settings',
    name: 'settings',
    size: 'small',
    color: 'green',
    subMenu: [],
  },
];

export const MerchantMenu = [
  {
    type: 'image',
    url: logo,
    size: 'small',
    link: '/',
    alt: 'lifthub logo',
    attr: '',
    subMenu: [],

  },
  {
    link: '/merchant',
    icon: 'dashboard',
    name: 'Dashboard',
    color: 'blue',
    size: 'small',
    subMenu: [],
  },
  {
    link: '/merchant/orders',
    icon: 'product hunt',
    name: 'all orders',
    size: 'small',
    color: 'teal',
    subMenu: [],
  },
  {
    type: 'accordion',
    name: 'product',
    panels: [
      {
        key: 'product-view',
        title: {
          content: 'PRODUCT',
        },
        content: {
          content: (
            <div>
              <Menu.Item as={Link}
                to='/merchant/product'
              >
                <Icon
                  name='product hunt'
                  size='mini'
                  color='red'
                />
                View Product
              </Menu.Item>
              <Menu.Item as={Link}
                to='/merchant/product/add'
              >
                <Icon
                  name='plus'
                  size='mini'
                  color='blue'
                />
                Add Product
              </Menu.Item>
            </div>
          ),
        },
      },
    ],
  },

  {
    link: '/merchant/transaction',
    icon: 'payment',
    name: 'transaction',
    size: 'small',
    color: 'teal',
    subMenu: [],
  },
  {
    link: '/merchant/inbox',
    icon: 'inbox',
    name: 'inbox',
    size: 'small',
    color: 'olive',
    subMenu: [],
  },
  {
    link: '/merchant/settings',
    icon: 'settings',
    name: 'settings',
    size: 'small',
    color: 'green',
    subMenu: [],
  },
];


export const AdminSideBar = [
  {
    type: 'image',
    url: logo,
    size: 'small',
    link: '/',
    alt: 'lifthub logo',
    attr: '',
    subMenu: [],

  },
  {
    link: '/admin/',
    icon: 'dashboard',
    name: 'Dashboard',
    color: 'blue',
    size: 'small',
    subMenu: [],
  },
  {
    link: '/admin/calendar',
    icon: 'calendar',
    name: 'Calendar',
    color: 'blue',
    size: 'small',
    subMenu: [],
  },
  {
    link: '/admin/category',
    icon: 'ravelry',
    name: 'Category',
    color: 'blue',
    size: 'small',
    subMenu: [],
  },
];

