const { Transaction } = require('../db/models')
const Validator = require('fastest-validator')
const v = new Validator

module.exports = {
    cancelRequest: async (req, res, next) => {
        const { booking_id, cancel_reason } = req.body

        const existBooking = await Transaction.findOne({ where: { booking_id } })
        if (!existBooking) {
            return res.status(200).json({
                status: false,
                message: "Cannot Cancel booking because the flight is unavailable",
                data: null
            })
        }
        const addRequest = await Transaction.update({
            user_cancel_reason: cancel_reason
        },
            {
                where: {
                    booking_id
                }
            })
        if (addRequest) {
            return res.status(200).json({
                status: false,
                message: "Successfully Send Request Cancel Booking",
                data: {
                    booking_id: 1,
                    status: 'Pending',
                    message: 'Your cancel request is being processed,',
                    cancel_reason
                }
            })
        }
    }
}