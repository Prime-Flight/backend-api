const notificationActions = require('../lib/notification-actions');
const { Notification, Booking, Transaction, Passenger } = require('../db/models');
const { QueryTypes } = require('sequelize');
const db = require('../db/models');
module.exports = {
  booking: async (id, booking_id) => {
    try {
      const booking = await Booking.findOne({where: {id: booking_id}});
      if (!booking) { 
        return res.status(400).json({
          status: false,
          message: "Cannot Create, There's no Booking with this booking code"
        });
      }

      const notification = await Notification.create({
        recipient_id: id,
        actions: notificationActions.booking,
        message: `You have book the flight of ${booking.booking_code}`,
        read: false
      });

      // send the notification into client
      global.io.emit(`${notificationActions.booking}-${id}`, notification);

    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  transfer: async (id, booking_id, next) => {
    try {

      const transfer = await Transaction.findOne({where: {booking_id: booking_id}});
      if (!transfer) { 
        return res.status(400).json({
          status: false,
          message: "Cannot Create, There's no Booking with this transfer code"
        });
      }

      const booking = await Booking.findOne({where: {id: booking_id}});

      const notification = await Notification.create({
        recipient_id: id,
        actions: notificationActions.transfer,
        message: `You have paid the flight of ${booking.booking_code}`,
        read: false
      });

      // send the notification into client
      global.io.emit(`${notificationActions.transfer}-${id}`, notification);
    } catch (err) {
      next(err);
    }
  },
  passenger: async (id, passenger_id) => {
    try {
      const getPassengers = `
          SELECT
              "Passengers".id,
              "Passengers".buyer_id,
              "Passengers".passenger_category, 
              "PassengerDetails".name, 
              "PassengerDetails".nik, 
              "PassengerDetails".passport_number,
              "PassengerDetails".gender
          FROM
              "Passengers"
              JOIN "PassengerDetails" ON "Passengers".passenger_detail = "PassengerDetails".id
              WHERE "Passengers".id = ${passenger_id}
      `

      // query the data using the raw query
      const passenger = await db.sequelize.query(getPassengers, {
          type: QueryTypes.SELECT
      });

      console.log(passenger);

      if (!passenger) { 
        return res.status(400).json({
          status: false,
          message: "Cannot Create, There's no Passenger with this id"
        });
      }

      const notification = await Notification.create({
        recipient_id: id,
        actions: notificationActions.passenger,
        message: `You have added ${passenger[0].name} to your list of passenger`,
        read: false
      });

      // send the notification into client
      global.io.emit(`${notificationActions.passenger}-${id}`, notification);

    } catch (err) {
      console.log(err);
      next(err);
    }
  },
}

