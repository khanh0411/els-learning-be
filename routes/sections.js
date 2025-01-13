const express = require('express');
const router = express.Router();
const {checkTeacher, checkToken} = require('../middleware/checkToken');
const { createSections, getSections, getSectionById, deleteSection, updateSection } = require('../controllers/sectionController');



router.get('/getSections', getSections);
router.post('/getSectionById',checkToken, getSectionById);
router.post('/createSections',checkToken,checkTeacher, createSections);
router.post('/deleteSection', checkToken,checkTeacher, deleteSection);
router.post('/updateSection', checkToken,checkTeacher, updateSection);

module.exports = router;
