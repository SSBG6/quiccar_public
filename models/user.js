const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    userid: {
        type: String,
        required: true,
        unique:true
    },
    username: {
        type: String,
        required: true,
        unique:true
    },
    email : {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    created: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('user',userSchema);