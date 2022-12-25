const { Booking, BookingDetail, Transaction, Buyer, SeatNumber, Flight } = require('../db/models')

const db = require('../db/models')
const Validator = require('fastest-validator')
const { QueryTypes } = require('sequelize')

const v = new Validator

const notification = require('../utils/notification');

module.exports = {
    order: async (req, res, next) => {

        try {
            const { flight_id, passenger_id, seat_total, price } = req.body
            let seatNumber, addBookingDetail, addBuyer, addSeat
            const seatAB = 'ABCDEF'
            let a = 0
            let totalPrice = seat_total * price

            const existFlight = await Flight.findOne({
                where: {
                    id: flight_id
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
                seat: seat_total,
                status: 'Pending',
                booking_code: existFlight.flight_code
            })

            if (addBooking) {
                addBookingDetail = await BookingDetail.create({
                    booking_id: addBooking.id,
                    price_per_seat: price
                })
                if (addBookingDetail) {
                    addBuyer = await Buyer.create({
                        booking_detail_id: addBookingDetail.id,
                        user_id: req.user.id,
                        total_seat: seat_total
                    })
                    if (addBuyer) {
                        while (a < passenger_id.length) {
                            let randomAB = seatAB.charAt(Math.floor(Math.random() * seatAB.length))
                            let nomor = Math.floor(Math.random() * 10) + 1
                            seatNumber = randomAB + nomor

                            const seat = await SeatNumber.findOne({ where: { seat_number: seatNumber } })

                            if (!seat) {
                                addSeat = SeatNumber.create({
                                    seat_number: seatNumber,
                                    booking_detail_id: addBookingDetail.id,
                                    passenger_id: passenger_id[a],
                                })
                                a++
                            }
                        }

                        // emit notification when booking
                        notification.booking(req.user.id, addBooking.id);

                        return res.status(200).json({
                            status: true,
                            message: 'Successfully Create Booking',
                            data: {
                                booking_id: addBooking.id,
                                booking_code: addBooking.booking_code,
                                flight_code: existFlight.flight_code,
                                document_url: addBookingDetail.document_url,
                                departure_iata: existFlight.departure_iata_code,
                                departure_time: existFlight.departure_time,
                                arrival_iata: existFlight.arrival_iata_code,
                                arrival_time: existFlight.arrival_time,
                                seat: addBooking.seat,
                                status: addBooking.status,
                                price_per_seat: addBookingDetail.price_per_seat,
                                total_price: totalPrice
                            }
                        })
                    }
                }
            }
        } catch (err) {
            console.log(err)
            next(err)
        }


    },

    myBooking: async (req, res, next) => {
        try {
            const query = ` SELECT
            "Bookings".id AS booking_id,
                "Bookings".booking_code,
                "Flights".flight_code,
                "BookingDetails".document_url,
                "Flights".departure_iata_code AS departure_iata,
                "Flights".departure_time,
                "Flights".arrival_iata_code AS arrival_iata,
                "Flights".arrival_time,
                "Bookings".seat,
                "Bookings".status,
                "BookingDetails".price_per_seat
            FROM
            "Bookings"
            JOIN "BookingDetails" ON "Bookings".id = "BookingDetails".booking_id AND "Bookings".user = ${req.user.id}
            JOIN "Flights" ON "Bookings".destination = "Flights".id `

            const booking = await db.sequelize.query(query, { type: QueryTypes.SELECT })

            for (let i = 0; i < booking.length; i++) {
                booking[i].total_price = booking[i].seat * booking[i].price_per_seat
            }

            if (!booking) {
                return res.status(400).json({
                    status: false,
                    message: 'The booking is not found'
                })
            }

            if (booking) {
                return res.status(200).json({
                    status: true,
                    message: 'Successfully Get My Booking',
                    data: booking
                })
            }
        } catch (err) {
            console.log(err)
            next(err)
        }

    },

    cancelRequest: async (req, res, next) => {
        const { booking_id, cancel_reason } = req.body

        const existBooking = await BookingDetail.findOne({ where: { booking_id } })
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

        if (updateBooking) {
            // emit the notification into the user.
            notification.user_cancel(id, booking_id)
            return res.status(200).json({
                status: false,
                message: "Successfully Send Request Cancel Booking",
                data: {
                    booking_id: existBooking.booking_id,
                    status: 'Pending',
                    message: 'Your cancel request is being processed,',
                    cancel_reason
                }
            })
        }
    }
}
