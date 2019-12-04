import {combineReducers} from 'redux';
import C from '../constants';

export const token = (state = null, action) => {
  switch (action.type) {
  case C.ADD_ACCESS_TOKEN:
    return action.payload;
  case C.REMOVE_ACCESS_TOKEN:
    return null;
  default:
    return state;
  }
};

export const user = (state = {}, action) => {
  switch (action.type) {
  case C.ADD_USER:
    return action.payload;
  case C.FETCH_USER:
    return action.payload;
  case C.UPDATE_USER:
    return action.payload;
  case C.REMOVE_USER:
    return {};
  case C.GET_COURIER_USERID:
    return {
      userIdForCourierRegForm: action.payload,
    };
  case C.GET_USERID:
    return {
      userIdForMerchantRegForm: action.payload,
    };
  default:
    return state;
  }
};

export const fetching = (state=false, action) => {
  switch (action.type) {
  case C.FETCHING:
    return true;
  case C.SAVE_CATEGORY:
    return true;
  case C.DONE_FETCHING:
    return false;
  default:
    return state;
  }
};


export const errors = (state=[], action) => {
  switch (action.type) {
  case C.ADD_ERROR:
    return [
      ...state,
      action.payload,
    ];
  case C.CLEAR_ERROR:
    return state.filter((message, i) => i !== action.payload);
  case C.CLEAR_ALL_ERROR:
    return action.payload;
  default:
    return state;
  }
};
export const addCategory = (state={}, action) => (
  action.type === C.ADD_CATEGORY ? action.payload: state
);

export const allMerchants = (state=[], action) => {
  switch (action.type) {
  case C.LIST_MERCHANTS:
    return action.payload;
  default:
    return state;
  }
};
export const products = (state=[], action) => {
  switch (action.type) {
  case C.COUNT_PRODUCT:
    return action.payload;
  case C.LIST_PRODUCTS:
    return action.payload;
  case C.ADD_PRODUCTS:
    return [
      ...state,
      action.payload,
    ];
  default:
    return state;
  }
};


export const orderItems = (state=[], action) => {
  switch (action.type) {
  case C.CLEAR_ORDER_ITEMS:
    return [];
  case C.ADD_ORDER_ITEM:
    return [
      ...state,
      action.payload,
    ];
  default:
    return state;
  }
};

export const merchantOrder = (state=[], action) => {
  switch (action.type) {
  case C.GET_MERCHANTORDERS:
    return action.payload;

  case C.UPDATE_ORDER_ITEM_STATUS:
    const filtedOrderItemStatus = state.filter(
      (orderItem) => orderItem.id !== action.payload.id);
    return [
      ...filtedOrderItemStatus,
      action.payload,
    ];
  default:
    return state;
  }
};

export const viewOrderDetails = (state={}, action) => (
  action.type === C.VIEWORDERDETAILS ? action.payload : state
);

export const category = (state=[], action) => {
  switch (action.type) {
  case C.ADD_CATEGORY:
    const hasName = state.some(
      (cname) => cname.name === action.payload.name
    );
    return hasName ? state : [
      ...state,
      action.payload,
    ];
  case C.LIST_CATEGORY:
    return action.payload;

  case C.UPDATE_CATEGORY:
    const filtedCate = state.filter(
      (cate) => cate.id !== action.payload.id);

    return [
      ...filtedCate,
      action.payload,
    ];

  case C.SHOW_SUGGESTIONS_CATEGORY:
    return action.payload;

  case C.REMOVE_CATEGORY:
    return state.filter((cate) => cate.id !== action.payload);
  default:
    return state;
  }
};


export const orderItemDetails = (state={}, action) => {
  switch (action.type) {
  case C.ADD_ORDER_ITEM_DETAILS:
    return {...state, [action.id]: action.payload};
  default:
    return state;
  }
};

export const getMerchant = (state={}, action) => (
  action.type === C.GET_MERCHANT ? action.payload : state
);

export const getCourier = (state={}, action) => (
  action.type === C.GET_COURIER ? action.payload : state
); ;


export const getOrder = (state={processed: [], delivered: []}, action) => (
  action.type === C.ADD_ORDERS ? action.payload : state
);

export const customerOrders = (state=[], action) => (
  action.type === C.GET_CUSTOMER_ORDERS ? action.payload : state
);

export const states = (state = [], action) => {
  switch (action.type) {
  case C.GET_STATES:
    return action.payload;
  default:
    return state;
  }
};

export default combineReducers({
  token,
  errors,
  orderItems,
  orderItemDetails,
  states,
  user: combineReducers({
    fetching,
    user,
  }),
  merchant: combineReducers({
    fetching,
    getMerchant,
    merchantOrder,
    viewOrderDetails,
  }),
  order: combineReducers({
    fetching,
    getOrder,
    customerOrders,
  }),
  products: combineReducers({
    products,
    // currentAddedProductID,
    fetching,
  }),
  categories: combineReducers({
    fetching,
    category,
  }),
  couriers: combineReducers({
    fetching,
    couriers,
  }),
});
