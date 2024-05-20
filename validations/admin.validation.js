const Joi = require('joi');

const adminValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    token: Joi.string()
});

module.exports = adminValidationSchema;
