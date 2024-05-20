const jwt = require('jsonwebtoken');
const CONFIG = require("../config/config");

// Function to generate JWT token
exports.generateToken = (userId) => {
    return jwt.sign({ userId }, CONFIG.secret_key, { expiresIn: "1h" });
};