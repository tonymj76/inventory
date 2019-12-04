import React, {PureComponent} from 'react';
import MerchantUserDetails from './MerchantAsUserDetails';
import MerchantDetails from './MerchantDetails';


export default class MerchantForm extends PureComponent {
  state = {
    step: 1,
  }
  nextStep = () => {
    this.setState({
      step: this.state.step + 1,
    });
  }
  render() {
    const {step} = this.state;
    switch (step) {
    case 1:
      return <MerchantUserDetails
        nextStep={this.nextStep} />;
    case 2:
      return <MerchantDetails />;
    }
  }
}
