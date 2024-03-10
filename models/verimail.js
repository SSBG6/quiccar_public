const mongoose = require("mongoose");
const { Schema } = mongoose;

const verificationSchema = new Schema ({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }    
});

module.exports = mongoose.model('verimail',verificationSchema);