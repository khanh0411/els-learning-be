const express = require('express');
const router = express.Router();
const {createLession, getLessions, getLessionById, updateLession, deleteLession } = require('../controllers/lessionController');


router.post('/createLession', createLession);

router.post('/getLessions', getLessions);

router.post('/getLessionById', getLessionById);

router.post('/updateLession', updateLession);

router.post('/deleteLession', deleteLession);

module.exports = router;