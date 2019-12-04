import React, {Component} from 'react';
import {
  Form,
  Button,
  Popup,
  Icon,
} from 'semantic-ui-react';
import StyledComponents from 'components/styled';
import {UserSchema, UserModel} from 'models/User';
import validate from 'react-joi-validation';
import _ from 'lodash';
import {addMerchantUserDetail} from 'actions';
import {connect} from 'react-redux';

const {Error} = StyledComponents;

export class MerchantUserDetails extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      user,
      addMerchantUserDetail,
      errors,
      nextStep,
    } = this.props;
    if (!_.some(user, (value) => value==='') && _.isEmpty(errors)) {
      addMerchantUserDetail(nextStep, user);
    }
  }
  render() {
    const {
      user: {
        first_name,
        last_name,
        user_name,
        email,
        password,
        password_confirmation,
      },
      errors,
      changeHandler,
      validateHandler,
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field required>
          <label htmlFor="first_name">First name</label>
          <input
            placeholder='First name' className='border_down'
            value={first_name} name='first_name' id='first_name'
            onChange={changeHandler('first_name')}
            onBlur={validateHandler('first_name')} />
          <Error>{errors.first_name}</Error>
        </Form.Field>
        <Form.Field required>
          <label htmlFor="last_name">Last name</label>
          <input
            placeholder='Last name' className='border_down'
            value={last_name} name='last_name' id="last_name"
            onChange={changeHandler('last_name')}
            onBlur={validateHandler('last_name')} />
          <Error>{errors.last_name}</Error>
        </Form.Field>
        <Form.Field required>
          <label>User name</label>
          <input placeholder='User name' className='border_down'
            value={user_name} name='user_name'
            onChange={changeHandler('user_name')}
            onBlur={validateHandler('user_name')}/>
          <Error>{errors.user_name}</Error>
        </Form.Field>
        <Popup
          trigger = {
            <Form.Field required>
              <label htmlFor="email">Email</label>
              <input type='email'
                placeholder='email' className='border_down'
                value={email} name='email' id="email"
                onChange={changeHandler('email')}
                onBlur={validateHandler('email')}/>
              <Error>{errors.email}</Error>
            </Form.Field>
          }
        >
          <Popup.Header>
            <Icon name='mail' color='orange' size='small'/>
            Login Email
          </Popup.Header>
          <Popup.Content>
            <em>
            This email address will be use as your LOGIN Address
            </em>
          </Popup.Content>
        </Popup>

        <Form.Field required>
          <label htmlFor="password">Password</label>
          <input type='password'
            placeholder='password' className='border_down'
            value={password} name='password' id="password"
            onChange={changeHandler('password')}
            onBlur={validateHandler('password')}/>
          <Error>{errors.password}</Error>
        </Form.Field>
        <Form.Field required>
          <label htmlFor="confirm_password">
                      Password confirmation</label>
          <input type='password' placeholder='password confirmation'
            className='border_down'
            value={password_confirmation} id="confirm_password"
            onChange={changeHandler('password_confirmation')}
            onBlur={validateHandler('password_confirmation')}/>
          <Error>{errors.password_confirmation}</Error>
        </Form.Field>
        <Button
          type='submit'
          size="big"
          className='tmj black-text'>Next</Button>
      </Form>
    );
  }
}

MerchantUserDetails.defaultProps = {
  user: {
    ...UserModel,
  },
};

const validationOptions = {
  joiSchema: UserSchema,
  only: 'user',
  joiOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};

export default connect(
  null,
  {addMerchantUserDetail}
)(validate(MerchantUserDetails, validationOptions));
