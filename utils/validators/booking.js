const {body} = require('express-validator')

const validateBooking = [
    body('field_id')
        .notEmpty().withMessage('Field is required')
        .isInt().withMessage('Field ID must be an integer'),

    body('booking_name')
        .notEmpty().withMessage('Booking name is required'),

    body('phone')
        .notEmpty().withMessage('Phone is required')
        .isNumeric().withMessage('Phone must be a number'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid ISO8601 date'),

    body('start_at')
        .notEmpty().withMessage('Start is required')
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:mm format'),

    body('end_at')
        .notEmpty().withMessage('End is required')
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:mm format')
        .custom((value, {req}) => {
            const start = new Date(`${req.body.date}T${req.body.start_time}:00`);
            const end = new Date(`${req.body.date}T${value}:00`);
            if (end <= start) {
                throw new Error('End time must be after start time');
            }

            return true;
        }),

    body('total_price')
        .notEmpty().withMessage('Total price is required')
        .isNumeric().withMessage('Total price must be numeric')
        .custom((value) => {
            if (value < 0) {
                throw new Error('Total price cannot be negative');
            }

            return true;
        }),
];

module.exports = {validateBooking}