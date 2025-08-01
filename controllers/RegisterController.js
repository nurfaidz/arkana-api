const express = require('express')
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const prisma = require("../prisma/client")

const register = async (req, res) => {
    // check validation result
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
        // if any error, return to user
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        // insert data
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        // return response json
        res.status(201).send({
            success: true,
            message: "Register successfully",
            data: user
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { register }