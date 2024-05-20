const { salesModel, productModel, categoryModel } = require("../imports/models.import");
const { salesValidation } = require("../imports/validation.import");

// addSales controller
exports.addSaleOrder = async (req, res, next) => {
  try {
    const { employeeId, partyName, pincode, createdAt, products } = req.body;
    if (!employeeId || !partyName || !pincode ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const saleProducts = await Promise.all(products.map(async (product) => {
      try {
          // Fetch product details from the database using productId
          const productDetails = await productModel.findOne({productId:product.productId});
          if (!productDetails) {
              throw new Error(`Product with ID ${product.productId} not found.`);
          }
          return {
              productId: product.productId,
              productName: productDetails.productName,
              quantity: product.quantity,
              costPrice: product.costPrice,
              sellingPrice: product.sellingPrice,
              profit: product.sellingPrice - product.costPrice,
          };
      } catch (error) {
          console.error("Error fetching product details:", error);
          // Handle error, maybe skip this product or return default values
          return {
              productId: product.productId,
              productName: "Product not found",
              quantity: product.quantity,
              costPrice: product.costPrice,
              sellingPrice: product.sellingPrice,
              profit: product.sellingPrice - product.costPrice,
          };
      }
  }));

    const saleOrder = new salesModel({
      employeeId,
      partyName,
      pincode,
      createdAt,
      products: saleProducts,
    });

    await saleOrder.save();

    res.status(201).json({ message: "Sale order added successfully", data: saleOrder });
  } catch (error) {
    next(error);
  }
};

// updateSales controller
exports.updateSaleOrder = async (req, res, next) => {
  try {
    const { employeeId, pincode, partyName, products } = req.body;
    const { id } = req.params;

    // Check if at least one field to update is provided
    if (!employeeId && !pincode && !partyName && (!products || products.length === 0)) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const saleOrder = await salesModel.findById({_id:id});
    if (!saleOrder) {
      return res.status(404).json({ message: "Sale order not found" });
    }

    // Update employeeId if provided
    if (employeeId) {
      saleOrder.employeeId = employeeId;
    }

    // Update pincode if provided
    if (pincode) {
      saleOrder.pincode = pincode;
    }

    // Update partyName if provided
    if (partyName) {
      saleOrder.partyName = partyName;
    }

    // Update products if provided
    if (products && products.length > 0) {
      saleOrder.products = products;
    }

    // Save the updated sale order
    await saleOrder.save();

    res.status(200).json({ message: "Sale order updated successfully", data: saleOrder });
  } catch (error) {
    next(error);
  }
};

// listSales controller
exports.listSales = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const sales = await salesModel.find()
      .skip(skip)
      .limit(limit)
      // .populate('products.productId', 'productName quantity'); // Populate the products field with product details

    const totalSalesCount = await salesModel.countDocuments();

    const totalPages = Math.ceil(totalSalesCount / limit);

    res.status(200).json({
      message: "List of sale orders",
      data: sales,
      pageInfo: {
        currentPage: page,
        totalPages: totalPages,
        pageSize: limit,
        totalItems: totalSalesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// viewSales controller
exports.viewSales = async (req, res, next) => {
  try {
    const { id } = req.params;
    const saleOrder = await salesModel.findById(id);
    if (!saleOrder) {
      return res.status(404).json({ message: "Sale order not found" });
    }
    res.status(200).json({ message: "Sale order details", data: saleOrder });
  } catch (error) {
    next(error);
  }
};

// deleteSales controller
exports.deleteSales = async (req, res, next) => {
  try {
    const { id } = req.params;
    const saleOrder = await salesModel.findByIdAndDelete({_id:id});
    if (!saleOrder) {
      return res.status(404).json({ message: "Sale order not found" });
    }
    res.status(200).json({ message: "Sale order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// date wise data controller
exports.dateWiseSalesListing = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body; //2024-04-01

    // Ensure startDate and endDate are provided in the request body
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Both startDate and endDate are required in the request body" });
    }

    // Parse start and end date from the request body
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Define the aggregation pipeline
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: parsedStartDate,
            $lte: parsedEndDate
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by date in ascending order
      }
    ];

    // Execute the aggregation pipeline
    const result = await salesModel.aggregate(pipeline);

    res.status(200).json({ message: "Date-wise sales listing", data: result });
  } catch (error) {
    next(error);
  }
};