const Joi = require("joi");

const productValidationSchema = Joi.object({
  productId: Joi.string(),
  productName: Joi.string().required(),
  categories: Joi.array()
    .items(
      Joi.object({
        categoryId: Joi.string().required(),
        variantId: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        measurement: Joi.string().required(),
      })
    )
    .required(),
  totalPrice: Joi.number().required(),
  active: Joi.number(),
  deletedAt: Joi.date().optional(),
  createdBy: Joi.string().hex().allow(null).optional(),
  updatedBy: Joi.string().hex().allow(null).optional(),
  deletedBy: Joi.string().hex().allow(null).optional(),
});

module.exports = productValidationSchema;
