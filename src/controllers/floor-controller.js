const { Op } = require("sequelize");
const { Floor, Park, User } = require("../models");
const errorFn = require("../utils/error-fn");

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
    // const parkId = req.body.parkId
    const { parkId, floorName } = req.body;
    const park = await Park.findOne({ where: { id: parkId, deletedAt: null } });
    if (req.user.id !== park.userId) {
      errorFn("You are unauthorized", 401);
    }

    const existFloor = await Floor.findOne({
      where: {
        parkId: parkId,
        floorName: floorName,
        deletedAt: null,
      },
    });

    if (existFloor) {
      errorFn("The floor has already existed", 400);
    }

    const value = req.body;
    const floor = await Floor.create(value);
    res.status(201).json({ floor });
  } catch (err) {
    next(err);
  }
};

exports.updateFloor = async (req, res, next) => {
  try {
    // // const {floorId:id} = req.params
    // const floor = await Floor.findOne({ where: { id: req.params.floorId } });
    // if (!floor) {
    //     errorFn('The floor does not exist', 400);
    // }
    // //deconstruct
    // const { floorName, slotAmount, isAvailable, parkId } = req.body;

    // const park = await Park.findOne({ where: { id: parkId } })
    // if (park.userId !== req.user.id) {
    //     errorFn('You have no permission to edit this floor');
    // }

    // const {floorId:id} = req.params
    const floor = await Floor.findOne({
      where: { id: req.params.floorId, deletedAt: null },
    });
    if (!floor) {
      errorFn("The floor does not exist", 400);
    }
    //deconstruct
    const { floorName, slotAmount, isAvailable } = req.body;

    const park = await Park.findOne({
      where: { id: floor.parkId, deletedAt: null },
    });
    if (park.userId !== req.user.id) {
      errorFn("You have no permission to edit this floor", 403);
    }

    //{floorName:floorName}
    const value = { floorName, slotAmount, isAvailable };

    //exist floor name
    const existFloor = await Floor.findOne({
      where: {
        parkId: floor.parkId,
        floorName: floorName,
        deletedAt: null,
      },
    });
    if (existFloor && floorName !== floor.floorName) {
      errorFn("Floor name has already exist", 400);
    }

    //edit floor in table
    const result = await Floor.update(value, {
      where: {
        id: req.params.floorId,
      },
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteFloor = async (req, res, next) => {
  try {
    const floor = await Floor.findOne({
      where: { id: req.params.floorId, deletedAt: null },
    });
    if (!floor) {
      errorFn("The floor does not exist", 400);
    }
    const park = await Park.findOne({
      where: { id: floor.parkId, deletedAt: null },
    });
    if (park.userId !== req.user.id) {
      errorFn("You have no permission to remove this floor", 403);
    }
    const result = await floor.destroy();
    res.status(204).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getFloor = async (req, res, next) => {
  try {
    const floor = await Floor.findAll({ where: { deletedAt: null } });
    res.status(200).json(floor);
  } catch (err) {
    next(err);
  }
};

exports.getFloorByParkId = async (req, res, next) => {
  try {
    const floor = await Floor.findAll({
      where: { parkId: req.params.parkId, deletedAt: null },
    });
    res.status(200).json(floor);
  } catch (err) {
    next(err);
  }
};

// exports.getFloorIncludeAll = async (req, res, next) => {
//     try {
//         const floor = await Floor.findAll({
//             // where: {},
//             include: {
//                 model: Park,
//                 include: {
//                     model: User,
//                     attributes: { exclude: ['password'] }
//                 }
//             }
//         });
//         res.status(200).json(floor)
//     } catch (err) { next(err) }
// }
