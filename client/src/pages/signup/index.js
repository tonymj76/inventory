import React, {Component} from 'react';
import validate from 'react-joi-validation';
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Segment,
  Header,
  Responsive,
  Menu,
  Image,
  Transition,
  Message,
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {UserSchema, UserModel} from 'models/User';
import UserAPI from 'api/user';
import StyledComponents from 'components/styled';

import soup from 'assets/imgs/beef-bowl.png';
import logo from 'assets/icons/OCM-logo-mobiles.svg';

const {Error} = StyledComponents;

class Signup extends Component {
  state = {
    user: {...UserModel},
    showMessage: false,
    isSubmitting: false,
  }

  componentWillUnmount() {
    this.setState((prevState) => ({
      showMessage: !prevState.showMessage,
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {user} = this.props;
    this.setState((prevState) => ({
      isSubmitting: !prevState.isSubmitting,
    }));

    this.setState((prevState) => {
      prevState.user.first_name = user.first_name;
      prevState.user.last_name = user.last_name;
      prevState.user.user_name = user.user_name;
      prevState.user.email = user.email;
      prevState.user.password = user.password;
      prevState.user.password_confirmation = user.password_confirmation;

      return {
        user: prevState.user,
      };
    }, () => UserAPI.register(this.state.user).then(() => {
      this.setState((prevState) => ({
        showMessage: !prevState.showMessage,
        isSubmitting: !prevState.isSubmitting,
      }));
    }));
  }

  handleMessageDismiss = () => {
    this.setState((prevState) => ({
      showMessage: !prevState.showMessage,
    }));
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

    const {showMessage, isSubmitting} = this.state;

    return (
      <div>
        <Menu borderless fixed='top'
          style={{
            margin: '0px',
            border: 'none',
            borderRadius: 0,
          }}
          size='small'>
          <Responsive minWidth={768}>
            <Menu.Item as={Link} to='/'>
              <Image src={logo} size='medium'
                style={{height: '60px'}} />
            </Menu.Item>
          </Responsive>
          <Responsive {...Responsive.onlyMobile}>
            <Menu.Item as={Link} to='/'>
              <Image src={logo} size='small'
                style={{height: '40px'}} />
            </Menu.Item>
          </Responsive>
        </Menu>
        <Transition
          visible={showMessage}
          animation='fade'
          duration={500}>
          <Grid container>
            <Grid.Row centered>
              <Message style={{
                marginTop: '50px',
                fontSize: '1.3rem',
                width: '100%',
              }}
              size='large'
              onDismiss={this.handleMessageDismiss}
              success>
                <Message.Header>Registration successful</Message.Header>
                <Message.Content>
                  Please <Link to='/login'>Login</Link> to continue
                </Message.Content>
              </Message>
            </Grid.Row>
          </Grid>
        </Transition>
        <Segment vertical
          style={{marginBottom: '2rem', marginTop: '2rem'}}>
          <Grid container stackable>
            <Grid.Row centered
              style={{marginBottom: '1rem'}}>
              <Header as='h1'
                style={{fontWeight: 500}}>
                Register
              </Header>
            </Grid.Row>
            <Grid.Row>
              <Responsive as={Grid.Column} minWidth={768}
                computer={8} tablet={6} style={{
                  backgroundImage: `url(${soup})`,
                  backgroundSize: 'cover',
                }} />
              <Grid.Column computer={8} mobile={16} tablet={10}>
                <Form onSubmit={this.handleSubmit}
                  loading={isSubmitting}>
                  <Form.Field>
                    <label htmlFor="first_name">First name</label>
                    <input
                      placeholder='First name' className='border_down'
                      value={first_name} name='first_name' id='first_name'
                      onChange={changeHandler('first_name')}
                      onBlur={validateHandler('first_name')} />
                    <Error>{errors.first_name}</Error>
                  </Form.Field>
                  <Form.Field>
                    <label htmlFor="last_name">Last name</label>
                    <input
                      placeholder='Last name' className='border_down'
                      value={last_name} name='last_name' id="last_name"
                      onChange={changeHandler('last_name')}
                      onBlur={validateHandler('last_name')} />
                    <Error>{errors.last_name}</Error>
                  </Form.Field>
                  <Form.Field>
                    <label>User name</label>
                    <input placeholder='User name' className='border_down'
                      value={user_name} name='user_name'
                      onChange={changeHandler('user_name')}
                      onBlur={validateHandler('user_name')} />
                    <Error>{errors.user_name}</Error>
                  </Form.Field>
                  <Form.Field>
                    <label htmlFor="email">Email</label>
                    <input type='email'
                      placeholder='email' className='border_down'
                      value={email} name='email' id="email"
                      onChange={changeHandler('email')}
                      onBlur={validateHandler('email')} />
                    <Error>{errors.email}</Error>
                  </Form.Field>
                  <Form.Field>
                    <label htmlFor="password">Password</label>
                    <input type='password'
                      placeholder='password' className='border_down'
                      value={password} name='password' id="password"
                      onChange={changeHandler('password')}
                      onBlur={validateHandler('password')} />
                    <Error>{errors.password}</Error>
                  </Form.Field>
                  <Form.Field>
                    <label htmlFor="confirm_password">
                      Password confirmation</label>
                    <input type='password' placeholder='password confirmation'
                      className='border_down'
                      value={password_confirmation} id="confirm_password"
                      onChange={changeHandler('password_confirmation')}
                      onBlur={validateHandler('password_confirmation')} />
                    <Error>{errors.password_confirmation}</Error>
                  </Form.Field>
                  <Form.Field>
                    <Checkbox label='I agree to the Terms and Conditions' />
                  </Form.Field>
                  <Button as={Link} to='/login' style={{
                    marginTop: '2rem',
                    background: 'transparent',
                    color: '#ecb73a',
                  }}>
                    Already have an account? Log In.
                  </Button>
                  <Button type='submit' primary>Sign Up</Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
};

Signup.defaultProps = {
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


export default validate(Signup, validationOptions);
