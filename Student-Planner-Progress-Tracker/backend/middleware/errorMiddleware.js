/**
 * 404 Route Catch Middleware fallback
 * Captures calls made to paths that do not exist on the router stack
 */
const notFound = (req, res, next) => {
    const error = new Error(`Resource Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Sends error down into the global handler below
};

/**
 * Global centralized app execution exception capture handler
 */
const errorHandler = (err, req, res, next) => {
    // If route handler failed without explicit code injection, fall back to server error (500)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        message: err.message,
        // Conceals system call stacks when running live production builds
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
};

module.exports = { notFound, errorHandler };