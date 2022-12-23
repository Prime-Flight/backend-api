const notificationActions = require('../lib/notification-actions');
const { Notification, Booking, Transaction } = require('../db/models');

module.exports = {
  booking: async (req, res, next) => {
    try {
      const { id } = req.user
      const { booking_id } = req.body;

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

      return res.status(200).json({
        status: true,
        message: "Successfully Create the Notification for Booking",
        data: {
          recipient_id: notification.recipient_id,
          actions: notification.actions,
          message: notification.message,
          read: notification.read
        }
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  transfer: async (req, res, next) => {
    try {
      const { id } = req.user
      const { booking_id } = req.body;

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

      return res.status(200).json({
        status: true,
        message: "Successfully Create the Notification for Transfer",
        data: {
          recipient_id: notification.recipient_id,
          actions: notification.actions,
          message: notification.message,
          read: notification.read
        }
      });
    } catch (err) {
      next(err);
    }
  },
  getAllUserNotification: async (req, res, next) => {
    try {
      const { id } = req.user
      const notificationData = await Notification.findAll({ where: { recipient_id: id } });
      if (notificationData.length == 0) {
        return res.status(204).json({
          status: true,
          message: "No Data For Your Notification"
        });
      }

      return res.status(200).json({
        status: true,
        message: "Successfully Get Notification",
        data: notificationData
      });
    } catch (err) {
      next(err);
    }
  },
}

