const bcrypt = require("bcrypt");

exports.comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};
