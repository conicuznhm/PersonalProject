const express = require('express');
const vehicleController = require('../controllers/vehicle-controller');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', vehicleController.getVehicle);
router.post('/', upload.single('vehicleImage'), vehicleController.createVehicle);
router.patch('/:vehicleId', vehicleController.updateVehicle);
router.patch('/:vehicleId/image', upload.single('vehicleImage'), vehicleController.updateVehicleImage);
router.delete('/:vehicleId', vehicleController.deleteVehicle);

module.exports = router;
