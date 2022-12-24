const { User, Passenger, PassengerDetail } = require('../db/models');
const { QueryTypes } = require('sequelize');
const db = require('../db/models');

module.exports = {
    save: async (req, res, next) => {
        try {
            const { name, nik, passport_number, gender, passenger_category } = req.body;
            const { id } = req.user;

            const user = await User.findOne({ where: { id: id } });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: `user with id ${id} is doesn't exist`,
                    data: null
                });
            }

            const passengerDetail = await PassengerDetail.create({
                name,
                nik,
                passport_number,
                gender
            });

            const passenger = await Passenger.create({
                buyer_id: user.id,
                passenger_category,
                passenger_detail: passengerDetail.id
            });

            return res.status(201).json({
                status: true,
                message: "success",
                data: {
                    id: passenger.id,
                    buyer_id: passenger.buyer_id,
                    passengger_category: passengerDetail.passenger_category,
                    name: passengerDetail.name,
                    nik: passengerDetail.nik,
                    passport_number: passengerDetail.passport_number,
                    gender: passengerDetail.gender 
                }
            });

        } catch (err) {
            next(err);
        }
    },
    get: async (req, res, next) => {
        try {
            const { id } = req.user;

            // raw query string
            const getPassengers = `
                SELECT
                    "Passengers".id,
                    "Passengers".buyer_id,
                    "Passengers".passenger_category, 
                    "PassengerDetails".name, 
                    "PassengerDetails".nik, 
                    "PassengerDetails".passport_number,
                    "PassengerDetails".gender
                FROM
                    "Passengers"
                    JOIN "PassengerDetails" ON "Passengers".passenger_detail = "PassengerDetails".id
                    WHERE "Passengers".buyer_id = ${id}`

            // query the data using the raw query
            var Passenger = await db.sequelize.query(getPassengers, {
                type: QueryTypes.SELECT
            });

            return res.status(200).json({
                status: true,
                message: "Successfully Get All Passenger",
                data: Passenger
            });
            
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
};