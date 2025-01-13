const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/delete', userController.deleteUser);
router.post('/allusers', userController.getAllUsers);
router.post('/setrole', userController.setRole);

module.exports = router;
