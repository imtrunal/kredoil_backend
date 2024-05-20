const router = require("express").Router();
const { categoryController } = require("../imports/controllers.import");
const authenticateToken = require("../middleware/authenticateToken.middleware");

router.post("/add", authenticateToken, categoryController.addCategory);
router.post("/edit/:categoryId", authenticateToken, categoryController.updateCategory);
router.get("/view/:categoryId", authenticateToken, categoryController.viewCategory);
router.post("/delete/:id", authenticateToken, categoryController.deleteCategory);
router.get("/list", categoryController.getAllCategories);
router.get("/nameList", categoryController.getCategoryList);
router.get("/getVariantsByCategory/:categoryId", categoryController.getCategoryWithVariants);
router.get("/getCategoryStock", categoryController.getCategoryStock);

module.exports = router;
