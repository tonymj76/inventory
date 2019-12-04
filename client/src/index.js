import React from 'react';
import ReactDOM from 'react-dom';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {Provider} from 'react-redux';
import toastr from 'toastr';

// Joi validation setup
import Joi from 'joi-browser';
import ReactJoiValidations from 'react-joi-validation';

// Redux setup
import {persistor, store} from './store';
import routes from './routers';

import 'assets/semantic/src/semantic.less';
import 'assets/styles/index.scss';
import 'toastr/build/toastr.min.css';

import Loading from './components/Loading';

// Toastr config
toastr.options = {
  closeButton: true,
  preventDuplicates: true,
  positionClass: 'toast-bottom-right',
};

ReactJoiValidations.setJoi(Joi); // Joi validation setup

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<Loading />}>
      {routes}
    </PersistGate>
  </Provider>,
  document.getElementById('app')
);
