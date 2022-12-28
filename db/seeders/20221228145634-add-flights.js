'use strict';
require('dotenv').config();
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
const { Flight } = require('../models');
module.exports = {
  async up(queryInterface, Sequelize) {
    const flights = await Flight.findAll();
    const flightsLength = flights.length;
    await queryInterface.bulkInsert('Flights', [
      {
        id: flightsLength + 1,
        flight_code: 'DPSQGCKG01',
        departure_iata_code: "DPS",
        departure_icao_code: "WDDD",
        departure_time: "2022-12-12 00:12:00",
        arrival_iata_code: "CKG",
        arrival_icao_code: "WIII",
        arrival_time: "2022-10-12 01:12:00",
        createdAt: currentDate,
        updatedAt: currentDate,
        airline_id: 1,
        price: 1500000,
        seat_capacity: 100
      },
      {
        id: flightsLength + 2,
        flight_code: 'BDGSLDPS01',
        departure_iata_code: "BDG",
        departure_icao_code: "WIDD",
        departure_time: "2022-12-12 10:12:00",
        arrival_iata_code: "DPS",
        arrival_icao_code: "WDDD",
        arrival_time: "2022-11-12 12:11:00",
        createdAt: currentDate,
        updatedAt: currentDate,
        airline_id: 2,
        price: 1300000,
        seat_capacity: 150
      },
      {
        id: flightsLength + 3,
        flight_code: 'BDGGADPS01',
        departure_iata_code: "BDG",
        departure_icao_code: "WIDD",
        departure_time: "2022-12-12 10:10:00",
        arrival_iata_code: "DPS",
        arrival_icao_code: "WDDD",
        arrival_time: "2022-11-12 12:12:00",
        createdAt: currentDate,
        updatedAt: currentDate,
        airline_id: 3,
        price: 134200,
        seat_capacity: 90
      },
      {
        id: flightsLength + 4,
        flight_code: 'BDGGAKDPS01',
        departure_iata_code: "BDG",
        departure_icao_code: "WIDD",
        departure_time: "2022-12-12 10:40:00",
        arrival_iata_code: "DPS",
        arrival_icao_code: "WDDD",
        arrival_time: "2022-12-12 12:40:00",
        createdAt: currentDate,
        updatedAt: currentDate,
        airline_id: 4,
        price: 134200,
        seat_capacity: 90
      },
      {
        id: flightsLength + 5,
        flight_code: 'BDGGSJDPS01',
        departure_iata_code: "BDG",
        departure_icao_code: "WIDD",
        departure_time: "2022-12-12 11:40:00",
        arrival_iata_code: "DPS",
        arrival_icao_code: "WDDD",
        arrival_time: "2022-11-12 13:40:00",
        createdAt: currentDate,
        updatedAt: currentDate,
        airline_id: 5,
        price: 980000,
        seat_capacity: 230
      },
      {
        id: flightsLength + 6,
        flight_code: 'BDGGBADPS01',
        departure_iata_code: "BDG",
        departure_icao_code: "WIDD",
        departure_time: "2022-12-12 12:40:00",
        arrival_iata_code: "DPS",
        arrival_icao_code: "WDDD",
        arrival_time: "2022-11-12 14:40:00",
        createdAt: currentDate,
        updatedAt: currentDate,
        airline_id: 6,
        price: 920000,
        seat_capacity: 30
      },
      {
        id: flightsLength + 7,
        flight_code: 'BDGGBADPS01',
        departure_iata_code: "BDG",
        departure_icao_code: "WIDD",
        departure_time: "2022-12-12 13:50:00",
        arrival_iata_code: "DPS",
        arrival_icao_code: "WDDD",
        arrival_time: "2022-11-12 15:40:00",
        createdAt: currentDate,
        updatedAt: currentDate,
        airline_id: 2,
        price: 920000,
        seat_capacity: 30
      },
      {
        id: flightsLength + 8,
        flight_code: 'BDGGBADPS01',
        departure_iata_code: "BDG",
        departure_icao_code: "WIDD",
        departure_time: "2022-12-12 14:40:00",
        arrival_iata_code: "DPS",
        arrival_icao_code: "WDDD",
        arrival_time: "2022-11-12 16:40:00",
        createdAt: currentDate,
        updatedAt: currentDate,
        airline_id: 3,
        price: 920000,
        seat_capacity: 30
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Flights', null, {});
  }
};
