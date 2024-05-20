const Joi = require("joi");

// Joi validation schema for Purchase
const purchaseValidationSchema = Joi.object({
  purchaseId: Joi.string(),
  categoryId: Joi.string().required(),
  variantId: Joi.string().required(),
  price: Joi.number().required(),
  rate: Joi.number(),
  quantity: Joi.number().required(),
  createdBy: Joi.string().hex().allow(null),
  updatedBy: Joi.string().hex().allow(null),
});

module.exports = purchaseValidationSchema;
