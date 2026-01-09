/**
 * Export all validations
 */

const userValidation = require('./user.validation');
const taskValidation = require('./task.validation');

module.exports = {
    ...userValidation,
    ...taskValidation
};
