const router = require("express").Router();
const { salesController } = require("../imports/controllers.import");
const authenticateToken = require("../middleware/authenticateToken.middleware");

router.post("/add", authenticateToken, salesController.addSaleOrder);
router.get("/view/:id", authenticateToken, salesController.viewSales);
router.get("/view/:id", authenticateToken, salesController.updateSaleOrder);
router.post("/delete/:id", authenticateToken, salesController.deleteSales);
router.get("/list", salesController.listSales);

module.exports = router;
