const router = require("express").Router();
const { employeeController } = require("../imports/controllers.import");
const authenticateToken = require("../middleware/authenticateToken.middleware");

router.post("/create", authenticateToken, employeeController.createEmployee);
router.post("/update/:id", authenticateToken, employeeController.updateEmployee);
router.get("/view/:id", authenticateToken, employeeController.getEmployeeById);
router.get("/list", employeeController.getEmployees);
router.post("/delete/:id", authenticateToken, employeeController.deleteEmployee);

module.exports = router;
