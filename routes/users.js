const express = require('express');
const router = express.Router();
const {detailUser,buyCourse, getAllUsers22, profile, editProfile} = require('../controllers/userController');
const { checkToken, checkAdmin } = require('../middleware/checkToken');


// ?router.get('/', detailUser);



router.post('/allusers', checkToken, checkAdmin, getAllUsers22);

router.post('/profile', checkToken, profile);

router.post('/editProfile',checkToken,editProfile)





module.exports = router;
