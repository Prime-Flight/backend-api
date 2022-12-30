const notificationActions = require('../lib/notification-actions');
const { Notification, Booking, Transaction, User } = require('../db/models');
const { QueryTypes } = require('sequelize');
const db = require('../db/models');
module.exports = {
  booking: async (user_id, booking_id) => {
    return new Promise(async(resolve, reject) => { 
      try {
        const booking = await Booking.findOne({ where: { id: booking_id } });
        if (!booking) {
          return reject("There's no booking ID") 
        }

        const notification = await Notification.create({
          recipient_id: user_id,
          actions: notificationActions.booking,
          message: `You have book the flight of ${booking.booking_code}`,
          read: false
        });

        // send the notification into client
        global.io.emit(`${notificationActions.booking}-${user_id}`, notification);

        resolve(notification.message);
      } catch (err) {
        return reject(err);
      }
    })
  },
  transfer: async (user_id, booking_id) => {
    return new Promise(async(resolve, reject) => { 
      try {
        const transfer = await Transaction.findOne({ where: { booking_id: booking_id } });
        if (!transfer) {
          return reject("Cannot Create, There's no Booking with this transfer code")
        }

        const booking = await Booking.findOne({ where: { id: booking_id } });

        const notification = await Notification.create({
          recipient_id: user_id,
          actions: notificationActions.transfer,
          message: `You have paid the flight of ${booking.booking_code}`,
          read: false
        });

        // send the notification into client
        global.io.emit(`${notificationActions.transfer}-${user_id}`, notification);
      } catch (err) {
        return reject(err);
      }
    });
  },
  passenger: async (user_id, passenger_id) => {
    return new Promise(async(resolve, reject) => { 
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
          return reject("Cannot Create, There's no Passenger with this id") 
        }

        const notification = await Notification.create({
          recipient_id: user_id,
          actions: notificationActions.passenger,
          message: `You have added ${passenger[0].name} to your list of passenger`,
          read: false
        });

        // send the notification into client
        global.io.emit(`${notificationActions.passenger}-${user_id}`, notification);

      } catch (err) {
        return reject(err);
      }
    });
  },
  user_cancel: async (user_id, booking_id) => {
    return new Promise(async(resolve, reject) => { 
      try {
        const user = await User.findOne({ where: { id: user_id } });
        const booking = await Booking.findOne({ where: { id: booking_id } })

        if (!user) {
          return reject("There's no passenger with this id") 
        }

        const notification = await Notification.create({
          recipient_id: user.id,
          actions: notificationActions.user_cancel,
          message: `A user with id ${user.id} has been cancelling the flight with the reason of ${booking.cancel_reason}`,
          read: false
        });

        const admin = await User.findOne({ where: { role: 1 } });

        // send the notification into admin client
        global.io.emit(`${notificationActions.user_cancel}-${admin.id}`, notification);

      } catch (err) {
        return reject(err);
      }
    })
  },

  verify_email: async (user_id) => {
    return new Promise(async(resolve, reject) => { 
      try {
        const user = await User.findOne({ where: { id: user_id } })
        if (!user) {
          return reject('user is not found'); 
        }

        if (user) {
          const notif = await Notification.create({
            recipient_id: user.id,
            actions: notificationActions.verify_email,
            message: `We have sent a verification email to your email. Please verify that the email you used to register is your correct email`,
            read: false
          })
          global.io.emit(`${notificationActions.verify_email}-${user_id}`, notif)
        }
      } catch (err) {
        return reject(err)
      }
    });
  }
}

