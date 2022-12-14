const { Booking, BookingDetail, Transaction, Buyer } = require('../db/models')

const Validator = require('fastest-validator')
const { where, QueryTypes } = require('sequelize')
const { consoleSandbox } = require('@sentry/utils')
const v = new Validator

module.exports = {
    order: async (req, res, next) => {
        const { fligh_id, seat } = req.body

        //didalam tabel flight mungkin perlu ditambahkan harga per kursi berdasarkan jenis kelasnya jika ada beberapa kelas
        const existFlight = await Flight.findOne({
            where: {
                id: fligh_id
            }
        })
        if (!existFlight) {
            return res.status(400).json({
                status: false,
                message: 'Cannot create booking because the flight is unavailable',
                data: null
            })
        }
        const addBooking = await Booking.create({
            destination: existFlight.id,
            user: req.user.id,
            seat,
            status: 'Pending',
            booking_code: existFlight.flight_code
        })

        const addBookingDetail = await BookingDetail.create({
            booking_id: addBooking.id,
            price_per_seat: existFlight.price,

        })

        const addBuyer = await Buyer.create({
            booking_detail_id: addBookingDetail.id,
            user_id: req.user.id,
            total_seat: seat
        })

        //

    },

    myBooking: async (req, res, next) => {
        try {
            const query = ` SELECT
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
            JOIN "Flights" ON "Bookings".destination = "Flights".id`

            const booking = await sequelize.query(query, { type: QueryTypes.SELECT })

            if (!booking) {
                return res.status(400).json({
                    status: false,
                    message: 'The booking is not found'
                })
            }

            if (booking) {
                return res.ststus(200).json({
                    status: true,
                    message: 'Successfully Get My Booking',
                    data: booking
                })
            }
        } catch (err) {
            console.log
            next(err)
        }

    },



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
        const updateBooking = await BookingDetail.update({
            user_cancel_reason: cancel_reason
        }, {
            where: {
                booking_id
            }
        })
        const addRequest = await Transaction.update({
            user_cancel_reason: cancel_reason
        },
            {
                where: {
                    booking_id
                }
            })
        if (updateBooking && addRequest) {
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