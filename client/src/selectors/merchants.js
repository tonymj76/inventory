import {createSelector} from 'reselect';
import _ from 'lodash';

export const selectMerchantOrderItems = (store) => (
  store.merchant.merchantOrder
);

export const selectProcessedOrderItems = createSelector(
  [selectMerchantOrderItems],
  (orderItems) => (
    orderItems && orderItems.length > 0 ? (
      _.filter(orderItems, ['status', 'processed'])
    ):(
      null
    )
  )
);
export const selectPaidOrderItems = createSelector(
  [selectMerchantOrderItems],
  (orderItems) => (
    orderItems && orderItems.length > 0 ? (
      _.filter(orderItems, ['status', 'paid'])
    ):(
      null
    )
  )
);

export const selectDeliveredOrderItems = createSelector(
  [selectMerchantOrderItems],
  (orderItems) => (
    orderItems && orderItems.length > 0 ? (
      _.filter(orderItems, ['status', 'delivered'])
    ):(
      null
    )
  )
);

export const selectPaidOrPendingOrderItems = createSelector(
  [selectMerchantOrderItems],
  (orderItems) => (
    orderItems && orderItems.length > 0 ? (
      _.filter(orderItems, (o) => (o.status !== 'processed'))
    ):(
      null
    )
  )
);

