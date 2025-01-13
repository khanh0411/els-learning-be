const express = require('express');
const { checkToken, checkTeacher } = require('../middleware/checkToken');
const { studentSendMessage, replyMessage, getMessages, teacherGetQuesstionFromStudent, studentGetQuestionFromMe } = require('../controllers/chat');
const router = express.Router();

router.post('/student/send', checkToken, studentSendMessage);


router.post('/student/reply', checkToken, replyMessage);

router.post('/teacher/reply', checkToken, checkTeacher, replyMessage);

router.post('/getMessages', checkToken, getMessages);


router.post('/teacherGetQuesstionFromStudent', checkToken, checkTeacher, teacherGetQuesstionFromStudent);
router.post('/studentGetQuestionFromMe', checkToken, studentGetQuestionFromMe);


module.exports = router;