import * as Joi from 'joi-browser';

export const MerchantSchema = Joi.object().keys({
  business_name: Joi.string()
    .trim()
    .required()
    .min(3)
    .label('Business Name')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  description: Joi.string()
    .trim()
    .required()
    .min(3)
    .label('Description')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  business_email: Joi.string()
    .trim()
    .email()
    .required()
    .label('Business Email')
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
  phone_number: Joi.string()
    .label('Phone Number')
    .trim()
    .regex(/^[0-9]{7,11}$/)
    .required()
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
  cac_reg_no: Joi.string()
    .label('CAC Reg No')
    .trim(),
  street: Joi.string()
    .label('Street')
    .trim()
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
});


export const MerchantModel = {
  business_name: '',
  business_email: '',
  phone_number: '',
  description: '',
  house_number: '',
  street: '',
  city: '',
  state: '',
  cac_reg_no: '',
  country: 'Nigeria',
};


