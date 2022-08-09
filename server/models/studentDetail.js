const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentDetails = new Schema({
    studentId:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required:true
    },
    dateOfBirth:{
        type: Date,
        required:true
    }
});

module.exports = mongoose.model('student', studentDetails);