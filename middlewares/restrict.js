require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
    JWT_SIGNATURE_KEY
} = process.env
module.exports = {
    // middleware restrict is for checking the user logged in by passing the user bearer token from into the api   
    restrict: (req, res, next) => {
        try {
            const header = req.headers['authorization'];
            // check the header argument
            if(!header) {
                return res.status(401).json({
                    status: false,
                    message: 'You are not authorized!',
                    data: null
                });
            }
            // split the token from the `Bearer`
            const token = header.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: 'You are not authorized!',
                    data: null
                });
            }

            const payload = jwt.verify(token, JWT_SIGNATURE_KEY);
            req.user = payload;

            next();
        } catch(err) {
            if (err.message == 'jwt malformed') {
                return res.status(401).json({
                    status: false,
                    message: err.message,
                    data: null
                });
            }
            console.log(err);
            next(err);
        }
    }
}
