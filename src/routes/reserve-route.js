const express = require('express');
const reserveController = require('../controllers/reserve-controller');

const router = express.Router();

router.get('/', reserveController.getReservation);
router.get('/:vehicleId', reserveController.getReservationByCarId);
router.post('/', reserveController.createReservation);

// router.patch('/reserveId', reserveController.updateReservation);
// router.delete('/:reserveId', reserveController.deleteReservation);

module.exports = router;