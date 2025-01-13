const mongoose = require('mongoose');

const category = new mongoose.Schema({

    name:{
        type: String,
        required: false
    },
    description:{
        type: String,
        required: false
    },
});

module.exports = mongoose.model('categories', category);
