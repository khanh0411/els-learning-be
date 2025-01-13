const mongoose = require('mongoose');

const student_course = new mongoose.Schema({
    course_id: { type: mongoose.Schema.ObjectId, required: true },
    user_id: {type: mongoose.Schema.ObjectId, required: true}, 
    progress: {type: Number, required: false,default:0},
    list_completed: {type: Array, required: false,default:[]},  
}, { timestamps: true });

const StudentCourse= mongoose.model('student_course', student_course);
module.exports = StudentCourse;



