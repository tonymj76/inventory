import React from 'react';
import {
  List,
} from 'semantic-ui-react';
import ModelComponent from 'components/layout/ModalComponent';


/**
 *
 *
 * @param {string} dateString created date format
 * @return {string} formated date
 */
const dateDisplay = (dateString) => (
  new Date(dateString).toDateString()
);

/**
 *
 *
 * @param {string[]} {cate: categories}
 * @return {node} node of just one category or subcategories
 */
const ListSubCatetories = ({cate: categories}) => (
  categories.length &&
    categories.map((category) =>{
      const subCat = category.sub_categories &&
      category.sub_categories.length > 0;
      return (
        <List.Item
          key={category.id}
          as='li' value={ subCat ? '📁' : '📜' }
        >
          <List.Header>{category.name}</List.Header>
          <List.Description>
            {`created ${
              dateDisplay(category.created_at)}`}
            <ModelComponent
              id={category.id}
              name={category.name}
            />
          </List.Description>
          {subCat ? (
            <List.Item as='ol' >
              <ListSubCatetories cate= {category.sub_categories} />
            </List.Item>
          ) : ''}
        </List.Item>
      );
    })
);


export default ListSubCatetories;
