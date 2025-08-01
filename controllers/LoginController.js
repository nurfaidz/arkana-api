const express = require('express')
const { validationResult } = require('express-validator')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = require('../prisma/client')

const login = async (req, res) => {
    // check validationr result
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        // if any error, return to user
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    try {
        // find user
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });

        if (!user) 
            return res.status(404).json({
                success: false,
                message: "User not found",
            });

        // compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        // if password incorrect
        if (!validPassword)
            return res.status(401).json({
            success: false,
            message: "Invalid password"
        });

        // generate JWT Token
        const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        // destructure to remove password from user object
        const { password, ...userWithoutPassword } = user;

        // return response
        res.status(200).send({
            success: true,
            message: "Login successfully",
            data: {
                user: userWithoutPassword,
                token, token
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { login };