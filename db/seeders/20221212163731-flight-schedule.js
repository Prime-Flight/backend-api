'use strict';
require('dotenv').config();
const { IMAGE_KIT_URL_ENDPOINT } = process.env;
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
const { Flight, Airline } = require('../models');
module.exports = {
    async up(queryInterface, Sequelize) {
        const airlines = await Airline.findAll(); 
        const airlinesLength = airlines.length; 
        await queryInterface.bulkInsert('Airlines', [
            {
                id: airlinesLength + 1,
                airline: "Citilink",
                airline_code: "QG",
                airline_logo: `${IMAGE_KIT_URL_ENDPOINT}/Prime_Flight_Airlines/citilink.png`,
                createdAt: currentDate,
                updatedAt: currentDate,
            },
            {
                id: airlinesLength + 2,
                airline: "Lion Air",
                airline_code: "SL",
                airline_logo: `${IMAGE_KIT_URL_ENDPOINT}/Prime_Flight_Airlines/lion_air.png`,
                createdAt: currentDate,
                updatedAt: currentDate,
            },
            {
                id: airlinesLength + 3,
                airline: "Garuda Indonesia",
                airline_code: "GA",
                airline_logo: `${IMAGE_KIT_URL_ENDPOINT}/Prime_Flight_Airlines/garuda_indonesia.png`,
                createdAt: currentDate,
                updatedAt: currentDate,
            },
            {
                id: airlinesLength + 4,
                airline: "Air Asia",
                airline_code: "AK",
                airline_logo: `${IMAGE_KIT_URL_ENDPOINT}/Prime_Flight_Airlines/air_asia.png`,
                createdAt: currentDate,
                updatedAt: currentDate,
            },
            {
                id: airlinesLength + 5,
                airline: "Sriwijaya Air",
                airline_code: "SJ",
                airline_logo: `${IMAGE_KIT_URL_ENDPOINT}/Prime_Flight_Airlines/sriwijaya_air_logo.png`,
                createdAt: currentDate,
                updatedAt: currentDate,
            },
            {
                id: airlinesLength + 6,
                airline: "Batik Air",
                airline_code: "BA",
                airline_logo: `${IMAGE_KIT_URL_ENDPOINT}/Prime_Flight_Airlines/batik_air.png`,
                createdAt: currentDate,
                updatedAt: currentDate,
            }
        ]); 


        const flights = await Flight.findAll(); 
        const flightsLength = flights.length; 
        await queryInterface.bulkInsert('Flights', [
            {
                id: flightsLength + 1,
                flight_code: 'DPSQGCKG01',
                departure_iata_code: "DPS",
                departure_icao_code: "WDDD",
                departure_time: "2022-10-12 00:12:00",
                arrival_iata_code: "CKG",
                arrival_icao_code: "WIII",
                arrival_time: "2022-10-12 01:12:00",
                createdAt: currentDate,
                updatedAt: currentDate,
                airline_id: airlinesLength + 1,
                price: 1500000,
                seat_capacity: 100
            },
            {
                id: flightsLength + 2,
                flight_code: 'BDGSLDPS01',
                departure_iata_code: "BDG",
                departure_icao_code: "WIDD",
                departure_time: "2022-11-12 10:12:00",
                arrival_iata_code: "DPS",
                arrival_icao_code: "WDDD",
                arrival_time: "2022-11-12 12:12:00",
                createdAt: currentDate,
                updatedAt: currentDate,
                airline_id: airlinesLength + 2,
                price: 1300000,
                seat_capacity: 150
            },
            {
                id: flightsLength + 3,
                flight_code: 'BDGGADPS01',
                departure_iata_code: "BDG",
                departure_icao_code: "WIDD",
                departure_time: "2022-11-12 10:10:00",
                arrival_iata_code: "DPS",
                arrival_icao_code: "WDDD",
                arrival_time: "2022-11-12 12:12:00",
                createdAt: currentDate,
                updatedAt: currentDate,
                airline_id: airlinesLength + 3,
                price: 134200,
                seat_capacity: 90
            },
            {
                id: flightsLength + 4,
                flight_code: 'BDGGAKDPS01',
                departure_iata_code: "BDG",
                departure_icao_code: "WIDD",
                departure_time: "2022-11-12 10:40:00",
                arrival_iata_code: "DPS",
                arrival_icao_code: "WDDD",
                arrival_time: "2022-11-12 12:40:00",
                createdAt: currentDate,
                updatedAt: currentDate,
                airline_id: airlinesLength + 4,
                price: 134200,
                seat_capacity: 90
            },
            {
                id: flightsLength + 5,
                flight_code: 'BDGGSJDPS01',
                departure_iata_code: "BDG",
                departure_icao_code: "WIDD",
                departure_time: "2022-11-12 11:40:00",
                arrival_iata_code: "DPS",
                arrival_icao_code: "WDDD",
                arrival_time: "2022-11-12 13:40:00",
                createdAt: currentDate,
                updatedAt: currentDate,
                airline_id: airlinesLength + 5,
                price: 980000,
                seat_capacity: 230 
            },
            {
                id: flightsLength + 6,
                flight_code: 'BDGGBADPS01',
                departure_iata_code: "BDG",
                departure_icao_code: "WIDD",
                departure_time: "2022-11-12 16:40:00",
                arrival_iata_code: "DPS",
                arrival_icao_code: "WDDD",
                arrival_time: "2022-11-12 16:40:00",
                createdAt: currentDate,
                updatedAt: currentDate,
                airline_id: airlinesLength + 6,
                price: 920000,
                seat_capacity: 30 
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Airlines', null, {});
        await queryInterface.bulkDelete('Flights', null, {});
    }
};
