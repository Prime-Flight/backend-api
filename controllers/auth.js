const { User } = require('../db/models')

module.exports = {
    register: async (req, res, next) => {
        try {
            const { name, email, password, gender, nationality } = req.body;
            const existUser = await User.findOne({ where: { email } });
            if (existUser) {
                return res.status(409).json({
                    status: false,
                    message: 'Failed Register With Your Email Because Email Already Used, Please Use Another Email.',
                    data: null
                });
            };
            if (name == "" || email == "" || password == "" || gender == "" || nationality == "" || !name || !email || !password || !gender || !nationality) {
                return res.status(400).json({
                    status: false,
                    message: "Failed Register With Email, missing detail information",
                    data: null
                });
            };
            const hashedPassword = await bcrypt.hash(password, 10);

            const addUser = await User.create({
                name,
                email,
                password: hashedPassword,
                url_profile_picture: null,
                gender,
                isGoogle: false,
                role: 2,
                nationality
            });

            return res.status(201).json({
                status: true,
                message: 'Successfully Registered With Email',
                data: addUser
            })

        } catch (err) {
            next(err);
        }
    },
    login: (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    },
    google: (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    },
    whoami: (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    },
    viewForgotPassword: (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    },
    forgotPassword: (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    },
    resetPassword: (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    },
    verifyUser: (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    }
}
