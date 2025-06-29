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

// function find user by id
const findUserById = async (req, res) => {
    const { id } = req.params;

    try {
        // get user by id
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            },
            select:{
                id: true,
                name: true,
                email: true
            }
        });

        res.status(200).send({
            success: true,
            message: `Get user by Id :${id}`,
            data: user,
        });

    } catch (error) {
        res.status(500).send({
            success: true,
            message: "Internal server error",
        });
    }
};

// function update user
const updateUser = async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        });
    }

    let hashedPassword = undefined;
    if (req.body.password && req.body.password.trim() !== "") {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            },
        });

        return res.status(402).send({
            success: true,
            message: "Update user successfully",
            data: user
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }
}

// function delete user
const deleteUser = async (req, res) => {
    // get id form params
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: {
                id: Number(id)
            },
        });

        res.status(200).send({
            success: true,
            message: "User deleted successfully"
        });


    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { findUsers, createUser, findUserById, updateUser, deleteUser };