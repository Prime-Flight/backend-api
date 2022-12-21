require('dotenv').config();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { AbortError } = require('node-fetch');
const AbortController = globalThis.AbortController || require('abort-controller');
const controller = new AbortController();
const timeout = setTimeout(() => { controller.abort(); }, 200000); // timeout above 10000ms
const { FLIGHT_API_HOST, FLIGHT_API_KEY, HOST } = process.env;
const { Flight, Airline } = require('../db/models');
const { QueryTypes } = require('sequelize');
const db = require('../db/models');
const Validator = require('fastest-validator');
const validator = new Validator;
module.exports = {
    getAirportData: async (req, res, next) => {
        try {
            const { searchValue } = req.body
            const response = await fetch(`${HOST}/api/airport/search/${searchValue}`, {
                method: 'GET', signal: controller.signal
            });

            let data = await response.json();

            // check the response data 
            if (data.status == false) {
                return res.status(404).json({
                    status: false,
                    error: data.message,
                    data: null
                });
            }

            return res.status(200).json({
                status: true,
                message: "Successfully Get Airport Data",
                data: data
            });
        } catch (err) {
            if (typeof (err) == Object) {
                if (err instanceof AbortError) {
                    return res.status(500).json({
                        status: false,
                        message: "request was aborted",
                        data: null
                    });
                }
            }
            next(err);
        } finally {
            clearTimeout(timeout)
        }
    },
    // use for the api endpoint for user getting the flight according to the request.
    getFlightAPI: async (req, res, next) => {
        try {
            const response = await fetch(`${FLIGHT_API_HOST}/advanced-real-time-flights?access_key=${FLIGHT_API_KEY}&&limit=100`, {
                method: 'GET', signal: controller.signal
            });

            let data = await response.json();

            // check the response data 
            if (data.data.success == false) {
                return res.status(404).json({
                    status: false,
                    error: data.data.error,
                    data: null
                });
            }
            return res.status(200).json({
                status: true,
                message: "Successfully Get Flight Schedule to Create",
                data: data
            });
        } catch (err) {
            if (typeof (err) == Object) {
                if (err instanceof AbortError) {
                    return res.status(500).json({
                        status: false,
                        message: "request was aborted",
                        data: null
                    });
                }
            }
            next(err);
        } finally {
            clearTimeout(timeout)
        }
    },

    getAllFlightDatabase: async (req, res, next) => {
        try {
            const flightInfo =  `
                    SELECT
                    "Flights".id AS flight_id,
                    "Flights".flight_code,
                    "Flights".departure_iata_code,
                    "Flights".departure_time,
                    "Flights".arrival_iata_code,
                    "Flights".arrival_time,
                    "Airlines".airline,
                    "Airlines".airline_code,
                    "Airlines".airline_logo,
                    "Flights".seat_capacity,
                    "Flights".price
                    FROM "Flights" JOIN "Airlines"
                    ON "Flights".airline_id = "Airlines".id
                  `
            const flight = await db.sequelize.query(flightInfo, {
                type: QueryTypes.SELECT
            });
    
            return res.status(200).json({
                status: true,
                message: "Successfully get all flight data",
                data: flight
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    create: async (req, res, next) => {
        try {
            const { flight_code, departure_iata_code, departure_icao_code, departure_time, arrival_iata_code, arrival_icao_code, arrival_time } = req.body;

            const checkFlight = await Flight.findOne({ where: { flight_code: flight_code } });

            // if there's the flight then return bad request response 
            if (checkFlight) {
                return res.status(403).json({
                    status: false,
                    message: `Flight already created with the code of ${flight_code}, Please Create with another code `,
                    data: null
                });
            }

            const schema = {
                flight_code: 'string',
                departure_iata_code: 'string',
                departure_icao_code: 'string',
                departure_time: 'string',
                arrival_iata_code: 'string',
                arrival_icao_code: 'string',
                arrival_time: 'string',
            }

            const validate = validator.validate(req.body, schema);

            if (validate.length) {
                let err = "";
                validate.forEach(element => {
                    err = err + element.message
                });
                return res.status(400).json({
                    status: false,
                    message: `Cannot Create the Flight Schedule -> ${err}`
                });
            }

            const create_flight = await Flight.create({
                flight_code,
                departure_iata_code,
                departure_icao_code,
                departure_time,
                arrival_iata_code,
                arrival_icao_code,
                arrival_time
            });

            return res.status(200).json({
                status: true,
                message: "Successfully Create Flight Schedule to Order",
                data: create_flight
            });

        } catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const { flight_code, flight_id } = req.body;

            const checkFlight = await Flight.findOne({ flight_code: flight_code }, { where: { id: flight_id } });

            // if there's no flight then return bad request response 
            if (checkFlight === null) {
                return res.status(403).json({
                    status: false,
                    message: `Flight cannot be update there's no flight with id of ${id}`,
                    data: null
                });
            }

            // update
            const updateFlight = await Flight.findOne({ flight_code: flight_code }, { where: { id: flight_id } });

            return res.status(200).json({
                status: true,
                message: "Successfully Update Flight Schedule to Order",
                data: updateFlight
            });
        } catch (err) {
            next(err);
        }
    },
    delete: async (req, res, next) => {
        try {
            const { flight_id } = req.body;

            const checkFlight = await Flight.findOne({ where: { id: flight_id } });

            // if there's no flight then return bad request response 
            if (checkFlight === null) {
                return res.status(403).json({
                    status: false,
                    message: `Flight Cannot be Deleted there's no flight with id of  ${id}`,
                    data: null
                });
            }

            // delete
            await Flight.destroy({ where: { id: flight_id } });

            return res.status(200).json({
                status: true,
                message: "Successfully Delete Flight Schedule to Order",
                data: {
                    id: flight_id
                }
            });
        } catch (err) {
            next(err);
        }
    },
}
