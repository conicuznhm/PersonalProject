const { Op } = require("sequelize");
const { Slot, Floor, Park, Reservation } = require("../models");
const errorFn = require("../utils/error-fn");

//get  floorId from req.body
//create slot by when create floor with slotAmount in floor
exports.createSlot = async (req, res, next) => {
  try {
    const { floorId } = req.body;
    const { floorName, slotAmount, parkId } = await Floor.findOne({
      where: { id: floorId, deletedAt: null },
    });

    const park = await Park.findOne({ where: { id: parkId, deletedAt: null } });
    if (req.user.id !== park.userId) {
      errorFn("You are unauthorized", 401);
    }

    const existFloor = await Slot.findOne({
      where: { floorId, deletedAt: null },
    });
    if (existFloor) {
      errorFn("The floor already has slot", 400);
    }

    const startName = 1;
    const value = [];
    for (let idx = startName; idx <= slotAmount; idx++) {
      value.push({
        slotName: +floorName * 1000 + idx + "",
        isAvailable: true,
        floorId,
      });
    }

    const slot = await Slot.bulkCreate(value);
    res.status(201).json(slot);
  } catch (err) {
    next(err);
  }
};

//add slot
exports.addSlot = async (req, res, next) => {
  try {
    const { floorId, slotAmount } = req.body;
    const { floorName, parkId } = await Floor.findOne({
      where: { id: floorId, deletedAt: null },
    });

    const park = await Park.findOne({ where: { id: parkId, deletedAt: null } });
    if (req.user.id !== park.userId) {
      errorFn("You are unauthorized", 401);
    }

    const lastSlot = await Slot.findAll({
      where: { floorId, deletedAt: null },
    });
    const lastSlotName = +lastSlot[lastSlot.length - 1]?.slotName.slice(-1) + 1;

    const startName = lastSlotName || 1;
    const endName = startName + +slotAmount;
    const value = [];
    for (let idx = startName; idx < endName; idx++) {
      value.push({
        slotName: +floorName * 1000 + idx + "",
        isAvailable: true,
        floorId,
      });
    }
    const result = await Slot.bulkCreate(value);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findOne({
      where: { id: req.params.slotId, deletedAt: null },
    }); //slot.floorId
    if (!slot) {
      errorFn("The slot does not exist", 400);
    }
    const { parkId } = await Floor.findOne({
      where: { id: slot.floorId, deletedAt: null },
    }); //floor.parkId
    const { userId } = await Park.findOne({
      where: { id: parkId, deletedAt: null },
    }); //park.userId

    if (userId !== req.user.id) {
      errorFn("You have no permission to edit this slot", 403);
    }

    const { slotName, isAvailable } = req.body;
    const value = { slotName, isAvailable };
    const result = await Slot.update(value, {
      where: { id: req.params.slotId },
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findOne({
      where: { id: req.params.slotId, deletedAt: null },
    }); //slot.floorId
    if (!slot) {
      errorFn("The slot does not exist", 400);
    }
    const { parkId } = await Floor.findOne({
      where: { id: slot.floorId, deletedAt: null },
    }); //floor.parkId
    const { userId } = await Park.findOne({
      where: { id: parkId, deletedAt: null },
    }); //park.userId
    if (userId !== req.user.id) {
      errorFn("You have no permission to edit this slot", 403);
    }

    const result = await slot.destroy();
    res.status(204).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findAll({
      where: { deletedAt: null },
      include: {
        model: Floor,
        include: {
          model: Park,
        },
      },
    });
    res.status(200).json(slot);
  } catch (err) {
    next(err);
  }
};

//use
exports.getSlotByParkId = async (req, res, next) => {
  try {
    // const { start, end } = req.query;
    const { parkId } = req.params;
    const now = new Date();
    const {
      start = now.toISOString().slice(0, 16),
      end = new Date(now.getTime() + 60000 * 60).toISOString().slice(0, 16),
    } = req.query;
    if (start >= end) {
      errorFn("End time must greater than start time", 400);
    }
    const st = new Date(start);
    const ed = new Date(end);
    // const st = new Date(start).getTime();
    // const ed = new Date(end).getTime();
    const duration = (ed - st) / 1000 / 60 / 60;
    console.log(duration);
    if (duration < 1) {
      errorFn("The reserve duration time should greater than 1 hour", 400);
    }
    //find red slot
    const reservation = await Reservation.findAll({
      where: {
        [Op.and]: [
          { timeStart: { [Op.lte]: end } },
          { timeEnd: { [Op.gte]: start } },
        ],
        parkId,
        deletedAt: null,
      },
    });
    const arrId = reservation.map((el) => el.dataValues.slotId);
    console.log(arrId);
    const slot = await Slot.findAll({
      where: { parkId, deletedAt: null },
      // include: {
      //   model: Floor,
      //   include: {
      //     model: Park,
      //   },
      // },
    });

    const updateSlot = slot.map((el) => {
      if (arrId.includes(el.id)) {
        return { ...el.dataValues, isAvailable: false };
      }
      return { ...el.dataValues, isAvailable: true };
      // return el;
    });
    res.status(200).json(updateSlot);
  } catch (err) {
    next(err);
  }
};
// start <= timeEnd && end >= timeStart
// arrId =[3,4]
// slot = [{id:1, isAvailable: 0 },{id:2, isAvailable: 0 },{},{},{}]

// //no use
// exports.getRedSlot = async (req, res, next) => {
//   try {
//     const { start, end } = req.query;
//     const { parkId } = req.params;
//     // const start = "2023-04-14 16:00:00";
//     // const end = "2023-04-16 16:00:00";
//     // const st = new Date("2023-04-14 16:00:00");
//     // const ed = new Date("2023-04-16 16:00:00");
//     const slot = await Slot.findAll({
//       where: {
//         [Op.and]: [
//           { timeStart: { [Op.lte]: end } },
//           { timeEnd: { [Op.gte]: start } },
//         ],
//         parkId,
//         deletedAt: null,
//       },
//       // include: {
//       //   model: Floor,
//       //   include: {
//       //     model: Park,
//       //   },
//       // },
//     });
//     const arrId = slot.map((el) => el.id);
//     console.log(arrId);
//     await Slot.update(
//       { isAvailable: 0 },
//       {
//         where: {
//           id: {
//             [Op.in]: arrId,
//           },
//         },
//       },
//     );
//     res.status(200).json(slot);
//   } catch (err) {
//     next(err);
//   }
// };
