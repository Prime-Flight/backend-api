const { Booking, BookingDetail, Transaction, Buyer, SeatNumber, Flight } = require('../db/models')

const db = require('../db/models')
const Validator = require('fastest-validator')
const { QueryTypes } = require('sequelize')

const v = new Validator

const notification = require('../utils/notification');
// const ticket = require('../utils/ticket');
const lib = require('../lib');

module.exports = {
    order: async (req, res, next) => {

        try {
            const { flight_id, passenger_id } = req.body
            let seatNumber, addBookingDetail, addBuyer, addSeat
            const seatAB = 'ABCDEF'
            let numSeat = 0

            const flight = await Flight.findOne({
                where: {
                    id: flight_id
                }
            })

            if (!flight) {
                return res.status(400).json({
                    status: false,
                    message: 'Cannot create booking because the flight is unavailable',
                    data: null
                })
            }

            const addBooking = await Booking.create({
                destination: flight.id,
                user: req.user.id,
                seat: passenger_id.length,
                status: 'Pending',
                booking_code: flight.flight_code
            })

            if (addBooking) {
                addBookingDetail = await BookingDetail.create({
                    booking_id: addBooking.id,
                    price_per_seat: flight.price
                })
                if (addBookingDetail) {
                    addBuyer = await Buyer.create({
                        booking_detail_id: addBookingDetail.id,
                        user_id: req.user.id,
                        total_seat: passenger_id.length
                    })
                    if (addBuyer) {
                        let seatArr = []

                        let seatCapacity = flight.seat_capacity - passenger_id.length
                        await Flight.update({ seat_capacity: seatCapacity }, { where: { id: flight.id } })

                        for (let i = 1; i <= 32; i++) {
                            for (let j = 0; j < seatAB.length; j++) {
                                let seat = `${seatAB.charAt(j)}-${i}`
                                const checkSeat = await SeatNumber.findOne({ where: { seat_number: seat, booking_detail_id: addBookingDetail.id } })
                                if (!checkSeat) {
                                    numSeat = numSeat + 1
                                    seatArr.push(seat)
                                    if (numSeat == passenger_id.length) {
                                        break
                                    }
                                }
                            }
                            if (numSeat == passenger_id.length) {
                                break
                            }
                        }

                        if (numSeat == passenger_id.length) {
                            for (let i = 0; i < seatArr.length; i++) {
                                addSeat = await SeatNumber.create({
                                    seat_number: seatArr[i],
                                    booking_detail_id: addBookingDetail.id,
                                    passenger_id: passenger_id[i],
                                })
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
                                flight_code: flight.flight_code,
                                document_url: addBookingDetail.document_url,
                                departure_iata: flight.departure_iata_code,
                                departure_time: flight.departure_time,
                                arrival_iata: flight.arrival_iata_code,
                                arrival_time: flight.arrival_time,
                                seat_capacity: seatCapacity,
                                seat: addBooking.seat,
                                status: addBooking.status,
                                price_per_seat: addBookingDetail.price_per_seat,
                                total_price: flight.price * passenger_id.length,
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

    flights: async (req, res, next) => {
        try {
            const { departure_iata, arrival_iata, flight_date, page, record } = req.query
            const date1 = `${flight_date} 00:00:01`
            const date2 = `${flight_date} 23:59:59`

            let limit = parseInt(record)
            let pages = parseInt(page)
            let start = (pages - 1) * limit
            let end = pages * limit

            let query = `SELECT "Flights".id AS flight_id,
            "Flights".flight_code,
            "Flights".departure_iata_code AS departure_iata,
            "Flights".departure_icao_code AS departure_icao,
            "Flights".departure_time,
            "Flights".arrival_iata_code AS arrival_iata,
            "Flights".arrival_icao_code AS arrival_icao,
            "Flights".arrival_time,
            "Airlines".airline,
            "Airlines".airline_code,
            "Airlines".airline_logo,
            "Flights".seat_capacity,
            "Flights".price
            FROM "Flights" JOIN "Airlines" 
            ON "Flights".airline_id = "Airlines".id WHERE departure_iata_code = '${departure_iata}' AND arrival_iata_code = '${arrival_iata}' AND departure_time BETWEEN '${date1}' AND '${date2}' LIMIT ${limit} OFFSET ${start}`

            const flight = await db.sequelize.query(query, {
                type: QueryTypes.SELECT
            });
            if (!flight) {
                return res.status(400).json({
                    status: false,
                    message: "Flight is unavailable"
                })
            }

            let count = `SELECT count(*) FROM "Flights" JOIN "Airlines"
            ON "Flights".airline_id = "Airlines".id WHERE
            departure_iata_code = '${departure_iata}' AND arrival_iata_code = '${arrival_iata}' AND departure_time BETWEEN '${date1}' AND '${date2}'`

            const dataCount = await db.sequelize.query(count, { type: QueryTypes.SELECT })

            let countFiltered = dataCount[0].count
            let pagination = {}
            pagination.totalRow = dataCount[0].count
            pagination.totalPage = Math.ceil(countFiltered / limit)
            if (end < countFiltered) {
                pagination.next = {
                    page: pages + 1,
                    limit

                }
            }
            if (start > 0) {
                pagination.prev = {
                    page: pages - 1,
                    limit
                }
            }

            return res.status(200).json({
                status: true,
                message: "FLights is available",
                pagination,
                data: flight
            })

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
                status: true,
                message: "Successfully Send Request Cancel Booking",
                data: {
                    booking_id: existBooking.booking_id,
                    status: 'Pending',
                    message: 'Your cancel request is being processed,',
                    cancel_reason
                }
            })
        }
    },
    checkout: async (req, res, next) => {
        try {
            const { id } = req.user;
            const { booking_id } = req.body;
            const checkBooking = await Booking.findOne({ where: { id: booking_id } });
            if (!checkBooking) {
                return res.status(400).json({
                    status: true,
                    message: "Cannot checkout booking because no booking info",
                    data: null
                });
            }

            // check the booking is the authorized user to access it.
            if (checkBooking.user != id) {
                return res.status(403).json({
                    status: true,
                    message: "Cannot checkout booking because You are not the authorized user",
                    data: null
                });
            }

            // update the booking status
            await Booking.update({ status: "Success" }, { where: { id: booking_id } });

            const query = ` 
              SELECT
                  "Bookings".id booking_id,
                  "Bookings".seat total_seat,
                  "Bookings".user user_id,
                  "Bookings".status booking_status,
                  "Bookings".booking_code,
                  "BookingDetails".document_url,
                  "BookingDetails".price_per_seat,
                  "Flights".flight_code,
                  "Airlines".airline,
                  "Airlines".airline_code,
                  "Flights".departure_iata_code,
                  TO_CHAR("Flights".departure_time, 'YYYY-MM-DD hh:mm') as departure_time,
                  "Flights".arrival_iata_code,
                  "PassengerDetails".name
              FROM
                  "Bookings"
                  JOIN "BookingDetails" ON "Bookings".id = "BookingDetails".booking_id
                  JOIN "Passengers" ON "Bookings"."user" = "Passengers".buyer_id
                  JOIN "PassengerDetails" ON "Passengers".passenger_detail = "PassengerDetails".id
                  JOIN "Flights" ON "Flights".id = "Bookings".destination
                  JOIN "Airlines" ON "Flights".airline_id = "Airlines".id
              WHERE
                  "Bookings"."user" = ${id} 
                  AND "Bookings".id = ${booking_id};
              `;

            let bookingInfo = await db.sequelize.query(query, { type: QueryTypes.SELECT });

            bookingInfo = bookingInfo[0];
            // generate the ticket
            // ticketResult = await ticket.generateTicket('ticket.ejs', { bookingInfo});


            // await BookingDetail.update({document_url: ticketUpload.url }, {where: { booking_id: bookingInfo[0].booking_id }});

            const checkTransaction = await Transaction.findOne({ where: { booking_id: bookingInfo[0].booking_id } });

            if (checkTransaction != null && checkTransaction.status == "Success") {
                return res.status(409).json({
                    status: false,
                    message: `Your transaction for booking of ${bookingInfo[0].booking_code} is already Success`
                })
            }

            const transaction = await Transaction.create({
                booking_id: bookingInfo[0].booking_id,
                total_price: bookingInfo[0].total_seat * bookingInfo[0].price_per_seat,
                status: "Success"
            });


            // return res.render('ticket/ticket.ejs', { bookingInfo});

            return res.status(200).json({
                status: true,
                message: "Successfully Checkout Booking",
                // data: ticketResult
                data: {
                    booking_id: bookingInfo[0].booking_id,
                    transaction_id: transaction.id,
                    document_url: ticketUpload.url,
                    transaction_status: transaction.status,
                    total_price: transaction.total_price,
                }
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    getHistory: async (req, res, next) => {
        try {
            const { id } = req.user;
            const query = `
        SELECT
            "Bookings".id booking_id,
            "Bookings".seat total_seat,
            "Bookings".user user_id,
            "Bookings".status booking_status,
            "Bookings".booking_code,
            "BookingDetails".document_url,
            "BookingDetails".price_per_seat,
            "Flights".flight_code,
            "Airlines".airline,
            "Airlines".airline_code,
            "Flights".departure_iata_code,
            "Flights".arrival_iata_code,
            TO_CHAR("Flights".departure_time, 'YYYY-MM-DD hh:mm'),
            "PassengerDetails".name,
            "Transactions".status,
            "Transactions".total_price
        FROM
            "Bookings"
            JOIN "BookingDetails" ON "Bookings".id = "BookingDetails".booking_id
            JOIN "Passengers" ON "Bookings"."user" = "Passengers".buyer_id
            JOIN "PassengerDetails" ON "Passengers".passenger_detail = "PassengerDetails".id
            JOIN "Flights" ON "Flights".id = "Bookings".destination
            JOIN "Airlines" ON "Flights".airline_id = "Airlines".id
            JOIN "Transactions" ON "Transactions".booking_id = "Bookings".id
        WHERE
            "Bookings"."user" = ${id}; 
      `
            let transactionHistory = await db.sequelize.query(query, { type: QueryTypes.SELECT });
            return res.status(200).json({
                status: true,
                message: "Successfully Get Transaction History",
                data: transactionHistory
            });
        } catch (err) {
            next(err);
        }
    }
}
