'use strict';
require('dotenv').config();
const { ADMIN_PASSWORD } = process.env;
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Roles', [
            {
                id: 1,
                name: 'Admin',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 2,
                name: 'Buyer',
                createdAt: currentDate,
                updatedAt: currentDate
            },
        ]);

        await queryInterface.bulkInsert('Modules', [
            {
                id: 1,
                name: 'Admin Dashboard',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 2,
                name: 'User Dashboard',
                createdAt: currentDate,
                updatedAt: currentDate
            },
        ]);

        await queryInterface.bulkInsert('Accesses', [
            {
                id: 1,
                role_id: 1,
                module_id: 1,
                read: true,
                write: true,
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 2,
                role_id: 2,
                module_id: 1,
                read: false,
                write: false,
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 3,
                role_id: 1,
                module_id: 2,
                read: true,
                write: true,
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 4,
                role_id: 2,
                module_id: 2,
                read: true,
                write: true,
                createdAt: currentDate,
                updatedAt: currentDate
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Roles', null, {})
        await queryInterface.bulkDelete('Modules', null, {})
        await queryInterface.bulkDelete('Accesses', null, {})
    }
};
