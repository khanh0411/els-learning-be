const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    course_id: { type: mongoose.Schema.ObjectId,ref:"Course", required: true },
    title: { type: String, required: true },
    order_Number: { type: Number, required: true },
    lession: [{ type: mongoose.Schema.ObjectId, ref:'Lession' }]
}, { timestamps: true });

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;