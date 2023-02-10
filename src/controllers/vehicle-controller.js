const fs = require("fs")
const { Op } = require("sequelize")
const { Vehicle } = require("../models")
const cloudinary = require("../utils/cloudinary")
const errorFn = require("../utils/error-fn")


exports.createVehicle = async (req, res, next) => {
    try {
        const value = req.body;

        if (value.vehicleImage) {
            value.vehicleImage = await cloudinary.upload(value.vehicleImage)
        }

        value.userId = req.user.id;
        const vehicle = await Vehicle.create(value);
        res.status(201).json({ vehicle })
    } catch (err) { next(err) }
    finally {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
    }
}

exports.updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ where: { id: req.params.vehicleId } })
        if (!vehicle) {
            errorFn('No such vehicle', 400);
        }
        if (vehicle.userId !== req.user.id) {
            errorFn('You have no permission to edit', 403)
        }

        const value = {
            type: req.body.type,
            brand: req.body.brand,
            license: req.body.license
        }
        const result = await Vehicle.update(value, {
            where: {
                id: req.params.vehicleId
            }
        })
        res.status(201).json(result)
    } catch (err) { next(err) }
}

exports.updateVehicleImage = async (req, res, next) => {

    try {
        const vehicle = await Vehicle.findOne({ where: { id: req.params.vehicleId } })
        if (!vehicle) {
            errorFn('No such vehicle', 400);
        }
        if (vehicle.userId !== req.user.id) {
            errorFn('You have no permission to edit', 403)
        }

        const vehicleById = await Vehicle.findOne({ where: { id: req.params.vehicleId } })
        const image = vehicleById.vehicleImage;
        const vehiclePublicId = image ? cloudinary.getPublicId(image) : null;
        if (!req.file) {
            errorFn('Vehicle image is required', 400)
        }
        else {
            const vehicleImage = await cloudinary.upload(req.file.path, vehiclePublicId)
            // console.log(vehicleImage)
            await Vehicle.update({ vehicleImage }, { where: { id: req.params.vehicleId } })
            res.status(201).json({ vehicleImage })
        }

    } catch (err) { next(err) }
    finally {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
    }
}

exports.deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ where: { id: req.params.vehicleId } })
        if (!vehicle) {
            errorFn('No such vehicle', 400);
        }
        if (vehicle.userId !== req.user.id) {
            errorFn('You have no permission to remove this vehicle', 403)
        }
        const result = await vehicle.destroy();
        res.status(204).json(result);
    } catch (err) { next(err) }
}

