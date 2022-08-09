const mongoose = require("mongoose");
const { Schema } = mongoose;

const userCredential = new Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    },
    expiryDate:{
        type: Date,
        default:(Date.now()+(30 * 24 * 60 * 60 * 1000))
    }
});

module.exports = mongoose.model('userCredential', userCredential);