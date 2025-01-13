const mongoose = require('mongoose');

const cartDetailSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const CartDetail = mongoose.model('CartDetail', cartDetailSchema);
module.exports = CartDetail;