const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartDetail'
  }],
  totalPrice: {
    type:Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;