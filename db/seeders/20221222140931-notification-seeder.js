'use strict';
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
const { Notification } = require('../models');
module.exports = {
  async up(queryInterface, Sequelize) {
    const notification = await Notification.findAll();
    const notificationLength = notification.length;
    await queryInterface.bulkInsert('Notifications', [{
      id: notificationLength + 1,
      recipient_id: 1,
      actions: "BOOKING",
      message: "You Have been successfully booking please check the booking in here [url]",
      read: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    }, {
      id: notificationLength + 2,
      recipient_id: 2,
      actions: "TRANSFER",
      message: "You Have been checkout booking please check the your email [url]",
      read: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    }, {
      id: notificationLength + 3,
      recipient_id: 3,
      actions: "TICKET",
      message: "Your ticket has been created please check the your email [url]",
      read: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    },], {});
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Notifications', null, {});
  }
};
