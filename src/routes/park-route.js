const express = require("express");
const parkController = require("../controllers/park-controller");
const floorController = require("../controllers/floor-controller");
const slotController = require("../controllers/slot-controller");

const router = express.Router();
//only get park for user
//to crud park go to offer-route

//park
router.get("/", parkController.getPark);

//floor
router.get("/floor", floorController.getFloor);
router.get("/:parkId/floor", floorController.getFloorByParkId);

//slot
router.get("/slot", slotController.getSlot);
router.patch("/slot/:slotId", slotController.updateSlot);

module.exports = router;

// router.get('/:floorId/slot', slotController.getSlotByFloorId);
