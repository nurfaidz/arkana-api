const { body } = require("express-validator")

const validateField = [
    body('name').notEmpty().withMessage('Name is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('hourly_rate')
    .notEmpty().withMessage('Hourly rate is required')
    .isNumeric().withMessage('Hourly rate must be number')
];

module.exports = {validateField}
