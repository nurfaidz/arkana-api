const { body } = require("express-validator")
const { FIELD_STATUS } = require("../../constants/status")

const validateField = [
    body('name').notEmpty().withMessage('Name is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('hourly_rate')
    .notEmpty().withMessage('Hourly rate is required')
    .isNumeric().withMessage('Hourly rate must be number'),
    body('status')
    .notEmpty().withMessage('Field status is required')
    .isIn(FIELD_STATUS).withMessage(`Field status must be one of ${Object.values(FIELD_STATUS).join(', ')}`),
];

module.exports = {validateField}
