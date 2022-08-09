const mongoose = require("mongoose");
const { Schema } = mongoose;

const userCredential = new Schema({
    userId:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    },
    expiryDate:{
        type: Date,
        required:true
    }
});

module.exports = mongoose.model('userCredential', userCredential);