const { verifyToken } = require("../helpers/verifyToken .helper");
const { adminModel } = require("../imports/models.import");
const CONFIG = require("../config/config");

const authenticateToken = async (req, res, next) => {
  try {
    // Get the JWT token from the request headers or cookies
    const token = req.headers.authorization || req.cookies.token;
    console.log("token::", token);

    if (!token) {
      return res.status(401).send({ status: 401, message: "Unauthorized: Missing token" });
    }

    // Verify the token using the function from verifyToken.js
    const decoded = verifyToken(token, CONFIG.secret_key);
    console.log("decoded:::", decoded);

    // Check if user exists in database
    const user = await adminModel.findOne({ _id: decoded.userId, token });

    if (!user) {
      return res.status(401).send({ status: 401, message: "Unauthorized: Invalid token" });
    }

    // Attach user information to the request object
    req.user = { userId: decoded.userId };

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).send({ status: 401, message: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticateToken;
