const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imgSchema = new Schema ({
    data:{
        type: [String],
        required: false
    }
    });
module.exports = mongoose.model('img',imgSchema);