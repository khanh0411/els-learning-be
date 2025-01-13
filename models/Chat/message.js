const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    isQuestion: {
        type: Boolean,
        default: true,
        
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


const Message = mongoose.model('Message', messageSchema);

module.exports = Message;