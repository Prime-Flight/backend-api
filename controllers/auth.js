const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const Validator = require('fastest-validator');
const v = new Validator;
const jwt = require('jsonwebtoken')
const lib = require('../lib')
const { JWT_SIGNATURE_KEY } = process.env;

module.exports = {
    register: async (req, res, next) => {
        try {
            const { name, email, password, gender, nationality } = req.body;

            const schema = {
                name: 'string',
                email: 'email',
                password: 'string',
                gender: { type: "enum", values: ["Male", "Female"] },
                nationality: 'string'
            }

            const validate = v.validate(req.body, schema)
            if (validate.length) {
                let err = "";
                validate.forEach(e => {
                    err = err + e.message + " "
                });
                console.log(err)
                return res.status(400).json({
                    status: false,
                    message: `Failed Register With Email, ${err}`,
                    data: null
                });
            }

            const existUser = await User.findOne({ where: { email } });
            if (existUser) {
                return res.status(409).json({
                    status: false,
                    message: 'Failed Register With Your Email Because Email Already Used, Please Use Another Email.',
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
                data: {
                    id: addUser.id,
                    name: addUser.name,
                    email: addUser.email,
                    url_profile_picture: addUser.url_profile_picture,
                    gender: addUser.gender,
                    isGoogle: addUser.isGoogle,
                    role: addUser.role,
                    nationality: addUser.nationality
                }
            })

        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'email or password doesn\'t match!'
                });
            }

            const correct = await bcrypt.compare(password, user.password);
            if (!correct) {
                return res.status(400).json({
                    status: false,
                    message: 'email or password doesn\'t match!'
                });
            }

            // generate token
            payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };
            const token = jwt.sign(payload, JWT_SIGNATURE_KEY);

            return res.status(200).json({
                status: false,
                message: 'Successfully Login',
                data: {
                    email: user.email,
                    token: token
                }
            });
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
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;

            const existUser = await User.findOne({ where: { email } })
            if (existUser) {
                const payload = { user_id: existUser.id }
                const token = jwt.sign(payload, JWT_SIGNATURE_KEY)
                const link = `http://localhost:3213/auth/reset-password?token=${token}`

                emailTemplate = await lib.email.getHtml('reset-password.ejs', { name: existUser.name, link: link })

                await lib.email.sendEmail(email, 'Reset Password', emailTemplate)

                res.status(200).json({
                    status: true,
                    message: 'email sent successfully'
                })
            }
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
