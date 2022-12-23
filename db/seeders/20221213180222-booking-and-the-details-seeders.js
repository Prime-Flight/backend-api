'use strict';
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
const { Booking, BookingDetail } = require('../models');
module.exports = {
    async up(queryInterface, Sequelize) {
        const bookings = await Booking.findAll();  
        const bookingsLength = bookings.length;
        await queryInterface.bulkInsert('Bookings', [{
            id: bookingsLength + 1,
            destination: 1,
            user: 1,
            seat: 3,
            status: "Pending",
            booking_code: "DPSCTNLKCKG01",
            createdAt: currentDate,
            updatedAt: currentDate,
        }, {
            id: bookingsLength + 2,
            destination: 1,
            user: 2,
            seat: 2,
            status: "Pending",
            booking_code: "DPSCTNLKCKG02",
            createdAt: currentDate,
            updatedAt: currentDate,
            }
        ], {});

        const bookingDetails = await BookingDetail.findAll();  
        const bookingDetailsLength = bookingDetails.length;

        await queryInterface.bulkInsert('BookingDetails', [{
            id: bookingDetailsLength + 1,
            booking_id: bookingsLength + 1,
            document_url: "https://image.com/j/231231",
            price_per_seat: 1700000,
            createdAt: currentDate,
            updatedAt: currentDate,
        }, {
            id: bookingDetailsLength + 2,
            booking_id: bookingsLength + 2,
            document_url: "https://image.com/j/331123",
            price_per_seat: 1840000,
            createdAt: currentDate,
            updatedAt: currentDate,
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Bookings', null, {});
        await queryInterface.bulkDelete('BookingDetails', null, {});
    }
};
