import {createSelector} from 'reselect';

export const selectCategoriesState = (store) => store.categories;

export const selectCategoriesFetch = createSelector(
  [selectCategoriesState],
  (categoriesState) => (
    categoriesState ? categoriesState.fetching : {}
  )
);

export const selectCategoriesList = createSelector(
  [selectCategoriesState],
  (categoriesState) => (
    categoriesState ? categoriesState.category : []
  )
);

/**
 * groupCategories helps to arrange
    categories to their subcategoryy
 *
 * @param {string[]} i the store category
 * @return {main} subcategory of the category
 */
const groupCategories = (i) => {
  const main = _.filter(i, (x) => x.parent_id.match(/^[(0*)(\-)]*$/));
  _.map(main, (p) => p.sub_categories = _.filter(i, ['parent_id', p.id]));
  _.forEach(main, (cateObj) => {
    if (cateObj.sub_categories.length) {
      _.map(cateObj.sub_categories,
        (obj) => obj.sub_categories = _.filter(i, ['parent_id', obj.id]));
    }
  });
  return main;
};

// const mainCategories = (i) => (
//   _.filter(i, (x) => x.parent_id.match(/^[(0*)(\-)]*$/))
// );


export const selectorCategorized = createSelector(
  [selectCategoriesFetch, selectCategoriesList],
  (fetch, list) => {
    const categorize = list.length ? groupCategories(list) : [];
    return {fetch, categorize};
  }
);


// export const selectorMainCategories = createSelector(
//   [selectCategoriesList],
//   (list) => {
//     const categorize = list.length ? (
// categoryOptions(mainCategories(list)) ): [];
//     return categorize;
//   }
// );

const selectCategoryId = (state, id) => id;

export const getSubcategories = createSelector(
  [selectCategoriesList, selectCategoryId], (state, cat_id) => {
    const category = state.length ?
      state.find((item) => item.id === cat_id) : {};

    const sub = category.sub_categories && category.sub_categories.length ?
      category.sub_categories : [];

    return sub;
  }
);

/**
 * categoryOptions is use by semantic to list options
 *  for parent categories
 *
 * @param {*} values list of categories
 * @return {string[]} catList to select Parent category
 */
const categoryOptions = (values) => {
  const catList = [{key: 'default', text: 'Default', value: null}];
  _.forEach(values,
    (value) => {
      catList.push({
        key: value.id,
        text: value.name, value: value.id,
      });
    });
  return catList;
};

export const selectorCategoryOptionList = createSelector(
  [selectCategoriesList],
  (categoryList) => categoryOptions(categoryList)
);


// export const subListCategory = (list, id) => (
//   categoryOptions( _.filter(list, ['parent_id', id]))
// );


export const selectSubCategoriesList = createSelector(
  [selectCategoriesState],
  (categoriesState) => {
    return (
      categoriesState ? _.filter(categoriesState.category,
        (cat) => cat.name.split(' ').length > 1) : []
    );
  }
);
