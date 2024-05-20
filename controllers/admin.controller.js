const { adminModel } = require("../imports/models.import");
const { adminValidation } = require("../imports/validation.import");
const { generateToken } = require("../helpers/generateToken.helper");
const { comparePasswords } = require("../helpers/comparePasswords.helper");

exports.login = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = adminValidation.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Assuming you have validated user credentials and found them correct
    const user = await adminModel.findOne({ email: value.email });

    if (!user || !(await comparePasswords(value.password, user.password))) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Store JWT token in database
    user.token = token;
    await user.save();

    // Set a cookie with the JWT token
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // Cookie expires in 1 hour

    res.status(200).send({
      status: 200,
      message: "Login successful",
      data: token,
      _id: user._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Clear the token stored in cookies
    res.clearCookie("token");

    // Find the user by ID
    const userId = req.user.userId; // Assuming userId is extracted from the request
    const user = await adminModel.findById(userId);

    // If user not found, send error response
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    // Remove the token from the user document
    user.token = undefined;
    await user.save();

    res.status(200).send({
      status: 200,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
