import React, {Component} from 'react';
import {
  Form,
  Button,
  TextArea,
  Select,
} from 'semantic-ui-react';
import StyledComponents from 'components/styled';
import {MerchantSchema, MerchantModel} from 'models/MerchantRegistration';
import validate from 'react-joi-validation';
import {connect} from 'react-redux';
import {addMerchantDetail} from 'actions';
import {
  getTransformedStatesByName,
  getStatesList,
} from 'selectors/state';
import _ from 'lodash';
import {withRouter} from 'react-router-dom';

const {Error} = StyledComponents;

const mapStateToProps = (state) => ({
  userId: state.user.user.userIdForMerchantRegForm,
  TransformedStateList: getTransformedStatesByName(state),
  stateList: getStatesList(state),
});

export class MerchantDetails extends Component {
  state = {};

  handleStateChange = (event, new_state) => {
    const {changeValue, stateList} = this.props;
    changeValue('state', new_state.value);
    this.setState({
      cities: _.find(stateList, ['name', new_state.value]).cities,
    });
  };

  handleCityChange = (event, mew_city) => {
    const {changeValue} = this.props;
    changeValue('city', mew_city.value);
  };

  transformCitiesByName = () => {
    const statesOptions = [];
    _.forEach(this.state.cities,
      (value) => {
        statesOptions.push({
          key: value.id,
          text: value.name,
          value: value.name,
        });
      });
    return statesOptions;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      merchantDetail,
      addMerchantDetail,
      errors,
      userId,
      history,
    } = this.props;
    if (userId && userId.length > 1) {
      if (_.isEmpty(errors)) {
        merchantDetail.user_id = userId;
        addMerchantDetail(history, merchantDetail);
      }
    }
  }
  render() {
    const {
      merchantDetail: {
        business_name,
        business_email,
        phone_number,
        description,
        house_number,
        street,
        city,
        state,
        country,
        cac_reg_no,
      },
      errors,
      changeHandler,
      validateHandler,
      TransformedStateList,
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field>
          <label htmlFor="business_name">Business name</label>
          <input
            placeholder='Business name'
            value={business_name} name='business_name' id='business_name'
            onChange={changeHandler('business_name')}
            onBlur={validateHandler('business_name')} />
          <Error>{errors.business_name}</Error>
        </Form.Field>
        <Form.Field>
          <label htmlFor="business_email">Business Email</label>
          <input
            placeholder='Business Email'
            value={business_email} name='business_email' id="business_email"
            onChange={changeHandler('business_email')}
            onBlur={validateHandler('business_email')} />
          <Error>{errors.business_email}</Error>
        </Form.Field>
        <Form.Field>
          <label>Business Phone Number</label>
          <input
            placeholder='phone number'
            value={phone_number}
            name='phone_number'
            onChange={changeHandler('phone_number')}
            onBlur={validateHandler('phone_number')}/>
          <Error>{errors.phone_number}</Error>
        </Form.Field>

        <Form.Field>
          <label htmlFor="description">Description</label>
          <TextArea
            placeholder='Description'
            value={description} name='description' id="description"
            onChange={changeHandler('description')}
            onBlur={validateHandler('description')}/>
          <Error>{errors.description}</Error>
        </Form.Field>
        <Form.Field>
          <label htmlFor="house_number">Office/Shop No</label>
          <input
            placeholder='house_number'
            value={house_number}
            name='house_number'
            id="house_number"
            onChange={changeHandler('house_number')}
            onBlur={validateHandler('house_number')}/>
          <Error>{errors.house_number}</Error>
        </Form.Field>
        <Form.Field>
          <label htmlFor="cac_reg_no">CAC Reg No</label>
          <input
            placeholder='cac reg no'
            value={cac_reg_no}
            name='cac_reg_no'
            id="cac_reg_no"
            onChange={changeHandler('cac_reg_no')}
            onBlur={validateHandler('cac_reg_no')}/>
          <Error>{errors.cac_reg_no}</Error>
        </Form.Field>
        <Form.Group>
          <Form.Field>
            <label htmlFor="state">state</label>
            <Select
              search
              options={TransformedStateList}
              placeholder='state'
              value={state}
              id="state"
              onChange={this.handleStateChange}
              onBlur={validateHandler('state')}
            />
            <Error>{errors.state}</Error>
          </Form.Field>
          <Form.Field>
            <label htmlFor="city">city</label>
            <Select
              disabled={this.state.cities <= 0}
              search
              options={this.transformCitiesByName()}
              placeholder='city'
              value={city}
              id="city"
              onChange={this.handleCityChange}
              onBlur={validateHandler('city')}
            />
            <Error>{errors.city}</Error>
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label htmlFor="street">street</label>
          <input
            placeholder='street'
            value={street}
            id="street"
            name='street'
            onChange={changeHandler('street')}
            onBlur={validateHandler('street')}/>
          <Error>{errors.street}</Error>
        </Form.Field>
        <Form.Field>
          <label htmlFor="country">country</label>
          <input type='text' placeholder='country'
            value={country} id="country"
            onChange={changeHandler('country')}
            onBlur={validateHandler('country')}/>
          <Error>{errors.country}</Error>
        </Form.Field>
        <Button
          type='submit'
          size="big"
          className='tmj black-text'
        >
          Submit
        </Button>
      </Form>
    );
  }
}

MerchantDetails.defaultProps = {
  merchantDetail: {
    ...MerchantModel,
  },
};

const validationOptions = {
  joiSchema: MerchantSchema,
  only: 'merchantDetail',
  joiOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};

export default connect(
  mapStateToProps,
  {addMerchantDetail}
)(
  withRouter(
    validate(MerchantDetails, validationOptions)
  )
);
