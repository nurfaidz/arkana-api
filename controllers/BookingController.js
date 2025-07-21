const express = require("express");
const { validationResult } = require("express-validator");
const prisma = require("../prisma/client");

const findBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        field: {
          select: {
            id: true,
            name: true,
            type: true,
            hourly_rate: true,
          },
        },
        date: true,
        start_at: true,
        end_at: true,
        total_price: true,
        status: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).send({
      success: true,
      message: "Get all booking successfully",
      data: bookings,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createBooking = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).send({
            success: false,
            message: "Validation error",
            errors: errors.array()
        })
    }

    const { field_id, booking_name, phone, date, start_at, end_at, total_price } = req.body;

    const field = await prisma.field.findUnique({
      where: {
            id: Number(field_id),
        },
    });

    if (!field) {
        res.status(404).send({
            success: false,
            message: `Field with ID ${field_id} not found`
        })
    }

    try {
        const start = new Date(`${date}T${start_at}:00`);
        const end = new Date(`${date}T${end_at}:00`);

        const isConflict = await prisma.booking.findFirst({
          where: {
            field_id: Number(field_id),
            date: new Date(date),
            OR: [
              {
                start_at: {
                  lt: end,
                },
                end_at: {
                  gt: start,
                }
              }
            ]
          }
        });

        if (isConflict) {
          return res.status(409).send({
            success: false,
            message: 'This field is already booked for the selected time.'
          });
        }

        const booking = await prisma.booking.create({
            data: {
                field_id: parseInt(field_id),
                booking_name,
                phone,
                date: new Date(date),
                start_at: start,
                end_at: end,
                total_price: parseInt(total_price),
            },
        });

        res.status(201).send({
            success: true,
            message: "Create booking successfully",
            data:  booking
        });
    } catch (error) {
      console.log(error);

        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const findBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        field: {
          select: {
            id: true,
            name: true,
            type: true,
            hourly_rate: true,
          },
        },
        date: true,
        start_at: true,
        end_at: true,
        total_price: true,
        status: true,
      },
    })

    if (!booking) {
        return res.status(404).send({
            success: false,
            message: `Booking with ID ${id} not found`
      })
    }

    res.status(200).send({
        success: true,
        message: `Get booking by Id: ${id}`,
        data: booking
    });
  } catch (error) {
    res.status(500).send({
        success: true,
        message: "Internal server error"
    });
  }
}

const updateBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const findBooking = await prisma.booking.findUnique({
      where: {
        id: Number(id),
      },
    })
  
    if (!findBooking) {
        return res.status(404).send({
            success: false,
            message: `Booking with ID ${id} not found`
      })
    }
      
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).send({
          success: false,
          message: "Validation error",
          errors: errors.array()
      })
    }

    const { field_id, booking_name, phone, date, start_at, end_at, total_price } = req.body;

    const field = await prisma.field.findUnique({
      where: {
            id: Number(field_id),
        },
    });

    if (!field) {
        res.status(404).send({
            success: false,
            message: `Field with ID ${field_id} not found`
        })
    }

    const start = new Date(`${date}T${start_at}:00`);
    const end = new Date(`${date}T${end_at}:00`);

    const isConflict = await prisma.booking.findFirst({
      where: {
        id: {
          not: Number(id),
        },
        field_id: Number(field_id),
        date: new Date(date),
      OR: [
            {
              start_at: {
              lt: end,
            },
              end_at: {
                gt: start,
              }
            }
          ]
        }
      });

      if (isConflict) {
        return res.status(409).send({
          success: false,
          message: 'This field is already booked for the selected time.'
        });
      }

      const booking = await prisma.booking.update({
          where: {
                  id: Number(id)
            },
          data: {
              field_id: parseInt(field_id),
              booking_name,
              phone,
              date: new Date(date),
              start_at: start,
              end_at: end,
              total_price: parseInt(total_price),
          },
      });

      return res.status(200).send({
          success: true,
          message: "Update booking successfully",
          data: booking
      });

  } catch (error) {
    res.status(500).send({
        success: true,
        message: "Internal server error"
    });
  }
}

module.exports = { findBookings, createBooking, findBookingById, updateBooking }
