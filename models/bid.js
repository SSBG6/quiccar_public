const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidSchema = new Schema ({
    auc: {
        type: String,
        required: true,
    },
    bidid: {
        type: String,
        required: true,
        unique:true
    },
    biduid: {
        type: String,
        required: true,
    },
    bid: {
        type: String,
        required: true,
    },
    created: {
        type:String,
        required:true,
    },
});

module.exports = mongoose.model('bid',bidSchema);