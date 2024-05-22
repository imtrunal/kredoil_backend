const { categoryModel } = require("../imports/models.import");
const { categoryValidation } = require("../imports/validation.import");

exports.addCategory = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = categoryValidation.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    console.log("value:::", value);
    console.log("req.userId:::", req.user.userId);

    const categoryName = value.categoryName;

    const checkName = await categoryModel.findOne({ categoryName: categoryName });
    if (checkName == null) {
      const data = new categoryModel({
        categoryName: categoryName,
        active: value.active,
        variants: value.variants,
        createdBy: req.user.userId,
      });
      const savedata = await data.save();

      res.status(201).json({
        message: "Add category successful",
        status: 201,
        data: savedata,
      });
    } else {
      res.status(403).json({
        message: "Category is already define",
        status: 403,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const newCategoryName = req.body.categoryName;

    // Check if the new category name already exists and is different from the current category being updated
    const existingCategory = await categoryModel.findOne({ categoryName: newCategoryName });
    if (existingCategory && existingCategory.categoryId.toString() !== categoryId) {
      return res.status(403).json({
        message: "Category name is already defined",
        status: 403,
      });
    }

    const updatedCategory = await categoryModel.findOneAndUpdate(
      { categoryId: categoryId },
      {
        $set: {
          categoryName: newCategoryName,
          active: req.body.active,
          variants: req.body.variants,
          updatedBy: req.user.userId,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Category update successful",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

exports.viewCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const data = await categoryModel.findOne({ categoryId: categoryId });

    if (!data) {
      return res.status(404).json({
        message: "Category not found",
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

exports.getAllCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const categories = await categoryModel
      .find({
        deletedAt: { $exists: false },
        deletedBy: { $exists: false },
      })
      .skip(skip)
      .limit(limit);

    const totalCategories = await categoryModel.countDocuments();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        message: "No categories found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Categories retrieved successfully",
      status: 200,
      data: categories,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalCategories / limit),
        pageSize: limit,
        totalItems: totalCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    console.log(categoryId);

    const category = await categoryModel.findOne({ categoryId });
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        status: 404,
      });
    }

    category.active = 2; // Set status to 2 for deleted
    category.deletedAt = new Date();
    category.deletedBy = req.user.userId;

    await category.save();

    res.status(200).json({
      message: "Category deleted successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryList = async (req, res, next) => {
  try {
    const categories = await categoryModel.find().select("categoryName categoryId");

    if (categories.length === 0) {
      return res.status(404).json({
        message: "No categories found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Categories retrieved successfully",
      status: 200,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryWithVariants = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;

    // Find the category by its ID
    const category = await categoryModel.findOne({ categoryId });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Extract variants from the category
    const variants = category.variants;

    res.status(200).json({
      message: "Category with variants found",
      status: 200,
      data: variants, // Assuming only one category is found
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryStock = async (req, res) => {
  try {
    const categories = await categoryModel.find({}, "categoryName variants.stock");

    const categoryStock = categories.map((category) => {
      const totalStock = category.variants.reduce((acc, variant) => acc + variant.stock, 0);
      return { categoryName: category.categoryName, totalStock };
    });

    res.status(200).json({
      message: "Category stock retrieved successfully",
      categoryStock,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};
