const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    userid: {
        type: String,
        required: true,
        unique:true
    },
    comment: {
        type: String,
        required: true,
        unique:true
    },
    created : {
        type: String,
        unique:true,
    },
    reply: {
        type:Boolean,
        required:true,
    },
    replyid: {
        type: String,
        required: true,
    },
    artid: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('comment',commentSchema);