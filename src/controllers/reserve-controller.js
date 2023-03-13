const { Op } = require("sequelize");
const moment = require("moment");
const { Reservation, Vehicle, Slot, Floor, Park } = require("../models");
const errorFn = require("../utils/error-fn");

exports.createReservation = async (req, res, next) => {
  //req.boy => vehicleId parkId slotName floor timeStart timeEnd reserveCost isPaid
  try {
    // const value = req.body;
    const userId = req.user.id;
    const { vehicleId, parkId, slotId, floor, selectStart, selectEnd, isPaid } =
      req.body;

    if (selectStart >= selectEnd) {
      errorFn("End time must greater than start time", 400);
    }
    const start = new Date(selectStart);
    const end = new Date(selectEnd);

    const duration = (end - start) / 1000 / 60 / 60;
    if (duration < 1) {
      errorFn("The reserve duration time should greater than 1 hour", 400);
    }

    const vehicle = await Vehicle.findOne({
      where: { id: vehicleId, deletedAt: null },
    });
    if (vehicle.userId !== req.user.id) {
      errorFn("You are unauthorized", 401);
    }

    const park = await Park.findOne({ where: { id: parkId, deletedAt: null } });
    // const slot = await Slot.findOne({ where: { slotName } });
    const slot = await Slot.findOne({
      where: { id: slotId, deletedAt: null },
      include: {
        model: Floor,
      },
    });

    if (slot?.Floor?.parkId !== +parkId) {
      errorFn("There is no such slot in the park", 400);
    }

    const slotName = slot.slotName;
    if (!slot?.isAvailable) {
      errorFn(`The slot ${slotName} is unavailable`, 400);
    }

    const priceRate = park.priceRate;
    // const end = new Date(selectEnd);
    // const start = new Date(selectStart);
    const reserveCost = (+priceRate * (end - start)) / (1000 * 60 * 60);

    const value = {
      userId,
      vehicleId,
      parkId,
      floor,
      timeStart: selectStart,
      timeEnd: selectEnd,
      priceRate,
      reserveCost,
      isPaid,
      slotId,
      priceRate,
      reserveCost,
    };

    // const result = await Slot.update(
    //   {
    //     // isAvailable: false,
    //     timeStart: selectStart,
    //     timeEnd: selectEnd,
    //   },
    //   { where: { id: slotId } },
    // );
    // if (!result) {
    //   errorFn("Can not reserve the park lot");
    // }
    const reservation = await Reservation.create(value);

    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
};

exports.getReservation = async (req, res, next) => {
  try {
    //
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const now = new Date();

    const reservation = await Reservation.findAll({
      where: { [Op.and]: [{ timeEnd: { [Op.gte]: now } }], deletedAt: null },
      userId: req.user.id,
      include: [{ model: Vehicle }, { model: Park }, { model: Slot }],
    });

    const newReservation = reservation.map((el) => {
      const start = new Date(el.dataValues.timeStart).toLocaleDateString(
        "en-US",
        options,
      );
      const end = new Date(el.dataValues.timeEnd).toLocaleDateString(
        "en-US",
        options,
      );
      el.dataValues.timeStart = start;
      el.dataValues.timeEnd = end;
      return el;
    });
    //no timeStart, timeEnd modify
    // res.status(200).json(reservation);
    //timeStart, timeEnd modify
    res.status(200).json(newReservation);
  } catch (err) {
    next(err);
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({
      where: { id: req.params.reserveId, deletedAt: null },
    });
    if (!reservation) {
      errorFn("The reservation dose not exist", 400);
    }
    const { userId } = await Vehicle.findOne({
      where: { id: reservation.vehicleId, deletedAt: null },
    });
    if (userId !== req.user.id) {
      errorFn("You have no permission to edit this reservation", 403);
    }
    if (req.body.status === "cancel" || req.body.status === "activated") {
      await Slot.update(
        { isAvailable: true },
        { where: { id: reservation.slotId, deletedAt: null } },
      );
    }
    value = req.body;
    const result = await Reservation.update(value, {
      where: { id: req.params.reserveId, deletedAt: null },
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getReservationByVehicleId = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.vehicleId, deletedAt: null },
    });
    if (vehicle.userId !== req.user.id) {
      errorFn("You are unauthorized", 401);
    }

    const reservation = await Reservation.findAll({
      where: { vehicleId: req.params.vehicleId, deletedAt: null },
    });
    res.status(200).json(reservation);
  } catch (err) {
    next(err);
  }
};

//time
// // Assume reservations is an array of reserved time slots in ISO format
// const reservations = [
//   { start: "2023-03-10T14:30:00.000Z", end: "2023-03-10T15:00:00.000Z" },
//   { start: "2023-03-10T16:00:00.000Z", end: "2023-03-10T17:00:00.000Z" },
//   // ...
// ];
// function isDurationAvailable(start, end) {
//   const startMillis = new Date(start).getTime();
//   const endMillis = new Date(end).getTime();
//   for (let reservation of reservations) {
//     const resStartMillis = new Date(reservation.start).getTime();
//     const resEndMillis = new Date(reservation.end).getTime();
//     if (startMillis < resEndMillis && endMillis > resStartMillis) {
//       return false; // duration overlaps with a reserved time slot
//     }
//   }
//   return true; // duration does not overlap with any reserved time slots
// }

// // Usage example:
// // const durationStart = "2023-03-10T15:30:00.000Z";
// // const durationEnd = "2023-03-10T16:30:00.000Z";
// const durationStart = "2023-01-10T15:30:00.000Z";
// const durationEnd = "2023-02-10T16:30:00.000Z";

// if (isDurationAvailable(durationStart, durationEnd)) {
//   console.log("Duration is available!");
// } else {
//   console.log("Duration is already reserved.");
// }
