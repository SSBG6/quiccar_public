const mongoose = require("mongoose");
const { Schema } = mongoose;

const vehicleSchema = new Schema ({
    files:{
        type: [String],
        required: false
    },
    vid: {
        type: String,
        required: true,
        unique:true
    },
    uid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required:false
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    trim: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    regyear: {
        type: Number,
        required: true
    },
    plate: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    negotiable: {
        type: String,
    },
    condition: {
        type: String,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },    
    exterior: {
        type: String,
        required: true
    },
    interior: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }, 
    time: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('vehicle',vehicleSchema);