const router = require("express").Router();
const { purchaseController } = require("../imports/controllers.import");
const authenticateToken = require("../middleware/authenticateToken.middleware");

router.post("/add", authenticateToken, purchaseController.addPurchase);
router.get("/view/:purchaseId", authenticateToken, purchaseController.viewPurchase);
router.get("/list", purchaseController.listPurchase);
router.post("/delete/:purchaseId", authenticateToken, purchaseController.deletePurchase);

module.exports = router;
