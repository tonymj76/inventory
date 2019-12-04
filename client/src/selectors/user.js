import {createSelector} from 'reselect';

export const getUsersState = (store) => store.user;

export const getLoggedInUser = createSelector(
  [getUsersState],
  (state) => (
    state.user ? state.user : {}
  )
);

