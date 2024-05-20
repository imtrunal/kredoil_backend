const router = require("express").Router();
const { adminController } = require("../imports/controllers.import");
const authenticateToken = require("../middleware/authenticateToken.middleware");

router.post("/login", adminController.login);
router.post("/logout", authenticateToken, adminController.logout);

module.exports = router;
