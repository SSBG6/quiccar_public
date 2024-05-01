const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    aucid: {
        type: String,
        required: true,
        unique:true
    },
    vid: {
        type: String,
        required: true,
    },
    oid: { // Owner ID
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    created: {
        type:String,
        required:true,
    },
    time: {
        type:String,
        required:true,
    },
    reserve: {
        type:Number,
        required:true,
    },
    highestbidder: {
        type:String,
        required:false,
    },
});

module.exports = mongoose.model('auction',auctionSchema);