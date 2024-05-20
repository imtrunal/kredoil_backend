const mongoose = require("mongoose");
const { generateRandomId } = require("../helpers/generateId.helper");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const saleOrderSchema = new mongoose.Schema(
  {
    salesId: {
      type: String,
      required: true,
      default: () => generateRandomId(28),
    },
    employeeId: {
      type: String,
      required: true,
    },
    partyName: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    products: [productSchema],
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

module.exports = mongoose.model("SaleOrder", saleOrderSchema);
