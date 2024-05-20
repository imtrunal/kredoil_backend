const { employeeModel } = require("../imports/models.import");
const { employeeValidation } = require("../imports/validation.import");

exports.createEmployee = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = employeeValidation.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const newEmployee = new employeeModel({
      name: value.name,
    });
    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      message: "Employee created successfully",
      status: 201,
      data: savedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    const { error } = await employeeValidation.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      { _id: employeeId },
      { name: req.body.name },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: "Employee not found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    const employee = await employeeModel.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Employee retrieved successfully",
      status: 200,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await employeeModel.find();

    res.status(200).json({
      message: "Employees retrieved successfully",
      status: 200,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    const deletedEmployee = await employeeModel.findByIdAndDelete({ _id: employeeId });

    if (!deletedEmployee) {
      return res.status(404).json({
        message: "Employee not found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      status: 200,
      data: deletedEmployee,
    });
  } catch (error) {
    next(error);
  }
};
