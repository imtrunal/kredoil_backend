const Joi = require("joi");

// Define Joi validation schema for Employee
const employeeValidationSchema = Joi.object({
  employeeId: Joi.string(),
  name: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
});

module.exports = employeeValidationSchema;
