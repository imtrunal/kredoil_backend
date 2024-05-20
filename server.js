const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;
require("dotenv").config();
require("./database/conn");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Error handling middleware
const errorHandler = require("./helpers/errorHandler.helper");
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const adminRoutes = require("./router/admin.routes");
const categoryRoutes = require("./router/category.routes");
const purchaseRoutes = require("./router/purchase.routes");
const productRoutes = require("./router/product.routes");
const employeeRoutes = require("./router/employee.routes");
const salesRoutes = require("./router/sales.routes");
const dashboardRoutes = require("./router/dashboard.routes");
app.use("/admin", adminRoutes);
app.use("/category", categoryRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/product", productRoutes);
app.use("/employee", employeeRoutes);
app.use("/sales", salesRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
