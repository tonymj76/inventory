import {createSelector} from 'reselect';

export const getOrderItemsState = (store) => store.orderItems;

export const getOrderItems = createSelector(
  [getOrderItemsState],
  (items) => (
    items ? items : []
  )
);
