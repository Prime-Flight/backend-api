'use strict';
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Bookings', [{
            id: 1,
            destination: 1,
            user: 1,
            seat: 3,
            status: "Pending",
            booking_code: "DPSCTNLKCKG01",
            createdAt: currentDate,
            updatedAt: currentDate,
        }, {
            id: 2,
            destination: 1,
            user: 2,
            seat: 2,
            status: "Pending",
            booking_code: "DPSCTNLKCKG02",
            createdAt: currentDate,
            updatedAt: currentDate,
            }
        ], {});

        await queryInterface.bulkInsert('BookingDetails', [{
            id: 1,
            booking_id: 1,
            document_url: "https://image.com/j/231231",
            price_per_seat: 1700000,
            createdAt: currentDate,
            updatedAt: currentDate,
        }, {
            id: 2,
            booking_id: 2,
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
