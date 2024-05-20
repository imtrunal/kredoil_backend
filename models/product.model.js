const mongoose = require("mongoose");
const { generateRandomId } = require("../helpers/generateId.helper");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      default: () => generateRandomId(22),
    },
    productName: {
      type: String,
      required: true,
    },
    categories: [
      {
        categoryId: {
          type: String,
          required: true,
        },
        variantId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        measurement: {
          type: String,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    active: {
      type: Number,
      default: 1,
      enum: [0, 1, 2], // 0-Inactive 1-Active 2-Deleted
    },
    deletedAt: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    deletedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Product", productSchema);
