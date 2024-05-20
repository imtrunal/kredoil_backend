const jwt = require('jsonwebtoken');

exports.verifyToken = (token, secretKey) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
