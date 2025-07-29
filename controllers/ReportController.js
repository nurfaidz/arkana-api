const prisma = require('../prisma/client');
const { FIELD_STATUS, BOOKING_STATUS } = require('../constants/status');

const getRevenueToday = async (req,res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const revenue = await prisma.booking.aggregate({
            where: {
                booking_status: BOOKING_STATUS.PAID,
                date: {
                    gte: startOfDay,
                    lt: endOfDay
                },
                end_at: {
                    lt: new Date()
                }
            },
            _sum: {
                total_price: true
            }
        });

        return res.status(200).send({
            success: true,
            message: "Revenue for today retrieved successfully",
            data: revenue._sum.total_price || 0
        })
    } catch (error) {  
        return res.status(500).send({
            success: false,
            message: error.message || "Internal server error"
        }); 
        
    }
}

module.exports = { getRevenueToday }