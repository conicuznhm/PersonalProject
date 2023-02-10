const { Op } = require("sequelize")
const { Floor, Park } = require("../models")
const errorFn = require("../utils/error-fn")

// exports.createFloor = async (req, res, next) => {
//     try {
//         if (req.user.role !== "offer") {
//             errorFn('You are unauthorized', 403);
//         }

//         const parkId = req.params.parkId
//         const park = await Park.findOne({ where: { id: parkId } })
//         if (req.user.id !== park.userId) {
//             errorFn('You are unauthorized', 403);
//         }

//         const existFloor = await Floor.findOne({
//             where: {
//                 parkId: req.params.parkId,
//                 floorName: req.body.floorName
//             }
//         })

//         if (existFloor) {
//             errorFn('The floor has already existed')
//         }

//         const value = req.body
//         value.parkId = parkId
//         const floor = await Floor.create(value);
//         res.status(201).json({ floor })

//     } catch (err) { next(err) }
// }

// exports.updateFloor = async (req, res, next) => {
//     try {
//         if (req.user.role !== "offer") {
//             errorFn('You are unauthorized', 403);
//         }
//         const floor = await Floor.findOne({
//             where: {
//                 id: req.params.floorId,
//                 parkId: req.params.parkId
//             }
//         })
//         if (!floor) {
//             errorFn('No have such a floor')
//         }
//         const value = {
//             floorName: req.body.floorName,
//             slotAmount: req.body.slotAmount,
//             isAvailable: req.body.isAvailable
//         }
//         const result = await Floor.update(value, {
//             where: {
//                 id: req.params.floorId,
//                 parkId: req.params.parkId
//             }
//         })
//         res.status(201).json(result)
//     } catch (err) { next(err) }
// }

//need parkId in body from request  (req.body.parkId)
exports.createFloor = async (req, res, next) => {
    try {
        if (req.user.role !== "offer") {
            errorFn('You are unauthorized', 403);
        }

        const parkId = req.body.parkId
        const park = await Park.findOne({ where: { id: parkId } })
        if (req.user.id !== park.userId) {
            errorFn('You are unauthorized', 403);
        }

        const existFloor = await Floor.findOne({
            where: {
                parkId: req.body.parkId,
                floorName: req.body.floorName
            }
        })

        if (existFloor) {
            errorFn('The floor has already existed')
        }

        const value = req.body
        value.parkId = parkId
        const floor = await Floor.create(value);
        res.status(201).json({ floor })

    } catch (err) { next(err) }
}




exports.deleteFloor = async (req, res, next) => {

}