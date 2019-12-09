import request from 'helpers/request';
import {showToast} from 'utils';

import {
  addToken,
  removeToken,
  addUser,
  removeUser,
} from '../actions';

const Auth = {
  login: (data, {dispatch, history}) => {
    return request({
      url: '/login',
      method: 'POST',
      data,
    }, false).then((res) => {
      if (res.status === 200) {
        const {token, current_user} = res.data;
        dispatch(addToken(token));
        dispatch(addUser(current_user));

        showToast('success', 'Login Successful');
        Auth.loginRedirect(current_user, history);
        return Promise.resolve(true);
      }
    }).catch((err) => {
      const errors = err.response.data.errors;
      for (const prop in errors) {
        if (prop) {
          showToast('error', errors[prop], 'Error!');
        }
      }
    });
  },

  loginRedirect: (currentUser, hist) => {
    if (currentUser.is_admin) {
      hist.push('/admin');
    } else if (currentUser.is_courier) {
      hist.push('/courier/dashboard');
    } else if (currentUser.is_merchant) {
      hist.push('/merchant');
    } else hist.push('/');
  },

  logout: ({dispatch, history}) => {
    request({
      url: '/signout',
      method: 'DELETE',
    }, false).then(() => {
      dispatch(removeToken());
      dispatch(removeUser());
      showToast('success', 'Logged out!!');
      history.push('/');
    }).catch((err) => {
      console.error(err);
    });
  },
};

export default Auth;
