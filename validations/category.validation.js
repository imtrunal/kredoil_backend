const Joi = require("joi");

// Validation schema for category
const categoryValidationSchema = Joi.object({
  categoryId: Joi.string(),
  categoryName: Joi.string().required().messages({
    "any.required": "Category name is required",
    "string.empty": "Category name cannot be empty",
  }),
  active: Joi.number().valid(0, 1, 2).optional().default(1),
  deletedAt: Joi.date(),
  createdBy: Joi.string().hex().allow(null),
  updatedBy: Joi.string().hex().allow(null),
  deletedBy: Joi.string().hex().allow(null),
  variants: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number(),
      stock: Joi.number(),
      measurement: Joi.string().required(),
    })
  ),
});

module.exports = categoryValidationSchema;
