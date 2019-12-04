import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import validate from 'react-joi-validation';
import {
  Grid,
  Form,
  Button,
} from 'semantic-ui-react';
import {UpdateUserSchema, UpdateUserModel} from 'models/User';
import UserAPI from 'api/user';
import StyledComponents from 'components/styled';
import DashboardContainer from '../container/DashboardContainer';
import {getLoggedInUser} from 'selectors/user';

const {Error} = StyledComponents;

const mapStateToProps = (state) => {
  const current_user = getLoggedInUser(state);
  const update_user = {...UpdateUserModel};
  Object.keys(update_user).map((key) => {
    update_user[key] = current_user[key];
  });
  return {
    current_user,
    user: {...update_user},
  };
};

class EditProfile extends PureComponent {
  state = {
    isSubmitting: false,
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {user} = this.props;
    this.setState((prevState) => ({
      isSubmitting: !prevState.isSubmitting,
    }));

    UserAPI.updateUser(user).then(() => {
      this.setState((prevState) => ({
        isSubmitting: !prevState.isSubmitting,
      }));
    });
  }
  render() {
    const {
      user: {
        first_name,
        last_name,
        user_name,
      },
      current_user,
      errors,
      changeHandler,
      validateHandler,
    } = this.props;

    const {isSubmitting} = this.state;
    return (
      <DashboardContainer>
        <Grid container padded>
          <Grid.Row centered>
            <Grid.Column computer={8} mobile={16} tablet={10}>
              <Form onSubmit={this.handleSubmit}
                loading={isSubmitting}>
                <Form.Field>
                  <label>First Name</label>
                  <input autoFocus
                    placeholder='First Name'
                    value={first_name} name='first_name'
                    onChange={changeHandler('first_name')}
                    onBlur={validateHandler('first_name')} />
                  <Error>{errors.first_name}</Error>
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <input
                    placeholder='Last Name'
                    value={last_name} name='last_name'
                    onChange={changeHandler('last_name')}
                    onBlur={validateHandler('last_name')} />
                  <Error>{errors.last_name}</Error>
                </Form.Field>
                <Form.Field>
                  <label>Username</label>
                  <input placeholder='Username'
                    value={user_name} name='user_name'
                    onChange={changeHandler('user_name')}
                    onBlur={validateHandler('user_name')} />
                  <Error>{errors.user_name}</Error>
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <input type='email'
                    value={current_user.email} name='email' readOnly />
                </Form.Field>
                <Button type='submit'
                  fluid
                  className='tmj white-text'>
                  SAVE
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DashboardContainer>
    );
  }
};

EditProfile.defaultProps = {
  user: {...UpdateUserModel},
};

const validationOptions = {
  joiSchema: UpdateUserSchema,
  only: 'user',
  joiOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};


export default validate(connect(
  mapStateToProps,
  null
)(EditProfile), validationOptions);
