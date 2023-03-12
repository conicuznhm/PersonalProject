const express = require("express");
const parkController = require("../controllers/park-controller");
const floorController = require("../controllers/floor-controller");
const slotController = require("../controllers/slot-controller");
const upload = require("../middlewares/upload");

const router = express.Router();
//To crud park floor slot

//park
router.get("/", parkController.getParkByOfferId);
router.post("/", upload.single("parkImage"), parkController.createPark);
// router.patch("/:parkId", parkController.updatePark);
router.patch("/:parkId", upload.single("parkImage"), parkController.editPark);
router.patch(
  "/:parkId/image",
  upload.single("parkImage"),
  parkController.updateParkImage,
);
router.delete("/:parkId", parkController.deletePark);

//floor
router.get("/all/floor", floorController.getFloor);

router.get("/:parkId/floor", floorController.getFloorByParkId);
router.post("/:parkId/floor", floorController.createFloor);
router.patch("/floor/:floorId", floorController.updateFloor);
router.delete("/floor/:floorId", floorController.deleteFloor);

//slot
router.get("/all/slot", slotController.getSlot);
router.post("/slot", slotController.createSlot);
router.post("/slot/add", slotController.addSlot);
router.patch("/slot/:slotId", slotController.updateSlot);
router.delete("/slot/:slotId", slotController.deleteSlot);

module.exports = router;
