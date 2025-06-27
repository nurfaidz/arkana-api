const express = require('express')
const prisma = require('../prisma/client')
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

// function get all users
const findUsers = async (req, res) => {
    try {
        
        // get all users from database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                id: "desc"
            },
        });

        res.status(200).send({
            success: true,
            message: "Get all users successfully",
            data: users
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }
};

// function create user
const createUser = async (req, res) => {
    // check validation result
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        // if true, return error to user
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        })
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        // insert data
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            },
        });

        res.status(201).send({
            success: true,
            message: "Register successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = { findUsers, createUser };