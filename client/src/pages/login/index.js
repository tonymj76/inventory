import React, {Component} from 'react';
import {connect} from 'react-redux';
import validate from 'react-joi-validation';
import {
  Button,
  Form,
  Grid,
  Segment,
  Header,
  Menu,
  Image,
  Responsive,
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import StyledComponents from 'components/styled';
import {LoginSchema} from 'models/User';
import Auth from 'services/auth';
import logo from 'assets/icons/OCM-logo-mobiles.svg';

const {Error} = StyledComponents;

const mapDispatchToProps = (dispatch) => ({dispatch});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCredentials: {},
      loginFailed: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  authenticateUser = async () => {
    const {dispatch, history} = this.props;
    await Auth.login(this.state.userCredentials,
      {dispatch, history}).then((res) => {
      if (!res) {
        this.setState({loginFailed: true});
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const {user} = this.props;

    this.setState({
      userCredentials: {...user},
    }, () => this.authenticateUser()
    );
  };

  render() {
    const {
      user: {email, password},
      errors,
      changeHandler,
      validateHandler,
    } = this.props;
    const {loginFailed} = this.state;

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
        <Segment vertical
          style={{marginBottom: '2rem', marginTop: '5rem'}}>
          <Grid container stackable
            style={{marginBottom: '2rem', marginTop: '2rem'}}>
            <Grid.Row centered>
              <Header as='h1'
                style={{fontWeight: 500}}>
                Login
              </Header>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column computer={8} mobile={16} tablet={10}>
                <Form size='large' onSubmit={this.handleSubmit}>
                  <Form.Field error={loginFailed}>
                    <label>Email</label>
                    <input type='email'
                      placeholder='email' className='border_down'
                      value={email} name='email'
                      onChange={changeHandler('email')}
                      onBlur={validateHandler('email')} />
                    <Error>{errors.email}</Error>
                  </Form.Field>
                  <Form.Field error={loginFailed}>
                    <label>Password</label>
                    <input type='password'
                      placeholder='password' className='border_down'
                      value={password} name='password'
                      onChange={changeHandler('password')}
                      onBlur={validateHandler('password')} />
                    <Error>{errors.password}</Error>
                  </Form.Field>
                  <Button type='submit' primary>Login</Button>
                  <Button as={Link} to='/signup'
                    style={{
                      marginTop: '2rem',
                      background: 'transparent',
                      color: '#ecb73a',
                    }}>
              Don't have an account? Signup.
                  </Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
};

Login.defaultProps = {
  email: '',
  password: '',
};

const validationOptions = {
  joiSchema: LoginSchema,
  only: 'user',
  joiOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};

export default connect(
  null,
  mapDispatchToProps
)(validate(Login, validationOptions));
