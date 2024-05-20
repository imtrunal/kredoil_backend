const { purchaseModel, categoryModel } = require("../imports/models.import");
const { purchaseValidation } = require("../imports/validation.import");

exports.addPurchase = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = purchaseValidation.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { categoryId, variantId, price, quantity } = value;
    console.log("data:::", categoryId, variantId, price, quantity);

    // Find the category by categoryName
    const existingCategory = await categoryModel.findOne({ categoryId: categoryId });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the variant within the category
    const existingVariant = existingCategory.variants.find((v) => v.variantId === variantId);
    if (!existingVariant) {
      return res.status(404).json({ message: "Variant not found in the category" });
    }

    //Find single piece rate
    const pieceRate = parseFloat(price) / parseFloat(quantity);

    // Update variant's stock and price
    existingVariant.stock += quantity;
    existingVariant.price = pieceRate;

    // Save the updated category
    await existingCategory.save();
    // Create a new purchase instance
    const newPurchase = new purchaseModel({
      categoryId: categoryId,
      variantId: variantId,
      price: price,
      quantity: quantity,
      rate: pieceRate,
      createdBy: req.user.userId,
    });

    // Save the new purchase to the database
    const savedPurchase = await newPurchase.save();

    // Return success response with status code, message, and saved data
    res.status(200).json({
      message: "Purchase data added successfully",
      status: 200,
      data: savedPurchase,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

exports.viewPurchase = async (req, res, next) => {
  try {
    const data = await purchaseModel.findOne({ purchaseId: req.params.purchaseId });
    if (!data) {
      return res.status(404).json({
        message: "Purchase not found",
        status: 404,
      });
    }

    // Send success response with the found purchase data
    res.status(200).json({
      message: "View successful",
      status: 200,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.listPurchase = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the index of the first item in the page
    const startIndex = (page - 1) * limit;

    // Retrieve total count of purchases (for pagination metadata)
    const totalCount = await purchaseModel.countDocuments();

    // Retrieve purchase data for the current page
    const data = await purchaseModel.find({}).skip(startIndex).limit(limit);

    // Send success response with purchase data and pagination metadata
    res.status(200).json({
      message: "Purchase data list",
      status: 200,
      data: data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error(error);
    // Send error response if something goes wrong
    res.status(500).json({
      message: "Something went wrong",
      status: 500,
    });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    // Find and delete the purchase by purchaseId
    const purchaseId = req.params.purchaseId;
    const deletedPurchase = await purchaseModel.findOneAndDelete({ purchaseId });

    if (!deletedPurchase) {
      // If no purchase found with the provided purchaseId
      return res.status(404).json({
        status: 404,
        message: "Purchase not found",
      });
    }

    // If the purchase was successfully deleted
    return res.status(200).json({
      status: 200,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
