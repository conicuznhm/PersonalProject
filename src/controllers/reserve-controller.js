const { Reservation, Vehicle, Slot, Floor } = require("../models");
const errorFn = require('../utils/error-fn');

exports.createReservation = async (req, res, next) => {

    //req.boy => vehicleId parkId slotName floor timeStart timeEnd reserveCost isPaid 
    try {
        // const value = req.body;
        const { vehicleId, parkId, slotId, floor, timeStart, timeEnd, priceRate, reserveCost, isPaid } = req.body;
        //
        const vehicle = await Vehicle.findOne({ where: { id: vehicleId } })
        if (vehicle.userId !== req.user.id) {
            errorFn('You are unauthorized', 401);
        }

        // const slot = await Slot.findOne({ where: { slotName } });
        const slot = await Slot.findOne({
            where: { id: slotId },
            include: {
                model: Floor
            }
        });

        if (slot?.Floor?.parkId !== +parkId) {
            errorFn("There is no such slot in the park", 400)
        }

        const slotName = slot.slotName;
        if (!slot?.isAvailable) {
            errorFn(`The slot ${slotName} is unavailable`, 400);
        }

        const value = { vehicleId, parkId, slotName, floor, timeStart, timeEnd, priceRate, reserveCost, isPaid };
        const result = await Slot.update({
            isAvailable: false,
            timeStart,
            timeEnd
        }, { where: { id: slotId } })
        if (!result) {
            errorFn("Can not reserve the park lot")
        }
        const reservation = await Reservation.create(value);
        res.status(201).json(reservation);
    } catch (err) { next(err) }
}


exports.getReservation = async (req, res, next) => {
    try {
        //
        const reservation = await Reservation.findAll()
        res.status(200).json(reservation);
    } catch (err) { next(err) }
}


exports.getReservationByCarId = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ where: { id: req.params.vehicleId } })
        if (vehicle.userId !== req.user.id) {
            errorFn('You are unauthorized', 401);
        }

        const reservation = await Reservation.findAll({ where: { vehicleId: req.params.vehicleId } })
        res.status(200).json(reservation);
    } catch (err) { next(err) }

}