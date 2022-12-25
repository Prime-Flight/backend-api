const { User } = require('../db/models');
const imagekit = require('../utils/imagekit');
module.exports = {
    getUserDetails: async (req, res, next) => {
        try {
            const { id } = req.user;

            const checkUser = await User.findOne({ where: { id: id} });

            if (!checkUser) {
                return res.status(400).json({
                    status: false,
                    message: "Cannot provide User Profile Information Because it is Unavailable",
                    data: null
                });
            }

            const userDetails = await User.findOne({
                attributes: [
                    'name', 'email',
                    'url_profile_picture', 'gender',
                    'nationality',
                    'is_verified', 'phone_number'],
                where: { id: id }
            });
            return res.status(200).json({
                status: true,
                message: `Successfully Get The User Details`,
                data: userDetails
            });
        } catch (err) {
            next(err)
        }
    },
    updateUserDetails: async (req, res, next) => {
        try {
            const { id } = req.user;

            const checkUser = await User.findOne({ where: { id: id} });

            if (!checkUser) {
                return res.status(400).json({
                    status: false,
                    message: "Cannot provide Update Profile Information Because it is Unavailable",
                    data: null
                });
            }

            const {
                name, email, url_profile_picture, 
                gender, nationality, phone_number
            } = req.body;

            await User.update({
                    name: name, 
                    email: email,
                    url_profile_picture: url_profile_picture,
                    gender: gender,
                    nationality: nationality,
                    phone_number: phone_number
                },
                { where: { id: id } 
            });

            const updatedUser = await User.findOne({
                attributes: [
                    'name', 'email', 'url_profile_picture', 
                    'gender', 'nationality', 'phone_number'],
                where: { id: id }
            });

            return res.status(200).json({
                status: true,
                message: `Successfully Update The User Details`,
                data: updatedUser
            });
        } catch (err) {
            console.log(err);
            next(err)
        }
    },
    deleteUserDetails: async(req, res, next) => {
        try { 
            const { email } = req.body
            const checkUser = await User.findOne({ where: { email: email} });
            if (!checkUser) {
                return res.status(400).json({
                    status: false,
                    message: "Cannot provide Delete Profile Information Because it is Unavailable",
                    data: null
                });
            }

            await User.destroy({ where: { email: email} })
            return res.status(200).json({
                status: true,
                message: `Successfully Delete The User Details`,
            });
        } catch(err) {
            next(err)
        }
    },
    uploadProfilePicture: async (req, res, next) => {
        try {
            const { id } = req.user;
            const file = req.file.buffer.toString("base64");

            const checkUser = await User.findOne({ where: { id: id} });

            if (!checkUser) {
                return res.status(400).json({
                    status: false,
                    message: "Cannot provide Update Profile Information Because it is Unavailable",
                    data: null
                });
            }
            const profile_picture = await imagekit.upload({
              file,
              fileName: req.file.originalname
            });
            
            await User.update({ url_profile_picture: profile_picture.url }, { where: { id: id } });

            const updatedUser = await User.findOne({
                attributes: [
                    'name', 'email', 'url_profile_picture', 
                    'gender', 'nationality', 'phone_number'],
                where: { id: id }
            });

            return res.status(200).json({
                status: true,
                message: `Successfully Upload Profile Picture`,
                data: updatedUser
            });
        } catch (err) {
            console.log(err);
            next(err)
        }
    },

}
