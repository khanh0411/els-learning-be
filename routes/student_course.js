const express = require('express');
const router = express.Router();
const { joinCourseWithCoin, joinCourseWithCode, updateRechargeStatus, rechargeAccount, Invoicing, listUser, joinCourseWithTeacher, listStudentCourse, deleteStudentCourse, updateProgress, listPurchaseHistory, withdrawalAccount, joinCoursesInCart } = require('../controllers/studentCourseController');
const { checkToken, checkAdmin, checkTeacher } = require('../middleware/checkToken');



router.post('/joinCourseWithCoin', checkToken, joinCourseWithCoin);
router.post('/joinCourseWithCode', checkToken, joinCourseWithCode);

router.post('/joinCourseWithTeacher', checkToken, checkTeacher,joinCourseWithTeacher);
router.post('/listUser', checkToken,checkTeacher,listUser);
router.post('/deleteStudentCourse', checkToken,checkTeacher,deleteStudentCourse);
router.post('/updateProgress',checkToken,updateProgress)

router.post('/joinCoursesInCart', checkToken, joinCoursesInCart);

router.post('/listStudentCourse', checkToken, listStudentCourse);
router.get('/listStudentCourse', checkToken, listStudentCourse);










router.post('/rechargeAccount', checkToken, rechargeAccount);
router.post('/withdrawalAccount', checkToken, withdrawalAccount);

router.post('/listPurchaseHistory', checkToken, listPurchaseHistory);
router.post('/updateRechargeStatus', checkToken,checkAdmin ,updateRechargeStatus);
router.post('/Invoicing', checkToken, Invoicing);

module.exports = router;