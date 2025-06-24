const { body } = require('express-validator')
const { prisma } = require('../../prisma/client');

// Define validation for register
const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async (value) => {
            if (!value) {
                throw new Error('Email is required');
            }

            const user = await prisma.user.findUnique({where: {email: value}});
            if (user) {
                throw new Error('Email already exists');
            }

            return true
        }),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters'),
];

// Define validation for login
const validateLogin = [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters'),
];

module.exports = {validateLogin, validateRegister}