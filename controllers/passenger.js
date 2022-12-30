const { User, Passenger, PassengerDetail } = require('../db/models');
const { QueryTypes } = require('sequelize');
const db = require('../db/models');
const notification = require('../utils/notification');

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
            
            const passengerExists = await PassengerDetail.findOne({
              where : { nik: nik }
            });
            console.log(`THE PASSENGER` + passengerExists);

            if(passengerExists) { 
              return res.status(403).json({ 
                    status: false,
                    message: `passenger with name ${passengerExists.name} and nik ${passengerExists.nik} is already registered`,
                    data: null
              });
            } else { 
              const passengerDetail = await PassengerDetail.create({
                  name,
                  nik,
                  passport_number,
                  gender
              });

              const passenger = await Passenger.create({
                  buyer_id: id,
                  passenger_category,
                  passenger_detail: passengerDetail.id
              });
              
              notification.passenger(user.id, passenger.id);

              return res.status(200).json({
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
            }


        } catch (err) {
            console.log(err); 
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
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.user;

            const user = await User.findOne({ where: { id: id } });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: `user with id ${id} is doesn't exist`,
                    data: null
                });
            }

            const { passenger_id, name, nik, passport_number, gender, passenger_category } = req.body;

            const passengerId = await Passenger.findOne({ where: { id: passenger_id } });

            if (!passengerId) {
                return res.status(404).json({
                    status: false,
                    message: `passenger with id ${passenger_id} is doesn't exist`,
                    data: null
                });
            }

            const passengerDetail = await PassengerDetail.update({
                name: name,
                nik: nik,
                passport_number: passport_number,
                gender:gender
            },
            {
                where: {id:passengerId.passenger_detail}
            });

            const passenger = await Passenger.update({
                passenger_category:passenger_category
            },
            {
                where: {id:passenger_id}
            });

            const passengerUpdateDetail = await PassengerDetail.findOne({ where: { id: passengerId.passenger_detail } });
            const passengerUpdate = await Passenger.findOne({ where: { id: passenger_id } });

            return res.status(200).json({
                status: true,
                message: "success",
                data: {
                    id: passengerUpdate.id,
                    buyer_id: passengerUpdate.buyer_id,
                    passengger_category: passengerUpdate.passenger_category,
                    name: passengerUpdateDetail.name,
                    nik: passengerUpdateDetail.nik,
                    passport_number: passengerUpdateDetail.passport_number,
                    gender: passengerUpdateDetail.gender 
                }
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.body;
            const passenger = await Passenger.findOne({ where: { id: id}});
            if (!passenger) {
                return res.status(404).json({
                    status: false,
                    message: `user with id ${id} is doesn't exist`,
                    data: null
                });
            }

            // raw query string
            const getPassengers = `
            DELETE FROM "PassengerDetails" WHERE "PassengerDetails".id = ${passenger.passenger_detail};
            DELETE FROM "Passengers" WHERE "Passengers".id = ${passenger.id};`

            // query the data using the raw query
            await db.sequelize.query(getPassengers, {
                type: QueryTypes.DELETE
            });
            return res.status(200).json({
                status: true,
                message: "Successfully Delete Passenger",
                data: {
                    id:id
                }
            });
            
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
};
