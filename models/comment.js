const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    uid: {
        type: String,
        required: true,
    },
    cid:{
        type: String,
        required: true,
        unique:true
    },
    comment: {
        type: String,
        required: true,
    },
    created : {
        type: String,
        
    },
    artid: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('comment',commentSchema);