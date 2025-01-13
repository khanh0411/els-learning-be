const mongoose = require('mongoose');

const lessionSchema = new mongoose.Schema({
    section_id: { type: mongoose.Schema.ObjectId, ref:'Section',required: true },
    title: { type: String, required: false },
    video_url: { type: String, required: false },
    order_Number: { type: Number, required: true },
}, { timestamps: true });
const Lesson = mongoose.model('Lession', lessionSchema);
module.exports = Lesson;
