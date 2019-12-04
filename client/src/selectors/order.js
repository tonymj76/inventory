import {createSelector} from 'reselect';

export const getUserOrdersState = (store) => store.order.customerOrders;

export const getUserOrders = createSelector(
  [getUserOrdersState],
  (items) => (
    items ? items : []
  )
);
