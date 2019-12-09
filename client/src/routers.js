import React from 'react';
import {createBrowserHistory} from 'history';
import {Router, Route, Switch, Redirect} from 'react-router-dom'; // Redirect
import NotFound from 'pages/404';
import Restricted from 'pages/Restricted';
import Login from 'pages/login';
import asyncComponent from 'pages/AsyncComponent';
import Merchant from 'pages/merchant/Merchant';
import MerchantReg from 'pages/merchant/Registration';


const hist = createBrowserHistory();


const asyncMerchantDashboard = asyncComponent(() => (
  import('pages/merchant/Dashboard/Dashboard')
));

const asyncMerchantProducts = asyncComponent(() => (
  import('pages/merchant/Product/Product')
));

const asyncMerchantAddProducts = asyncComponent(() => (
  import('pages/merchant/Product/AddProduct')
));
const asyncMerchantOrders = asyncComponent(() => (
  import('pages/merchant/Order/Order')
));
const asyncMerchantTransaction = asyncComponent(() => (
  import('pages/merchant/Transaction/CompletedOrder')
));


const MerchantRoute = (
  {
    component: Component,
    componentName: name,
    ...rest
  }) => {
  const persist = localStorage.getItem('persist:root') || {};
  const {user} = JSON.parse(persist);
  const obj = JSON.parse(user);
  const {is_merchant, is_admin} = obj.user;
  return (
    <Route {...rest} render={
      (routeProps) => is_merchant || is_admin ? (
        <Merchant {...routeProps}>
          <Component name={name} {...routeProps} />
        </Merchant>
      ) : (
        <Redirect
          to={{
            pathame: '/restricted',
            state: {from: routeProps.location},
          }}
        />
      )
    } />
  );
};

const routes = (
  <Router history={hist}>
    <Switch>
      <Route exact path="/" component={MerchantReg} />

      <MerchantRoute exact path="/merchant/orders"
        component={asyncMerchantOrders}
        componentName={'All Orders'} />
      <MerchantRoute exact path="/merchant/transaction"
        component={asyncMerchantTransaction}
        componentName={'Completed Transaction'} />

      <MerchantRoute exact path="/merchant"
        component={asyncMerchantDashboard}
        componentName={'Dashboard'} />

      <MerchantRoute exact path="/merchant/product"
        component={asyncMerchantProducts}
        componentName={'Products'} />

      <MerchantRoute exact path="/merchant/product/add"
        component={asyncMerchantAddProducts}
        componentName={'Add Products'} />

      <Route path="/login" render={(props) => <Login {...props} />} />
      <Route exact path="/restricted" component={Restricted} />
      <Route render={(props) => <NotFound {...props} />} />
    </Switch>
  </Router>
);

export default routes;
