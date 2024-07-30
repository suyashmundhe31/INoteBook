const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
    name: {
        type : String,
        required : true ,
        unique: false
    },
    desc: {
        type : String,
        required : false,
        unique: false
    },
    tag: {
        type : String,
        default: 'General'    
    },
    date: {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('notes', NotesSchema); 