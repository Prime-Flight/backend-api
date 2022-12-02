const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const Validator = require('fastest-validator');
const v = new Validator;
const jwt = require('jsonwebtoken')
const lib = require('../lib')
const { JWT_SIGNATURE_KEY, HOST } = process.env;
const googleOauth2 = require('../utils/google');
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

            //untuk testing. Menghapus user jika sudah pernah mendaftar
            await User.destroy({
                where: {
                    email
                }
            })

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
                nationality,
                is_verified: false
            });
            const verifyToken = jwt.sign({ email }, JWT_SIGNATURE_KEY, { expiresIn: "6h" })

            const link = `${localhost}/auth/verify-user?token=${verifyToken}`

            const sendEmail = lib.email.sendEmail(email, 'Verify your email', `<p>Untuk memverifikasi anda bisa klik <a href=${link}>disini</a></p>`)

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
            // next(err);
            console.log(err);
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
            // next(err);
            console.log(err);
        }
    },
    google: async (req, res, next) => {
        try {
            const code = req.query.code;
            if (!code) {
                const url = googleOauth2.generateAuthURL();

                return res.redirect(url);
            }

            // get token
            await googleOauth2.setCredentials(code);

            // get data user
            const { data } = await googleOauth2.getUserData();

            // check apakah user email ada di database
            const userExist = await User.findOne({ where: { email: data.email } });

            // if !ada -> simpan data user
            if (!userExist) {
                return res.status(400).json({
                    status: false,
                    message: 'You have registered with your email, Please login with your email instead'
                });
            }

            // generate token
            payload = {
                id: data.id,
                name: data.name,
                email: data.email,
            };
            const token = jwt.sign(payload, JWT_SIGNATURE_KEY);

            return res.status(200).json({
                status: true,
                message: 'Successfully Login with Google',
                data: {
                    user_id: data.id,
                    email: data.email,
                    token: token
                }
            });
        } catch (err) {
            // next(err);
            console.log(err);
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
                const link = `${localhost}/auth/reset-password?token=${token}`
                emailTemplate = await lib.email.getHtml('reset-password.ejs', { name: existUser.name, link: link })

                await lib.email.sendEmail(email, 'Reset Password', emailTemplate)

                res.status(200).json({
                    status: true,
                    message: 'email sent successfully'
                })
            }
        } catch (err) {
            // next(err);
            console.log(err);
        }
    },
    resetPassword: (req, res, next) => {
        try {
        } catch (err) {
            next(err);
        }
    },
    sendVerifyEmail: async (req, res, next) => {
        try {
            const { email } = req.user;

            const payload = {
                email
            }
            const verifyToken = jwt.sign(payload, JWT_SIGNATURE_KEY, { expiresIn: "6h" })

            let link = `${HOST}/auth/verify-user?token=${verifyToken}`

            const sendEmail = lib.email.sendEmail(email, 'Verify your email', `<p>Untuk memverifikasi anda bisa klik <a href=${link}>disini</a></p>`)

            if (sendEmail) {
                res.status(200).json({
                    status: 'PENDING',
                    message: 'Verification Email is being sent'
                })
            }


        } catch (err) {
            // next(err);
            console.log(err);
        }
    },

    verifyUser: async (req, res, next) => {
        try {
            const { token } = req.query;
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: 'You are not authorized!',
                    data: null
                });
            }
            const decoded = jwt.verify(token, JWT_SIGNATURE_KEY)
            const existUser = await User.findOne({ where: { email: decoded.email } })
            if (!existUser) {
                return res.status(404).json({
                    status: false,
                    message: `Cannot Verify Because the User's email is unavailable`
                })
            }
            if (existUser.is_verified == true) {
                return res.status(400).json({
                    status: false,
                    message: 'You have been verified'
                })
            }
            const verify = await User.update({ is_verified: true }, {
                where: {
                    email: decoded.email
                }
            })
            return res.status(200).json({
                status: true,
                message: 'Your email is verified'
            })
        } catch (err) {
            if (err.message == 'jwt expired') {
                return res.status(406).json({
                    status: false,
                    message: 'Your verification link is expired. Please click the resend email verification button on your profile page'
                })
            }
            // next(err);
            console.log(err);
        }

    }
}
