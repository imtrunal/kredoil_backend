const Joi = require("joi");

const saleOrderValidationSchema = Joi.object({
  productId: Joi.string().required(),
  employeeId: Joi.string().required(),
  partyName: Joi.string().required(),
  productName: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  pincode: Joi.string().required(),
  costPrice: Joi.number().required(),
  sellingPrice: Joi.number().required(),
  deletedAt: Joi.date().optional(),
  createdBy: Joi.string().hex().allow(null).optional(),
  updatedBy: Joi.string().hex().allow(null).optional(),
  deletedBy: Joi.string().hex().allow(null).optional(),
});

module.exports = saleOrderValidationSchema;
