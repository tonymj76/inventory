import React, {PureComponent} from 'react';
import {Dropdown, Responsive, Icon} from 'semantic-ui-react';
import Auth from 'services/auth';
import './MobileDropdownMenu.scss';
import {connect} from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';

const trigger = (
  <Responsive>
    <i className='icofont-md icofont-ui-user'
      name="user" style={{margin: '0 3px 0 0'}}/>
      user
  </Responsive>
);

const mapStateToProps = (state, props) => ({
  firstName: state.user.first_name,
  router: props.router,
});

const mapDispatchToProps = (dispatch) => ({dispatch});

const mobileTrigger = (
  <span className='mobile-top-dropdown'>
    <Icon size='large'
      name='ellipsis vertical' />
  </span>
);

const options = ({firstName, dispatch, history}) => ([
  {
    key: 'user',
    text: (
      <span>
        Signed in as <strong>{firstName}</strong>
      </span>
    ),
    disabled: true,
  },
  {key: 'profile', text: 'Your Profile',
    icon: (<i
      className='icofont-mg icofont-ui-user'
    />)},
  {key: 'stars', text: 'Your Stars'},
  {key: 'explore', text: 'Explore'},
  {key: 'integrations', text: 'Integrations'},
  {key: 'help', text: 'Help'},
  {key: 'settings', text: 'Settings'},
  {key: 'sign-out', text: (
    <span onClick={() => {
      Auth.logout({dispatch});
      history.push('/');
    }}>
        Sign Out
    </span>)},
]);

class MyPage extends PureComponent {
  render() {
    const mobile = this.props.mobile;
    return <Dropdown
      trigger={mobile ? mobileTrigger : trigger}
      options={options(this.props)}
      icon={false}
    />;
  }
}

const container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyPage);

export default withRouter(container);
