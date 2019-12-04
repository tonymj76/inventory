import {createSelector} from 'reselect';

export const getStates = (store) => store.states;

export const getStatesList = createSelector(
  [getStates],
  (state) => (
    state ? state : []
  )
);

const transformStatesByName = (values) => {
  const statesOptions = [];
  _.forEach(values,
    (value) => {
      statesOptions.push({
        key: value.id,
        text: value.name,
        value: value.name,
      });
    });
  return statesOptions;
};

export const getTransformedStatesByName = createSelector(
  [getStatesList],
  (state) => (state ? transformStatesByName(state) : [])
);

export const selectState = createSelector(
  [getStatesList, (state, id) => id],
  (state, state_id) => (state.length ?
    state.find((item) => item.id === state_id) : {})
);

