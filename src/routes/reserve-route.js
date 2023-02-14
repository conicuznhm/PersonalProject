const express = require('express');
const reserveController = require('../controllers/reserve-controller');

const router = express.Router();

router.get('/', reserveController.getReservation);
router.get('/:vehicleId', reserveController.getReservationByVehicleId);
router.post('/', reserveController.createReservation);

// router.patch('/reserveId', reserveController.updateReservation);
// router.delete('/:reserveId', reserveController.deleteReservation);

module.exports = router;

