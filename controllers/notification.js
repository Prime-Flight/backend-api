const notificationActions = require('../lib/notification-actions');
const { Notification, Booking, Transaction } = require('../db/models');
module.exports = {
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
  readNotification: async (req, res, next) => {
    try {
      const { id } = req.body;
      // update here
      await Notification.update({ read: true }, { where: { id: id }});
      // find the notification
      const notificationData = await Notification.findOne({ where: { id : id }});
      if (notificationData.length == 0) {
        return res.status(204).json({
          status: true,
          message: "No Data For Your Notification"
        });
      }

      return res.status(200).json({
        status: true,
        message: "Successfully Update Notification",
        data: notificationData
      });
    } catch (err) {
      next(err);
    }
  },
}

