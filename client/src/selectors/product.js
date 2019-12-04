import {createSelector} from 'reselect';

export const getProductsState = (store) => store.products;

export const getProductsList = createSelector(
  [getProductsState],
  (productsState) => (
    productsState ? productsState.products : []
  )
);

export const getCategoryProducts = createSelector(
  [getProductsList, (state, category_id) => category_id],
  (state, cat_id) => (state.length ?
    state.filter((item) => item.category_id === cat_id) : [])
);

export const getProduct = createSelector(
  [getProductsList, (state, product_id) => product_id],
  (state, p_id) => (state.length ?
    state.find((item) => item.id === p_id) : [])
);

