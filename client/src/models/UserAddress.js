import * as Joi from 'joi-browser';

export const UserAddressSchema = Joi.object().keys({
  house_number: Joi.string()
    .trim()
    .required()
    .min(1)
    .label('House/Apartment number')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  street: Joi.string()
    .trim()
    .required()
    .min(3)
    .label('Street name')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  state: Joi.string()
    .trim()
    .required()
    .label('State')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  city: Joi.string()
    .label('City')
    .trim()
    .required()
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  country: Joi.string()
    .label('Country')
    .required()
    .min(3)
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  first_name: Joi.string()
    .trim()
    .required()
    .min(3)
    .label('First Name')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  last_name: Joi.string()
    .trim()
    .required()
    .min(3)
    .label('Last Name')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  phone_number: Joi.number()
    .label('Phone number')
    .max(11)
    .required()
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
});

export const UserAddressModel = {
  user_id: '',
  first_name: '',
  last_name: '',
  house_number: '',
  street: '',
  city: '',
  state: '',
  country: 'Nigeria',
  phone: '',
};
