const mongoose = require("mongoose");
const { generateRandomId } = require("../helpers/generateId.helper");

// Variant schema
const variantSchema = new mongoose.Schema({
  variantId: {
    type: String,
    required: true,
    default: () => generateRandomId(22),
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  stock: {
    type: Number,
    required: false,
    default: 0,
  },
  measurement: {
    type: String,
    required: true,
  },
});

// Category schema with embedded variants
const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: true,
      default: () => generateRandomId(22),
    },
    categoryName: {
      type: String,
      // required: true,
    },
    active: {
      type: Number,
      // required: true,
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
    variants: [variantSchema], // Embedded array of variants
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("category", categorySchema);
