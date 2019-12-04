import * as Joi from 'joi-browser';

export const ChangePasswordSchema = Joi.object().keys({
  current_password: Joi.string()
    .required()
    .label('Current password')
    .min(6)
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  new_password: Joi.string()
    .required()
    .label('New password')
    .min(6)
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  retype_new_password: Joi.string()
    .required()
    .label('New password confirmation')
    .min(6)
    .required()
    .valid(Joi.ref('new_password'))
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
          allowOnly: '!!Passwords do not match',
        },
        key: '{{!label}} ',
      },
    }),
});

export const LoginSchema = Joi.object().keys({
  email: Joi.string()
    .trim()
    .required()
    .email()
    .label('Email')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  password: Joi.string()
    .required()
    .label('Password')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
});

export const UserSchema = Joi.object().keys({
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
  email: Joi.string()
    .trim()
    .email()
    .required()
    .label('Email')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  user_name: Joi.string()
    .trim()
    .required()
    .alphanum()
    .min(3)
    .max(30)
    .label('Username')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  password: Joi.string()
    .label('Password')
    .required()
    .min(6)
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  password_confirmation: Joi.string()
    .label('Password Confirmation')
    .min(6)
    .required()
    .valid(Joi.ref('password'))
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
          allowOnly: '!!Passwords do not match',
        },
        key: '{{!label}} ',
      },
    }),
});

export const UpdateUserSchema = Joi.object().keys({
  first_name: Joi.string()
    .trim()
    .required()
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
    .label('Last Name')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
  user_name: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .label('Username')
    .options({
      language: {
        any: {
          empty: '{{!label}} is required',
        },
        key: '{{!label}} ',
      },
    }),
});

export const UserModel = {
  first_name: '',
  last_name: '',
  email: '',
  user_name: '',
  password: '',
  password_confirmation: '',
};

export const UpdateUserModel = {
  first_name: '',
  last_name: '',
  email: '',
  user_name: '',
};

export const ChangePasswordModel = {
  current_password: '',
  new_password: '',
  retype_new_password: '',
};


