const mongoose = require("mongoose");
const { generateRandomId } = require("../helpers/generateId.helper");

const purchase = new mongoose.Schema(
  {
    purchaseId: {
      type: String,
      required: true,
      default: () => generateRandomId(22),
    },
    categoryId: {
      type: String,
      required: true,
    },
    variantId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,  
  }
);

module.exports = mongoose.model("Purchase", purchase);
