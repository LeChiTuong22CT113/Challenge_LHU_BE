/**
 * Async Handler / Catch Async
 * Wrapper to eliminate try-catch blocks in async controllers
 */

/**
 * Wraps async function and catches errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;
