const express = require('express');
const { validationResult } = require('express-validator');
const prisma = require('../prisma/client');
const { FIELD_STATUS } = require('../constants/status');

const findFields = async (req, res) => {
    try {
        // get all fields from database
        const fields = await prisma.field.findMany({
            select: {
                id: true,
                name: true,
                type: true,
                hourly_rate: true,
                status: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        res.status(200).send({
            success: true,
            message: "Get all fields successfully",
            data: fields
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }
}

const createField = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).send({
            success:false,
            message: "Validation error",
            errors: errors.array()
        })
    }

    try {
        const field = await prisma.field.create({
            data: {
                name: req.body.name,
                type: req.body.type,
                hourly_rate: req.body.hourly_rate,
                status: req.body.status,
            },
        });

        res.status(201).send({
            success: true,
            message: "Create field successfully",
            data: field
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

const findFieldById = async (req, res) => {
    const { id } = req.params;

    try {
        const field = await prisma.field.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                name: true,
                type: true,
                hourly_rate: true,
                status: true,
            }
        });

        if (!field) {
            res.status(404).send({
                success: false,
                message: `Field with ID ${id} not found`
            })
        }

        res.status(200).send({
            success: true,
            message: `Get field by Id: ${id}`,
            data: field
        });
    } catch (error) {
        res.status(500).send({
            success: true,
            message: "Internal server error"
        });
    }
};

const updateField = async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        });
    }

    try {
        const field = await prisma.field.update({
            where: {
                id: Number(id)
            },
            data: {
                name: req.body.name,
                type: req.body.type,
                hourly_rate: req.body.hourly_rate,
                status: req.body.status,
            },
        });

        return res.status(200).send({
            success: true,
            message: "Update field successfully",
            data: field
        });
    } catch (error) {
        
        if (error.code === "P2025") {
            return res.status(404).send({
                success: false,
                message: `Field with ID ${id} not found`
            })
        }

        return res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }
}

const deleteField = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.field.delete({
            where: {
                id: Number(id)
            },
        });

        res.status(200).send({
            success: true,
            message: "Field deleted successfully"
        })
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: `Field with ID ${id} not found`
            });
        }
        
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

const changeFieldStatus = async (req, res) => {
    console.log(req.params)
    const { id } = req.params;
    
    try {
        const field = await prisma.field.findUnique({
            where: {
                id: Number(id),
            },
        });
        
        if (!field) {
            return res.status(404).send({
                success: false,
                message: `Field with ID ${id} not found`
            });
        }
        const newStatus = field.status === FIELD_STATUS.AVAILABLE ? FIELD_STATUS.MAINTENANCE : FIELD_STATUS.AVAILABLE;

        const updatedField = await prisma.field.update({
            where: {
                id: Number(id),
            },
            data: {
                status: newStatus,
            }
        });

        return res.status(200).send({
            success: true,
            message: `Field status changed to ${newStatus}`,
            data: updatedField
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = { findFieldById, findFields, createField, updateField, deleteField, changeFieldStatus };