import React from 'react';
import validate from 'react-joi-validation';
import {Grid, Form, Button} from 'semantic-ui-react';
import UserAPI from 'api/user';
import StyledComponents from 'components/styled';
import DashboardContainer from '../container/DashboardContainer';
import {ChangePasswordModel, ChangePasswordSchema} from 'models/User';

const {Error} = StyledComponents;

class ChangePassword extends React.PureComponent {
  state = {
    isSubmitting: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {password} = this.props;
    this.setState((prevState) => ({
      isSubmitting: !prevState.isSubmitting,
    }));

    UserAPI.changePassword(password).then(() => {
      this.setState((prevState) => ({
        isSubmitting: !prevState.isSubmitting,
      }));
    });
  }

  render() {
    const {
      password: {
        current_password,
        new_password,
        retype_new_password,
      },
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
                  <label>Current Password</label>
                  <input placeholder='Current Password'
                    type='password'
                    value={current_password} name='current_password'
                    onChange={changeHandler('current_password')}
                    onBlur={validateHandler('current_password')} />
                  <Error>{errors.current_password}</Error>
                </Form.Field>
                <Form.Field>
                  <label>New Password</label>
                  <input placeholder='New Password'
                    type='password'
                    value={new_password} name='new_password'
                    onChange={changeHandler('new_password')}
                    onBlur={validateHandler('new_password')} />
                  <Error>{errors.new_password}</Error>
                </Form.Field>
                <Form.Field>
                  <label>Retype New Password</label>
                  <input placeholder='Retype New Password'
                    type='password'
                    value={retype_new_password} name='retype_new_password'
                    onChange={changeHandler('retype_new_password')}
                    onBlur={validateHandler('retype_new_password')} />
                  <Error>{errors.retype_new_password}</Error>
                </Form.Field>
                <Button type='submit'
                  fluid
                  className='tmj white-text'>
                  SUBMIT
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DashboardContainer>
    );
  }
};

ChangePassword.defaultProps = {
  password: {...ChangePasswordModel},
};

const validationOptions = {
  joiSchema: ChangePasswordSchema,
  only: 'password',
  joiOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};


export default validate(ChangePassword, validationOptions);
