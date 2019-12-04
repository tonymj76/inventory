import * as Joi from 'joi-browser';

export const ProductSchema = Joi.object().keys({
  refound_policy: Joi.string()
    .empty('')
    .trim()
    .label('Refound Policy'),
  description: Joi.string()
    .trim()
    .required()
    .label('Description')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  category_id: Joi.string()
    .label('Category')
    .required()
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  name: Joi.string()
    .trim()
    .required()
    .min(3)
    .label('Product name')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  price: Joi.number()
    .label('Price')
    .required()
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  quantity: Joi.number()
    .label('Quantity')
    .integer()
    .required()
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  weight: Joi.number()
    .integer()
    .label('Weight')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
});

export const ProductModel = {
  name: '',
  price: '',
  quantity: '',
  weight: '',
  category_id: '',
  refound_policy: '',
  description: '',
};
