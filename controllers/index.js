const auth = require('./auth');
const country = require('./country');
const airport = require('./airport');
const flight = require('./flight');
const booking = require('./booking');
const userBooking = require('./user-booking');
const userProfile = require('./user-profile');
const notification = require('./notification');
const passenger = require('./passenger')
module.exports = {
    hello: (req, res, next) => {
        try {
            return res.status(200).json({
                status: true,
                message: "Hello, this is the Prime Flight API",
                data: null
            })
        } catch (err) {
            next(err);
        }
    },

    auth, country, airport, flight, booking, userBooking, userProfile, notification, passenger
}
