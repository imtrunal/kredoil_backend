const { categoryModel, purchaseModel, productModel, employeeModel, salesModel } = require("../imports/models.import");

const getDashboardCounts = async (req, res) => {
  try {
    const categoryCount = await categoryModel.countDocuments();
    const employeeCount = await employeeModel.countDocuments();
    const productCount = await productModel.countDocuments();
    const purchaseCount = await purchaseModel.countDocuments();
    const salesCount = await salesModel.countDocuments();

    res.status(201).json({
      message: "Dashboard counts retrieved successfully",
      status: 201,
      data: {
        category: categoryCount,
        employee: employeeCount,
        product: productCount,
        purchase: purchaseCount,
        sales: salesCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getDashboardCounts };
