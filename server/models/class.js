const mongoose = require("mongoose");
const { Schema } = mongoose;

const classDetails = new Schema({
    className:{
        type: String,
        required: true
    },
    year:{
        type:Date,
        required:true
    },
    classTeacher:{
        type:String,
        required:true
    },
    subjectLists:{
        type: Array,
        required: true
    },
    students:{
        type: Object,
        required: true
    },
});

module.exports = mongoose.model('classes', classDetails);