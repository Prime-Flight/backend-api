require('dotenv').config();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { AbortError } = require('node-fetch');
const AbortController = globalThis.AbortController || require('abort-controller');
const controller = new AbortController();
const timeout = setTimeout(() => { controller.abort(); }, 200000); // timeout above 10000ms
const { FLIGHT_API_HOST, FLIGHT_API_KEY } = process.env;
module.exports = {
    getFlightData: async(req, res, next) => {
        try {
            // const user = req.user;
            const response = await fetch(`${FLIGHT_API_HOST}/advanced-real-time-flights?access_key=${FLIGHT_API_KEY}`, { 
                method: 'GET', signal: controller.signal 
            });
            let data = await response.json();
            return res.status(200).json({
                status: true,
                message: "Successfully Get Flight Schedule to Create",
                data: data
            });
        } catch(err) {
            if (typeof(err) == Object) { 
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
    delete: async(req, res, next) => {
        try {
        } catch(err) {
            next(err);
        }
    },
}
