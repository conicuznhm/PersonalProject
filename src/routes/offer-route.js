const express = require('express');
const parkController = require('../controllers/park-controller');
const floorController = require('../controllers/floor-controller');
const slotController = require('../controllers/slot-controller');
const upload = require('../middlewares/upload');

const router = express.Router();
//To crud park floor slot
//park
// router.get('/', parkController.getPark);
router.get('/', parkController.getParkByOfferId);
router.post('/', upload.single('parkImage'), parkController.createPark);
router.patch('/:parkId', parkController.updatePark);
router.patch('/:parkId/image', upload.single('parkImage'), parkController.updateParkImage);
router.delete('/:parkId', parkController.deletePark);

//floor

// router.post('/:parkId/floor', floorController.createFloor);
// router.post('/floor', floorController.createFloor);
// router.patch('/:parkId/floor/:floorId', floorController.updateFloor);
// router.delete('/:parkId/floor/:floorId', floorController.deleteFloor);
router.get('/all/floor', floorController.getFloor);

router.get('/:parkId/floor', floorController.getFloorByParkId);
router.post('/floor', floorController.createFloor);
router.patch('/floor/:floorId', floorController.updateFloor);
router.delete('/floor/:floorId', floorController.deleteFloor);



//slot
// router.post('/slot', slotController.createSlot)



module.exports = router;
