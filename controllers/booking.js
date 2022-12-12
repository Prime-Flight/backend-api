const { Booking } = require('../db/models');

module.exports = {
    getAllBooking: async(req, res, next) => {
        try { 
            const allBooking = await Booking.findAll();
            return res.status(200).json({
                status: true,
                message: "Successfully Get All Booking",
                data: allBooking
            });
        } catch (err) {
            next(err);
        }
    },
    acceptUserBooking: async(req, res, next) => {
        try { 
            const { booking_id } = req.body;

            acceptedBooking = await Booking.update({status: "Success"}, {where: { id: booking_id }});

            return res.status(200).json({
                status: true,
                message: "Successfully Get All Booking",
                data: acceptedBooking
            });
        } catch (err) {
            next(err);
        }
    },
    rejectUserBooking: async(req, res, next) => {
        try { 
            const { booking_id } = req.body;

            acceptedBooking = await Booking.update({status: "Success"}, {where: { id: booking_id }});

            return res.status(200).json({
                status: true,
                message: "Successfully Get All Booking",
                data: acceptedBooking
            });

        } catch (err) {
            next(err);
        }
    }
}
