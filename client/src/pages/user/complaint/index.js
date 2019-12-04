import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import validate from 'react-joi-validation';
import {
  Grid,
  Form,
  Button,
} from 'semantic-ui-react';
import {ComplaintSchema, ComplaintModel} from 'models/complaint';
import StyledComponents from 'components/styled';
import DashboardContainer from '../container/DashboardContainer';
import {getLoggedInUser} from 'selectors/user';

const {Error} = StyledComponents;
const complaintCategories = [
  {key: '1', text: 'payment', value: 'payment'},
  {key: '2', text: 'order placement', value: 'order placement'},
  {key: '3', text: 'order delivery', value: 'order delivery'},
];

const mapStateToProps = (state) => {
  const current_user = getLoggedInUser(state);
  return {
    current_user,
  };
};

class Complaint extends PureComponent {
  state = {
    isSubmitting: false,
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {user} = this.props;
    this.setState((prevState) => ({
      isSubmitting: !prevState.isSubmitting,
    }));

    UserAPI.createComplaint(user).then(() => {
      this.setState((prevState) => ({
        isSubmitting: !prevState.isSubmitting,
      }));
    });
  }
  render() {
    const {
      complaint: {
        category,
        statement,
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
                  <label>Name</label>
                  <input readOnly
                    value={
                      current_user.first_name + ' ' +
                      current_user.last_name
                    } />
                  <Error>{errors.first_name}</Error>
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <input type='email'
                    value={current_user.email} name='email' readOnly />
                </Form.Field>
                <Form.Field>
                  <label>Category</label>
                  <Form.Select
                    fluid
                    placeholder='Complaint Category'
                    options={complaintCategories}
                    value={category}
                    onChange={
                      (e, option) =>
                        this.handleComplaintCategorySelect(e, option)} />
                </Form.Field>
                <Form.Field>
                  <label>Complaint</label>
                  <textarea placeholder='Complaint...'
                    rows={4}
                    value={statement} name='statement'
                    onChange={changeHandler('statement')}
                    onBlur={validateHandler('statement')}>
                  </textarea>
                  <Error>{errors.statement}</Error>
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

Complaint.defaultProps = {
  complaint: {...ComplaintModel},
};

const validationOptions = {
  joiSchema: ComplaintSchema,
  only: 'complaint',
  joiOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};


export default validate(connect(
  mapStateToProps,
  null
)(Complaint), validationOptions);
