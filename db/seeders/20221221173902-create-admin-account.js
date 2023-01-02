'use strict';
require('dotenv').config();
const moment = require('moment');
const bcrypt = require('bcrypt');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
const password = process.env.ADMIN_PASSWORD;
const { User } = require('../models');
module.exports = {
  async up (queryInterface, Sequelize) {
     const user = await User.findAll();
     const userLength = user.length;
     const hashedPassword = await bcrypt.hash(password, 10);
     await queryInterface.bulkInsert('Users', [{
        id: userLength + 1,
        name: "secretadmin",
        email: "supersecretadmin@primeflight.com",
        password: hashedPassword,
        gender: "Male",
        nationality: "Indonesian",
        role: 1,
        is_google: false,
        is_verified: true,
        createdAt: currentDate,
        updatedAt: currentDate,
     }, {
        id: userLength + 2,
        name: "testinguser",
        email: "testinguser@primeflight.com",
        password: hashedPassword,
        gender: "Female",
        nationality: "Indonesian",
        role: 2,
        is_google: false,
        is_verified: true,
        createdAt: currentDate,
        updatedAt: currentDate,
     }
    ], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});
  }
};
