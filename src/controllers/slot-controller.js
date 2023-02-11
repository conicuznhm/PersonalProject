
//floor:2
//slot_amount = 100
// const value = []
// for(let idx=0;idx<slot_amount;idx++){
//     value.push({slotName:(floor*1000+idx),isAvailable:true,floorId:floor})
// }
//const value = [
//     {slotName:2001, isAvailable, floorId:2},
//     {slotName:2002, isAvailable, floorId:2},
//     {slotName:2003, isAvailable, floorId:2},
//     {slotName:2004, isAvailable, floorId:2}
//     {slotName:2005, isAvailable, floorId:2}
// ]

//slot.bulkCreate(value,)


const { Op } = require("sequelize")
const { Slot, Floor, Park, } = require("../models")
const errorFn = require("../utils/error-fn")

//get  floorId from req.body 
//create slot by when create floor with slotAmount in floor
exports.createSlot = async (req, res, next) => {
    try {
        const { floorId } = req.body
        const { floorName, slotAmount, parkId } = await Floor.findOne({ where: { id: floorId } });

        const park = await Park.findOne({ where: { id: parkId } })
        if (req.user.id !== park.userId) {
            errorFn('You are unauthorized', 401);
        }

        const existFloor = await Slot.findOne({ where: { floorId } })
        if (existFloor) {
            errorFn('The floor already has slot', 400)
        }

        const startName = 1;
        const value = [];
        for (let idx = startName; idx <= slotAmount; idx++) {
            value.push({ slotName: ((+floorName * 1000 + idx) + ''), isAvailable: true, floorId })
        }

        const slot = await Slot.bulkCreate(value);
        res.status(201).json(slot);

    } catch (err) { next(err) }
}

//add slot
exports.addSlot = async (req, res, next) => {
    try {
        const { floorId, slotAmount } = req.body
        const { floorName, parkId } = await Floor.findOne({ where: { id: floorId } });

        const park = await Park.findOne({ where: { id: parkId } })
        if (req.user.id !== park.userId) {
            errorFn('You are unauthorized', 401);
        }

        const lastSlot = await Slot.findAll({ where: { floorId } })
        const lastSlotName = +lastSlot[lastSlot.length - 1]?.slotName.slice(-1) + 1

        const startName = lastSlotName || 1;
        const endName = startName + +slotAmount;
        const value = [];
        for (let idx = startName; idx < endName; idx++) {
            value.push({ slotName: ((+floorName * 1000 + idx) + ''), isAvailable: true, floorId })
        }
        const result = await Slot.bulkCreate(value);
        res.status(201).json(result);

    } catch (err) { next(err) }
}



exports.updateSlot = async (req, res, next) => {
    try {
        const slot = await Slot.findOne({ where: { id: req.params.slotId } }); //slot.floorId
        if (!slot) {
            errorFn('The slot does not exist', 400);
        }
        const { parkId } = await Floor.findOne({ where: { id: slot.floorId } });            //floor.parkId
        const { userId } = await Park.findOne({ where: { id: parkId } });              //park.userId

        if (userId !== req.user.id) {
            errorFn('You have no permission to edit this slot', 403)
        }

        const { slotName, isAvailable } = req.body;
        const value = { slotName, isAvailable };
        const result = await Slot.update(value, { where: { id: req.params.slotId } })
        res.status(201).json(result);
    } catch (err) { next(err) }
}

exports.deleteSlot = async (req, res, next) => {
    try {
        const slot = await Slot.findOne({ where: { id: req.params.slotId } }); //slot.floorId
        if (!slot) {
            errorFn('The slot does not exist', 400);
        }
        const { parkId } = await Floor.findOne({ where: { id: slot.floorId } });            //floor.parkId
        const { userId } = await Park.findOne({ where: { id: parkId } });              //park.userId
        if (userId !== req.user.id) {
            errorFn('You have no permission to edit this slot', 403)
        }

        const result = await slot.destroy();
        res.status(204).json(result);
    } catch (err) { next(err) }
}



exports.getSlot = async (req, res, next) => {
    try {
        const slot = await Slot.findAll();
        res.status(200).json(slot);
    } catch (err) { next(err) }
}

exports.getSlotByFloorId = async (req, res, next) => {

}