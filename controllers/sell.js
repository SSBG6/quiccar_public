const VehicleModel = require('../models/vehicle');
const UserModel = require("../models/user.js");
const moment = require('moment');
const crypto = require('crypto'); 
const vehicle = require('../models/vehicle');

//time
const currentDateAndTime = moment();
const formattedDateTime = currentDateAndTime.format('YYYY-MM-DD HH:mm:ss');


module.exports = {
    post: async (req, res) => {
        const { make, model, trim, title, year, regyear, price, negotiable,plate, condition, mileage, exterior, interior, location} = req.body;
        const userid = req.session.userid;
        let user = await UserModel.findOne({ userid }); 
        if (!user) {
            return res.redirect('/login');
        }
        // Generate unique user VID (vehicle id lol)
        const vid = generateVid();
        console.log(userid);

        
        const vehicle = new VehicleModel({
            vid,
            uid: userid,
            title,
            make,
            model,
            trim,
            year,
            regyear,
            plate,
            price,
            negotiable,
            condition,
            mileage,
            exterior,
            interior,
            location,
            time:formattedDateTime
        });
        console.log(vid);
        await vehicle.save();
        res.redirect(`/product/${vid}`);

    }
}

// Function to generate vid
function generateVid() {
    const buffer = crypto.randomBytes(24);
    return buffer.toString('hex');
}
