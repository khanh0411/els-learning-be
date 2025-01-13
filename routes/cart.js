const express = require('express');
const { checkAdmin,checkToken } = require('../middleware/checkToken');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.post('/getCart', checkToken, getCart);
router.post('/addToCart', checkToken, addToCart);
router.post('/removeFromCart', checkToken, removeFromCart);


module.exports = router;