import React, {PureComponent} from 'react';
import {Image} from 'semantic-ui-react';
import loader from 'assets/loader/infinity.svg';

export default function asyncComponent(importComponent) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const {default: component} = await importComponent();

      this.setState({
        component: component,
      });
    }

    render() {
      const Component = this.state.component;
      return Component ? (<Component {...this.props}/> ): (
        <Image src={loader} size='small' centered/>);
    }
  };
}
