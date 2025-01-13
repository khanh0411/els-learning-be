const express = require('express');
const { checkAdmin,checkToken } = require('../middleware/checkToken');
const router = express.Router();
const { getCategories, createCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');

router.post('/getCategories', getCategories);
router.post('/createCategory',checkToken,checkAdmin, createCategory);
router.post('/deleteCategory',checkToken,checkAdmin, deleteCategory);
router.post('/updateCategory',checkToken,checkAdmin, updateCategory);



module.exports = router;
