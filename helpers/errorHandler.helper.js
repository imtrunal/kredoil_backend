// Define a middleware function to handle internal server errors
const errorHandler = (err, req, res, next) => {
    console.error('Internal Server Error:', err);
    res.status(500).send('Internal Server Error');
};

module.exports = errorHandler;
