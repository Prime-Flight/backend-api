const { Booking, BookingDetail } = require('../db/models');
const { QueryTypes } = require('sequelize');
const db = require('../db/models');
module.exports = {
    getAllBooking: async (req, res, next) => {
        try {
            // raw query string
            const getAllBookingWithDetails = `
                SELECT
                    "Bookings".id,
                    "Bookings".booking_code,
                    "Flights".flight_code,
                    "BookingDetails".document_url,
                    "Flights".departure_iata_code,
                    "Flights".departure_time,
                    "Flights".arrival_iata_code,
                    "Flights".arrival_time,
                    "Bookings".seat,
                    "Bookings".status,
                    "BookingDetails".price_per_seat  
                FROM
                    "Bookings"
                    JOIN "BookingDetails" ON "Bookings".id = "BookingDetails".booking_id
                    JOIN "Flights" ON "Bookings".destination = "Flights".id
            `

            // query the data using the raw query
            var booking = await db.sequelize.query(getAllBookingWithDetails, {
                type: QueryTypes.SELECT
            });

            let listBooking = [];

            booking.forEach(function(data) { 
                let bookingData = { 
                    id: data.id,
                    booking_code: data.booking_code,
                    flight_code: data.flight_code,
                    document_url: data.document_url,
                    departure: { 
                        departure_iata_code: data.departure_iata_code,
                        departure_time: data.departure_time,
                    },
                    arrival: {
                        arrival_iata_code: data.arrival_iata_code,
                        arrival_time: data.arrival_time,
                    },
                    seat: data.seat,
                    status: data.status,
                    price_per_seat: data.price_per_seat
                }
                listBooking.push(bookingData);
            });

            return res.status(200).json({
                status: true,
                message: "Successfully Get All Booking",
                data: listBooking
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    getBookingDetails: async (req, res, next) => {
        try {
            const { booking_id } = req.params;
            // raw query string
            const getBookingWithDetails = `
              select
                  "Bookings".status,
                  "Bookings".seat,
                  "BookingDetails".price_per_seat,
                  "Flights".departure_time,
                  "Flights".departure_iata_code,
                  "Flights".arrival_time,
                  "Flights".arrival_iata_code,
                  "Passengers".passenger_category,
                  "PassengerDetails".gender,
                  "PassengerDetails"."name"
              from
                  "BookingDetails"
                  join "Bookings" on "BookingDetails".booking_id = "Bookings".id 
                  join "Flights" on "Bookings".destination = "Flights".id
                  join "Passengers" on "Passengers".buyer_id  = "Bookings"."user"
                  join "PassengerDetails" on "PassengerDetails".id = "Passengers".passenger_detail
              WHERE
                "Bookings".id = 18
            `

            // query the data using the raw query
            var booking = await db.sequelize.query(getBookingWithDetails, {
                type: QueryTypes.SELECT
            });


            return res.status(200).json({
                status: true,
                message: "Successfully Get Booking Details",
                data: booking
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    acceptUserBooking: async (req, res, next) => {
        try {
            const { booking_id } = req.body;

            acceptedBooking = await Booking.update({ status: "Success" }, { where: { id: booking_id } });

            return res.status(200).json({
                status: true,
                message: "Successfully Accept Booking",
                data: {
                    booking_id: acceptedBooking.id,
                    status: acceptedBooking.status
                }
            });
        } catch (err) {
            next(err);
        }
    },
    rejectUserBooking: async (req, res, next) => {
        try {
            const { booking_id, message } = req.body;

            rejectBooking = await Booking.update({ status: "Success" },   
                {where: { id: booking_id }});    

            adminRejectBookingMessage = await BookingDetail.update(
                {admin_reject_reason: message}, {where: { booking_id: booking_id }})

            return res.status(200).json({
                status: true,
                message: `Successfully Reject Booking the booking with id ${rejectBooking.id}`,
                data: {
                    booking_id: rejectBooking.id,
                    status: rejectBooking.status,
                    message: adminRejectBookingMessage.admin_reject_reason
                }
            });
        } catch (err) {
            next(err);
        }
    }
}
