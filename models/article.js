const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema ({
    userid: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    artid: {
        type: String,
        required: true,
        unique:true
    },
    content : {
        type: String,
        required: true,
    },
    created: {
        type:String,
        required:true,
    },
    tags: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('article',articleSchema);