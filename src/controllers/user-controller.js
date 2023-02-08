const fs = require('fs');
const { Op } = require('sequelize');
const { User } = require('../models');
// const {Vehicle, Park } = require('../models');
const errorFn = require('../utils/error-fn');
const cloudinary = require('../utils/cloudinary');



exports.getUserInfoById = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.userId
            },
            attributes: {
                exclude: ['password']
            }
        })

        if (!user) {
            errorFn(`User ${req.params.userId} is not found`, 400)
        }
    } catch (err) { next(err) }
}

exports.updateProfile = async (req, res, next) => {
    try {
        console.log(req.body)
        const value = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        }
        // const value = req.body
        const result = await User.update(value, { where: { id: req.user.id } })
        res.status(201).json(result)
    } catch (err) { next(err) }
}


exports.updateProfileImage = async (req, res, next) => {
    try {
        let value;
        const { profileImage } = req.user;
        const profilePublicId = profileImage ?
            cloudinary.getPublicId(profileImage) :
            null;

        if (!req.files.profileImage) {
            errorFn('Profile image is required')
        } else {
            const profileImage = await cloudinary.upload(
                req.files.profileImage[0].path, profilePublicId
            )
            value = { profileImage }
        }

        await User.update(value, { where: { id: req.user.id } })
        res.status(200).json(value)
    } catch (err) { next(err) }
    finally {
        if (req.files.profileImage) {
            fs.unlinkSync(req.files.profileImage[0].path)
        }
    }
}