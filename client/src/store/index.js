import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: [
    'user',
    'token',
    'categories',
    'couriers',
    'states',
    'orderItems',
  ],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const consoleMessages = (store) => (next) => (action) => {
  console.groupCollapsed(`dispatching action => ${action.type}`);
  console.log('initial action: ', action);
  console.log('initial state: ', store.getState());

  const result = next(action);

  console.log('Final state: ', store.getState().token);
  console.log('Result: ', result);
  console.groupEnd();

  return result;
};

// To enable you access the redux store
// on chrome browser redux devtools extension
// __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ is not an environment
// variable of this app. Just install Redux Devtools extension
// in your chrome or chromium browser
const composeEnhancers = process.env.NODE_ENV === 'development' ?
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose) : compose;

// export the storeFactory
// export default () => {
//   return createStore(appReducer, composeEnhancers(
//     applyMiddleware(thunk, consoleMessages)
//   ));
// };

const store = createStore(persistedReducer, composeEnhancers(
  applyMiddleware(thunk, consoleMessages)
));
const persistor = persistStore(store);
export {store, persistor};
