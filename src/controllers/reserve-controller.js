const { Op } = require("sequelize");
const moment = require('moment');
const { Reservation, Vehicle, Slot, Floor, Park } = require("../models");
const errorFn = require('../utils/error-fn');

exports.createReservation = async (req, res, next) => {

    //req.boy => vehicleId parkId slotName floor timeStart timeEnd reserveCost isPaid 
    try {
        // const value = req.body;
        // const { vehicleId, parkId, slotId, floor, selectStart, selectEnd, isPaid } = req.body;
        const { vehicleId, parkId, slotId, floor, selectEnd, isPaid } = req.body;
        //
        // const selectStart = moment();
        const selectStart = new Date();
        if (moment(selectStart).isAfter(moment(selectEnd))) {
            errorFn('Cannot reserve the pass time', 400)
        }

        const vehicle = await Vehicle.findOne({ where: { id: vehicleId } })
        if (vehicle.userId !== req.user.id) {
            errorFn('You are unauthorized', 401);
        }

        const park = await Park.findOne({ where: { id: parkId } })
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

        // if (isSlotNotFree) {
        //     errorFn(`The slot ${slot.slotName} is unavailable`, 400);
        // }
        const priceRate = park.priceRate;
        const end = new Date(selectEnd);
        const start = new Date(selectStart);
        const reserveCost = +priceRate * (end - start) / (1000 * 60 * 60);
        // const reserveCost = +priceRate * (moment(selectEnd).hour() - moment(selectStart).hour());
        // const reserveCost = +priceRate * (selectEnd.getHours() - selectStart.getHours());
        // const reserveCost = priceRate;
        const value = {
            vehicleId,
            parkId,
            floor,
            timeStart: selectStart,
            timeEnd: selectEnd,
            priceRate, reserveCost,
            isPaid,
            slotId,
            priceRate,
            reserveCost
        };

        const result = await Slot.update({
            isAvailable: false,
            timeStart: selectStart,
            timeEnd: selectEnd
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
        const reservation = await Reservation.findAll({
            include: [
                { model: Vehicle },
                { model: Park },
                { model: Slot }
            ]
        })
        res.status(200).json(reservation);
    } catch (err) { next(err) }
}


exports.updateReservation = async (req, res, next) => {
    try {

        const reservation = await Reservation.findOne({ where: { id: req.params.reserveId } });
        if (!reservation) {
            errorFn('The reservation dose not exist', 400);
        }
        const { userId } = await Vehicle.findOne({ where: { id: reservation.vehicleId } });
        if (userId !== req.user.id) {
            errorFn('You have no permission to edit this reservation', 403)
        }
        if (req.body.status === 'cancel' || req.body.status === 'activated') {
            await Slot.update({ isAvailable: true }, { where: { id: reservation.slotId } });
        }
        value = req.body;
        const result = await Reservation.update(value, { where: { id: req.params.reserveId } })
        res.status(201).json(result);
    } catch (err) { next(err) }
}


exports.getReservationByVehicleId = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findOne({ where: { id: req.params.vehicleId } })
        if (vehicle.userId !== req.user.id) {
            errorFn('You are unauthorized', 401);
        }

        const reservation = await Reservation.findAll({ where: { vehicleId: req.params.vehicleId } })
        res.status(200).json(reservation);
    } catch (err) { next(err) }

}




// const selectStart = "2023-02-15T09:00:00+07:00";
// const selectEnd = "2023-02-15T11:00:00+07:00";




  //add+++++++++++++++++++++++++++++++++++++
        // const isSlotNotFree = await Slot.findOne({
        //     where: {
        //         id: slotId,
        //         [Op.or]: [
        //             {
        //                 [Op.and]: [
        //                     {
        //                         timeStart: {
        //                             [Op.lt]: selectEnd,
        //                         },
        //                         timeStart: {
        //                             [Op.gt]: selectStart,
        //                         },
        //                     },
        //                     {
        //                         timeEnd: {
        //                             [Op.lt]: selectEnd,
        //                         },
        //                         timeEnd: {
        //                             [Op.gt]: selectStart,
        //                         },
        //                     },
        //                 ],
        //             },
        //             {
        //                 [Op.and]: [
        //                     {
        //                         timeStart: {
        //                             [Op.lt]: selectEnd,
        //                         },
        //                         timeStart: {
        //                             [Op.gt]: selectStart,
        //                         },
        //                     },
        //                     {
        //                         timeEnd: {
        //                             [Op.lt]: selectEnd,
        //                         },
        //                         timeEnd: {
        //                             [Op.gt]: selectStart,
        //                         },
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        // })
        //add++++++++++++++++++++++++++++