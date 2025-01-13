const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkToken, checkResetToken } = require('../middleware/checkToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/changePassword', checkToken,authController.changePassword);



router.post('/forgotPassword',authController.forgotPassword);
router.post('/resetPassword',checkResetToken,authController.resetPassword);



module.exports = router;
