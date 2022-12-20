'use strict';
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Airlines', [
            {
                id: 1,
                airline: "Citilink",
                airline_code: "CTLNK",
                airline_logo: "http://2.bp.blogspot.com/-i-D40gBOdt8/VC0p4CqbEQI/AAAAAAAAFMM/aX7TYbmWhFk/s1600/Logo%2BCitilink.png",
                createdAt: currentDate,
                updatedAt: currentDate,
            },
            {
                id: 2,
                airline: "Lion Air",
                airline_code: "LIONAIR",
                airline_logo: "http://logos-download.com/wp-content/uploads/2016/05/Lion_Air_logo.png",
                createdAt: currentDate,
                updatedAt: currentDate,
            }
        ]); 

        await queryInterface.bulkInsert('Flights', [
            {
                id: 1,
                flight_code: 'DPSCTNLKCKG01',
                departure_iata_code: "DPS",
                departure_icao_code: "WDDD",
                departure_time: "2022-10-12 00:12:00",
                arrival_iata_code: "CKG",
                arrival_icao_code: "WIII",
                arrival_time: "2022-10-12 01:12:00",
                createdAt: currentDate,
                updatedAt: currentDate,
                airline_id: 1,
                price: 1500000
            },
            {
                id: 2,
                flight_code: 'BDGLIONAIRDPS01',
                departure_iata_code: "BDG",
                departure_icao_code: "WIDD",
                departure_time: "2022-11-12 10:12:00",
                arrival_iata_code: "DPS",
                arrival_icao_code: "WDDD",
                arrival_time: "2022-11-12 12:12:00",
                createdAt: currentDate,
                updatedAt: currentDate,
                airline_id: 2,
                price: 1300000
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Airlines', null, {});
        await queryInterface.bulkDelete('Flights', null, {});
    }
};
