const { productModel, purchaseModel, categoryModel } = require("../imports/models.import");
const { productValidation } = require("../imports/validation.import");

exports.addProduct = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = productValidation.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Extract category data from request body
    const categories = req.body.categories.map((category) => ({
      categoryId: category.categoryId,
      variantId: category.variantId,
      quantity: category.quantity,
      price: category.price,
      measurement: category.measurement,
    }));

    // Create a new product instance
    const newProduct = new productModel({
      productName: req.body.productName,
      categories: categories,
      totalPrice: req.body.totalPrice,
      createdBy: req.user.userId,
      active: 1,
    });
    const savedProduct = await newProduct.save();

    res.status(200).json({
      message: "Product added successfully",
      status: 200,
      data: savedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      status: 500,
    });
  }
};

exports.getPrice = async (req, res, next) => {
  try {
    const { categoryId, variantId, quantity, measurement } = req.body;

    // Find the category
    const category = await categoryModel.findOne({ categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the variant within the category
    const variant = category.variants.find((v) => v.variantId === variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found in category" });
    }

    let totalPrice;
    if (measurement === "Number") {
      totalPrice = parseFloat(variant.price) * parseFloat(quantity);
    } else if (measurement === "L" || measurement === "ML") {
      // Convert measurement to ML if it's in Liters
      const quantityInML = measurement === "L" ? quantity * 1000 : quantity;

      // Calculate total price based on adjusted quantity and variant price
      totalPrice = (parseFloat(variant.price) / 1000) * parseFloat(quantityInML);
    } else {
      return res.status(400).json({ status: 400, message: "Invalid measurement unit" });
    }

    res.status(200).json({
      message: "Get price successful",
      status: 200,
      data: totalPrice,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const updateFields = req.body;

    // Validate request body
    const { error, value } = productValidation.validate(updateFields);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const product = await productModel.findOne({ productId });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: 404,
      });
    }

    // Update product fields based on the fields provided in the request body
    Object.keys(updateFields).forEach((field) => {
      // Check if the field is allowed to be updated
      if (field !== "productId" && field !== "totalPrice") {
        product[field] = updateFields[field];
      }
    });

    // Update or add categories
    if (updateFields.categories && updateFields.categories.length > 0) {
      updateFields.categories.forEach((category) => {
        const existingCategoryIndex = product.categories.findIndex((c) => c.categoryId === category.categoryId);

        if (existingCategoryIndex !== -1) {
          // Update existing category
          product.categories[existingCategoryIndex].variantId = category.variantId;
          product.categories[existingCategoryIndex].quantity = category.quantity;
          product.categories[existingCategoryIndex].price = category.price;
          product.categories[existingCategoryIndex].measurement = category.measurement;
        } else {
          // Add new category
          product.categories.push(category);
        }
      });
    }

    // Calculate totalPrice based on updated categories if provided
    if (updateFields.categories) {
      const totalPrice = updateFields.categories.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
      product.totalPrice = totalPrice;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      status: 200,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.viewProduct = async (req, res, next) => {
  try {
    const data = await productModel.findOne({ productId: req.params.productId });

    if (!data) {
      return res.status(404).json({
        message: "Product not found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "view successfull",
      status: 200,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const products = await productModel.find().skip(skip).limit(limit);

    const totalProduct = await productModel.countDocuments();

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Products retrieved successfully",
      status: 200,
      data: products,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalProduct / limit),
        pageSize: limit,
        totalItems: totalProduct,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.getProductList = async (req, res) => {
  try {
    const products = await productModel.find().select("productId productName");

    if (products.length === 0) {
      return res.status(404).json({
        message: "No Product found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Products name list retrieved successfully",
      status: 200,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.getCostPrice = async (req,res,next) => {
  try {
    const productId = req.body.productId;
    const getData =await productModel.findOne({productId : productId}, 'totalPrice');

    res.status(200).json({
      message: "Get cost price successfully",
      status: 200,
      data: getData,
    });

  } catch (error) {
    next(error);
  }
}

// remaning controller
exports.totalPrice = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
