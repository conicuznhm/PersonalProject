const express = require('express');
const parkController = require('../controllers/park-controller');
const floorController = require('../controllers/floor-controller');
// const upload = require('../middlewares/upload');

const router = express.Router();
//only get park for user
//to crud park go to offer-route

//park
router.get('/', parkController.getPark);

// router.post('/', upload.single('parkImage'), parkController.createPark);
// router.patch('/:parkId', parkController.updatePark);
// router.patch('/:parkId/image', upload.single('parkImage'), parkController.updateParkImage);
// router.delete('/:parkId', parkController.deletePark);

//floor
// router.get('/floor', floorController.getFloor)
router.get('/:parkId/floor', floorController.getFloorByParkId)

// // router.post('/:parkId/floor', floorController.createFloor);
// // router.post('/floor', floorController.createFloor);
// // router.patch('/:parkId/floor/:floorId', floorController.updateFloor);
// // router.delete('/:parkId/floor/:floorId', floorController.deleteFloor);

// // router.post('/floor', floorController.createFloor);
// // router.patch('/floor/:floorId', floorController.updateFloor);
// // router.delete('/floor/:floorId', floorController.deleteFloor);

//slot
// router.get('/slot',slotController.getSlot)

module.exports = router;
