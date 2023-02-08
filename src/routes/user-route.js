const express = require('express');
const userController = require('../controllers/user-controller');

const upload = require('../middlewares/upload');
const router = express.Router();

router.get('/:userId', userController.getUserInfoById)

router.patch('/', userController.updateProfile)

// upload.single('profileImage')
router.patch('/', upload.fields([
    { name: 'profileImage', maxCount: 1 }
]),
    userController.updateProfileImage
);

module.exports = router;