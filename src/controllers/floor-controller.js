const { Op } = require("sequelize");
const { Floor, Park, Slot, sequelize } = require("../models");
const errorFn = require("../utils/error-fn");

//{partId,floorName,slotAmount,}
exports.createFloor = async (req, res, next) => {
  try {
    const { parkId } = req.params;
    const { floorName, slotAmount } = req.body;
    // const { parkId, floorName, slotAmount } = req.body;
    const park = await Park.findOne({
      where: { id: parkId, deletedAt: null },
    });
    if (req.user.id !== park?.userId) {
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

    // const floor = await Floor.create(req.body);
    const floorResult = await sequelize.transaction(async (t) => {
      const floor = await Floor.create(
        { parkId, floorName, slotAmount },
        { transaction: t },
      );

      //========= Create slot ==========//
      const startName = 1;
      const slots = [];
      for (let idx = startName; idx <= slotAmount; idx++) {
        slots.push({
          slotName: +floor.floorName * 1000 + idx + "",
          isAvailable: true,
          floorId: floor.id,
          parkId,
        });
      }
      const slot = await Slot.bulkCreate(slots, { transaction: t });
      //========= Create slot ==========//

      if (!slot) {
        errorFn(
          "Cannot create the floor, since the slot cannot be posted!!!",
          400,
        );
      }
      return floor;
    });
    res.status(201).json(floorResult);
  } catch (err) {
    next(err);
  }
};

exports.updateFloor = async (req, res, next) => {
  try {
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
    await Slot.destroy({
      where: { floorId: req.params.floorId, deletedAt: null },
    });

    const result = await floor.destroy({
      where: { id: req.params.floorId, deletedAt: null },
    });
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
