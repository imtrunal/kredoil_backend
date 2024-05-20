const router = require("express").Router();
const { productController } = require("../imports/controllers.import");
const authenticateToken = require("../middleware/authenticateToken.middleware");

router.post("/add", authenticateToken, productController.addProduct);
router.post("/get-price", productController.getPrice);
router.post("/edit/:productId", authenticateToken, productController.updateProduct);
router.get("/view/:productId", authenticateToken, productController.viewProduct);
router.get("/list", productController.getAllProducts);
router.get("/nameList", productController.getProductList);
router.post("/cost-price", productController.getCostPrice);

module.exports = router;
