const mongoose = require("mongoose");
const { generateRandomId } = require("../helpers/generateId.helper");

// Define Employee schema
const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      default: () => generateRandomId(22),
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create Employee model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
