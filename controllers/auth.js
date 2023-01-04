const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const Validator = require('fastest-validator');
const v = new Validator;
const jwt = require('jsonwebtoken')
const lib = require('../lib')
const { JWT_SIGNATURE_KEY, HOST, COUNTRY_API, STAGING_HOST } = process.env;
const googleOauth2 = require('../utils/google');
const fetch = require('node-fetch')
const { AbortError } = require('node-fetch');
const AbortController = globalThis.AbortController || require('abort-controller');
const controller = new AbortController();
const timeout = setTimeout(() => { controller.abort(); }, 10000); // timeout above 10000ms
const notification = require('../utils/notification')

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
                nationality,
                is_verified: false
            });
            const verifyToken = jwt.sign({ email }, JWT_SIGNATURE_KEY, { expiresIn: "6h" })

            const link = `${STAGING_HOST}/auth/verify-user?token=${verifyToken}`
            emailTemplate = await lib.email.getHtml('verification-email.ejs', { link: link })
            const sendEmail = lib.email.sendEmail(email, 'Verify your email', emailTemplate)

            notification.verify_email(addUser.id)
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
            console.log(err)
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
    google: async (req, res, next) => {
        try {
            // frontend flow we must accept the access_token from front end;
            const { access_token } = req.body;
            const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
            const options = {
                method: "GET",
                headers: {
                    "X-RapidAPI-Host": "www.googleapis.com",
                },
            }

            // fetch the url
            const response = await fetch(url, options);
            let data = await response.json()

            // get the email form the access response.
            const { email, name } = data;

            // check apakah user email ada di database
            let userExist = await User.findOne({ where: { email: email } });

            // if !ada -> simpan data user
            if (!userExist) {
                userExist = await User.create({
                    name: name,
                    email: email,
                    is_google: true,
                    role: 2,
                    is_verified: true
                });
                payload = {
                    id: userExist.id,
                    name: userExist.name,
                    email: userExist.email,
                };
            } else {
                // generate token
                payload = {
                    id: userExist.id,
                    name: userExist.name,
                    email: userExist.email,
                    role: userExist.role
                };

                const token = jwt.sign(payload, JWT_SIGNATURE_KEY);

                return res.status(200).json({
                    status: true,
                    message: 'Successfully Login with Google',
                    data: {
                        user_id: userExist.id,
                        email: userExist.email,
                        token: token,
                        role: userExist.role
                    }
                });
            }
        } catch (err) {
            next(err);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;

            const existUser = await User.findOne({ where: { email } })
            if (!existUser) {
                return res.status(400).json({
                    status: false,
                    message: "Cannot Verify User because User email is unavailable",
                    data: null
                })
            }

            if (existUser) {
                const payload = { email: existUser.email }
                const token = jwt.sign(payload, JWT_SIGNATURE_KEY, { expiresIn: "6h" })
                const link = `${HOST}/auth/reset-password?token=${token}`
                emailTemplate = await lib.email.getHtml('reset-password.ejs', { name: existUser.name, link: link })

                await lib.email.sendEmail(email, 'Reset Password', emailTemplate)

                res.status(200).json({
                    status: true,
                    message: 'Successfully Send Email Forgot Password',
                    data: {
                        email: existUser.email
                    }
                })
            }
        } catch (err) {
            next(err);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { password, confirm_new_password } = req.body
            const { token } = req.query

            payload = jwt.verify(token, JWT_SIGNATURE_KEY)
            console.log(payload)

            const user = await User.findOne({ where: { email: payload.email } })

            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Cannot Reset User Password because User Email is Unavailable',
                    data: null
                })
            }
            if (password != confirm_new_password) {
                return res.status(400).json({
                    status: false,
                    message: `password and confirm password doesn't match`,
                    data: null
                })
            }

            const hashed = await bcrypt.hash(password, 10)
            const reset = await User.update({ password: hashed }, { where: { email: payload.email } })

            if (reset) {
                return res.status(200).json({
                    status: true,
                    message: 'Successfully Reset Password',
                    data: {
                        email: payload.email,
                        newPassword: true
                    }
                })
            }
        } catch (err) {
            console.log(err)
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

            let link = `https://primeflight-api-staging.km3ggwp.com/api/auth/verify-user?token=${verifyToken}`

            const sendEmail = lib.email.sendEmail(email, 'Verify your email', `<p>Untuk memverifikasi anda bisa klik <a href=${link}>disini</a></p>`)

            if (sendEmail) {
                res.status(200).json({
                    status: 'PENDING',
                    message: 'Verification Email is being sent'
                })
            }


        } catch (err) {
            next(err);
            // console.log(err);
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
            next(err);
            // console.log(err);
        }
    },
    whoami: (req, res, next) => {
        try {
            const user = req.user;
            return res.status(200).json({
                status: true,
                message: "Successfully Get Current User",
                data: user
            });
        } catch (err) {
            next(err);
        }
    }
}
