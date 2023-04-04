const Joi = require("joi");
const validate = require("./validate");

const signUpSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    "any.required": "first name is required",
    "string.empty": "first name cannot be empty",
    "string.base": "fist name must be a string",
  }),
  lastName: Joi.string().trim().required().messages({
    "any.required": "last name is required",
    "string.empty": "last name cannot be empty",
    "string.base": "last name must be a string",
  }),
  email: Joi.string().email({ tlds: false }),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  password: Joi.string().alphanum().min(3).required().trim().messages({
    "string.empty": "password is required",
    "string.alphanum": "password must contain number or alphabet",
    "string.min": "password must be at least 3 character",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .trim()
    .messages({
      "any.only": "password and confirm password must be match",
      "string.empty": "confirm password is required",
    }),
});

exports.validateSignUp = validate(signUpSchema);

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  isChecked: Joi.boolean().default(false),
});

exports.validateLogin = validate(loginSchema);

// exports.validateLogin = input =>{
//     const {value,error} = loginSchema.validate(input,{abortEarly: false});
//     if(error){
//         const result = error.details.reduce((acc,el)=>{
//             acc[el.path[0]=el.message];
//             return acc;
//         },{})
//         return result;
//     }
// }
