import C from './constants';
import request from 'helpers/request';
import toastr from 'toastr';
import {showToast} from './utils';

export function addToken(token) {
  return {
    type: C.ADD_ACCESS_TOKEN,
    payload: token,
  };
}

export function addUser(user) {
  return {
    type: C.ADD_USER,
    payload: user,
  };
}

export function removeToken() {
  return {
    type: C.REMOVE_ACCESS_TOKEN,
    payload: '',
  };
}

export function removeUser() {
  return {
    type: C.REMOVE_USER,
    payload: {},
  };
}
export function clearAllErrors() {
  return {
    type: C.CLEAR_ALL_ERROR,
    payload: [],
  };
}

export const getUsers = () => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/users',
    method: 'GET',
  }, true).then((res) => {
    if (res.status === 200) {
      return res.data;
    } else {
      console.error('Failed to fetch users', 'Error!');
    }
  }).then((data) => {
    dispatch({
      type: C.LIST_USERS,
      payload: data,
    });
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(() => {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const getUser = (user_id) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/users/'+user_id,
    method: 'GET',
  }, true).then((res) => {
    if (res.status === 200) {
      dispatch({
        type: C.FETCH_USER,
        payload: res.data,
      });
    } else {
      console.error('Failed to fetch user', 'Error!');
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(() => {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const updateUser = (user) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/users/'+user.id,
    method: 'POST',
    data: user,
  }, true).then((res) => {
    if (res.status === 200) {
      dispatch({
        type: C.UPDATE_USER,
        payload: res.data,
      });
    } else {
      console.error('Failed to fetch user', 'Error!');
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(() => {
    dispatch({type: C.DONE_FETCHING});
  });
};

export function addOrderItem(item) {
  return {
    type: C.ADD_ORDER_ITEM,
    payload: item,
  };
}

export function clearOrderItems() {
  return {
    type: C.CLEAR_ORDER_ITEMS,
  };
}

export const addError = (message) => ({
  type: C.ADD_ERROR,
  payload: message,
});


export const getAllCategories = () => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/categories/',
    method: 'GET',
  }, true).then((res) => {
    if (res.status === 200) {
      dispatch({
        type: C.LIST_CATEGORY,
        payload: res.data});
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(() => {
    dispatch({type: C.DONE_FETCHING})
    ;
  }
  );
};


export const getAllProducts = () => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/product',
    method: 'GET',
  }, false).then((res) => {
    if (res.status===200) {
      dispatch({
        type: C.LIST_PRODUCTS,
        payload: res.data,
      });
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const getAllStates = () => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/states',
    method: 'GET',
  }, false).then((res) => {
    if (res.status===200) {
      dispatch({
        type: C.GET_STATES,
        payload: res.data,
      });
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const searchProducts = (searchParams) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/query',
    method: 'GET',
    params: searchParams,
  }, false).then((res) => {
    if (res.status===200) {
      dispatch({
        type: C.LIST_PRODUCTS,
        payload: res.data,
      });
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const addCategory = (value) => async (dispatch) => {
  dispatch({
    type: C.SAVE_CATEGORY,
  });

  await request({
    url: '/category',
    method: 'POST',
    data: value,
  }, true).then((res) => {
    if (res.status===201) {
      toastr.success('Category save Successful');
      dispatch({
        type: C.ADD_CATEGORY,
        payload: res.data,
      });
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({
      type: C.DONE_FETCHING,
    });
  });
};

export const updateCategory = (value) => async (dispatch) => {
  dispatch({
    type: C.SAVE_CATEGORY,
  });

  await request({
    url: `/category/${value.id}`,
    method: 'PUT',
    data: value,
  }, true).then((res) => {
    if (res.status===200) {
      toastr.success('Category save Successful');
      dispatch({
        type: C.UPDATE_CATEGORY,
        payload: res.data,
      });
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({
      type: C.DONE_FETCHING,
    });
  });
};

export const removeCategory = (value) => async (dispatch) => {
  await request({
    url: `/category/${value}`,
    method: 'DELETE',
  }, true).then((res) => {
    if (res.status===200) {
      dispatch({
        type: C.REMOVE_CATEGORY,
        payload: value,
      });
      toastr.success('Category Delete Successful');
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const getMerchant = (value) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: `/merchants/${value}`,
    method: 'GET',
  }, true).then((res) => {
    if (res.status===200) {
      dispatch({
        type: C.GET_MERCHANT,
        payload: res.data,
      });
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const getMerchantsProductsByLocation = (data) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/merchants/location',
    method: 'GET',
    params: data,
  }, true).then((res) => {
    if (res.status===200) {
      const merchants = res.data;
      merchants.map((item) => {
        dispatch({
          type: C.LIST_PRODUCTS,
          payload: item.products,
        });
      });
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const getCustomerOrders = (user_id) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/order/user',
    method: 'GET',
    params: {user_id},
  }, true).then((res) => {
    if (res.status === 200) {
      const userOrders = res.data.orders;
      dispatch({
        type: C.GET_CUSTOMER_ORDERS,
        payload: userOrders,
      });
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(() => {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const getOrders = () => async (dispatch, getState) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: `/courier/order/${getState().user.user.id}`,
    method: 'GET',
  }, true).then((res) => {
    if (res.status===200) {
      const processed = [];
      const delivered = [];

      res.data.map((order) => order.order_items.map((orderItem) => {
        if (orderItem.status === 'processed') {
          processed.push({order, orderItem});
        } else if (orderItem.status === 'delivered') {
          delivered.push({order, orderItem});
        }
      }));

      dispatch({
        type: C.ADD_ORDERS,
        payload: {
          processed,
          delivered,
        },
      });
    } else {
      toastr.error('Failed to fetch orders', 'Error!');
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({type: C.DONE_FETCHING});
  });
};

export const getOrderDetails = (
  userId,
  shippingDetailId,
  orderId,
  productId
) => async (dispatch) => {
  await request({
    url: `/courier/view?user_id=${userId}&product_id=${productId}&`+
    `shipping_detail_id=${shippingDetailId}&order_id=${orderId}`,
    method: 'GET',
  }, true).then((res) => {
    if (res.status===200) {
      dispatch({
        type: C.ADD_ORDER_ITEM_DETAILS,
        payload: res.data,
        id: orderId,
      });
    } else {
      toastr.error('Failed to fetch order details', 'Error!');
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  });
};

export const addProduct = (value, images) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  value.price = Number(value.price);
  value.quantity = Number(value.quantity);
  value.weight = Number(value.weight);
  value.images = images;

  await request({
    url: '/product',
    method: 'POST',
    data: value,
  }, true).then((res) => {
    if (res.status===201) {
      toastr.success('Product save Successful');
      // add image
      // addImage(files, res.data.id);
      dispatch({
        type: C.ADD_PRODUCTS,
        payload: res.data,
      });
    } else {
      toastr.error('error while saving product');
    }
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({
      type: C.DONE_FETCHING,
    });
  });
};

export const addMerchantUserDetail = (nextStep, value) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });
  await request({
    url: '/users',
    method: 'POST',
    data: value,
  }, false).then((res) => {
    if (res.status === 201) {
      showToast('success', 'user data saved', 'Successfully:');
      dispatch({
        type: C.GET_USERID,
        payload: res.data,
      });
      nextStep();
    } else {
      showToast('error', 'user data not saved', 'Failed:');
      dispatch(addError(error.message));
    };
  }).catch((error) => {
    showToast('error', 'user data not saved', 'Failed:');
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({
      type: C.DONE_FETCHING,
    });
  });
};

export const addMerchantDetail = (history, value) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: '/merchant/form',
    method: 'POST',
    data: value,
  }, false).then((res) => {
    if (res.status === 201) {
      showToast('success', 'merchant data saved', 'Successfully:');
      dispatch({
        type: C.GET_MERCHANT,
        payload: res.data,
      });
      history.push('/login');
    } else {
      showToast('error', 'Merchant data not saved', 'Failed:');
      dispatch(addError(error.message));
    };
  }).catch((error) => {
    dispatch(addError(error.message));
    showToast('error', 'Merchant data not saved', 'Failed:');
  }).finally(()=> {
    dispatch({
      type: C.DONE_FETCHING,
    });
  });
};

export const getMerchantOrders = (value) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: `/order/${value}`,
    method: 'GET',
  }, true).then((res) => {
    if (res.status === 200) {
      dispatch({
        type: C.GET_MERCHANTORDERS,
        payload: res.data,
      });
    } else {
      showToast('error', 'Merchant order not fetch', 'Failed:');
      dispatch(addError(error.message));
    };
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({
      type: C.DONE_FETCHING,
    });
  });
};

export const viewOrderDetails = (
  userID,
  orderID,
  productID,
) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    // eslint-disable-next-line max-len
    url: `/merchant/view/?user_id=${userID}&order_id=${orderID}&product_id=${productID}`,
    method: 'GET',
  }, true).then((res) => {
    if (res.status === 200) {
      dispatch({
        type: C.VIEWORDERDETAILS,
        payload: res.data,
      });
    } else {
      showToast('error', 'Merchant view order not fetch', 'Failed:');
      dispatch(addError(error.message));
    };
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({
      type: C.DONE_FETCHING,
    });
  });
};

export const updateOrderItemStatus = (
  order_item_id,
  status = 'processed'
) => async (dispatch) => {
  dispatch({
    type: C.FETCHING,
  });

  await request({
    url: `/merchant/order_item/${order_item_id}`,
    method: 'PUT',
    data: {status, id: order_item_id},
  }, true).then((res) => {
    if (res.status === 200) {
      showToast('success', 'order status updated', 'Successfully:');
      dispatch({
        type: C.UPDATE_ORDER_ITEM_STATUS,
        payload: res.data,
      });
    } else {
      showToast('error', 'update status failed', 'Failed:');
      dispatch(addError(error.message));
    };
  }).catch((error) => {
    dispatch(addError(error.message));
  }).finally(()=> {
    dispatch({
      type: C.DONE_FETCHING,
    });
  });
};
