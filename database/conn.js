const mongoose = require("mongoose");
const CONFIG = require("../config/config");

mongoose
  .connect(CONFIG.mongooseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log("database not connected");
  });
