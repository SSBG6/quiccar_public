const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidSchema = new Schema ({
    aucid: {
        type: String,
        required: true,
    },
    bidid: {
        type: String,
        required: true,
        unique:true
    },
    uid: {
        type: String,
        required: true,
    },
    bid: {
        type: Number, // Modified to accept number input
        required: true,
    },
    created: {
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('bid',bidSchema);