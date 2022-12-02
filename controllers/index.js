const auth = require('./auth');
const country = require('./country');
module.exports = { 
    hello: (req, res, next) => {
        try {
            return res.status(200).json({
                status: true,
                message: "Hello, this is the Prime Flight API",
                data: null
            })
        } catch(err) {
            next(err);
        }
    },
    
    auth, country
}
