const { Booking, BookingDetail, Transaction, Buyer, SeatNumber, Flight } = require('../db/models')

const db = require('../db/models')
const Validator = require('fastest-validator')
const { QueryTypes } = require('sequelize')

const v = new Validator

const notification = require('../utils/notification');

module.exports = {
    order: async (req, res, next) => {

        try {
            const { flight_id, passenger_id } = req.body
            let seatNumber, addBookingDetail, addBuyer, addSeat
            const seatAB = 'ABCDEF'
            let a = 0
            let departureDate, departureTime, arrivalDate, arrivalTime

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

            departureDate = `${flight.departure_time.getDate()}-${flight.departure_time.getMonth() + 1}-${flight.departure_time.getFullYear()}`
            departureTime = `${flight.departure_time.getHours()}:${flight.departure_time.getMinutes()}`
            arrivalDate = `${flight.arrival_time.getDate()}-${flight.arrival_time.getMonth() + 1}-${flight.arrival_time.getFullYear()}`
            arrivalTime = `${flight.arrival_time.getHours()}:${flight.arrival_time.getMinutes()}`


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
                                flight_code: flight.flight_code,
                                document_url: addBookingDetail.document_url,
                                departure_iata: flight.departure_iata_code,
                                departure_date: departureDate,
                                departure_time: departureTime,
                                arrival_iata: flight.arrival_iata_code,
                                arrival_date: arrivalDate,
                                arrival_time: arrivalTime,
                                seat_capacity: flight.seat_capacity - passenger_id.length,
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
            const { departure_iata, arrival_iata, flight_date } = req.body
            const query = `
            SELECT
            "Flights".id AS flight_id,
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
            ON "Flights".airline_id = "Airlines".id AND "Flights".departure_iata_code = ${departure_iata} AND "Flights".arrival_iata_code = ${arrival_iata} AND "Flights".departure_time = flight_date
          `
            const flight = await db.sequelize.query(query, {
                type: QueryTypes.SELECT
            });

            if (!flight) {
                return res.status(400).json({
                    status: false,
                    message: "Flight is unavailable"
                })
            }
            if (flight) {
                return res.status(200).json({
                    status: true,
                    message: "FLights is available",
                    data: flight
                })
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
  checkout: async(req, res, next) => {
    try {
      const { id } = req.user;
      const { booking_id } = req.body;
      const checkBooking = await Booking.findOne({ where: { id: booking_id }});
      if (!checkBooking) { 
        return res.status(400).json({
          status: true,
          message: "Cannot checkout booking because no booking info",
          data: null
        });
      }

      // check the booking is the authorized user to access it.
      if ( checkBooking.user != id ) {
        return res.status(403).json({
          status: true,
          message: "Cannot checkout booking because You are not the authorized user",
          data: null
        });
      }

      // update the booking status
      await Booking.update({status: "Success"}, { where: { id: booking_id } }); 

      const query = ` 
        SELECT
        "Bookings".id booking_id,
        "Bookings".seat total_seat,
        "Bookings".user user_id,
        "Bookings".status booking_status,
        "Bookings".booking_code,
        "BookingDetails".document_url,
        "BookingDetails".price_per_seat
        FROM "Bookings" JOIN "BookingDetails" 
        ON "Bookings".id = "BookingDetails".booking_id 
        WHERE "Bookings".id = ${booking_id} 
      `;

      const bookingInfo = await db.sequelize.query(query, { type: QueryTypes.SELECT });

      const checkTransaction = await Transaction.findOne({ where: { booking_id: bookingInfo[0].booking_id }});

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

      return res.status(200).json({
        status: true,
        message: "Successfully Checkout Booking",
        data: {
          booking_id: bookingInfo[0].booking_id,
          transaction_id: transaction.id,
          document_url: bookingInfo[0].document_url,
          transaction_status: transaction.status,
          total_price: transaction.total_price,
        }
      });
    } catch(err) {
      next(err);
    }
  },
}
