const UserModel = require("../models/user.js");
const VehicleModel = require('../models/vehicle');
const AuctionModel = require('../models/auction');

const crypto = require('crypto');

// Function to generate a unique user ID
const genaucId = () => crypto.randomBytes(5).toString('hex');

module.exports = {
    post: async (req, res) => {
    
        const { vid, duration,reserve } = req.body;
        
        const { userid } = req.session;
        // Assuming you have a session variable for email
        const vehi = await VehicleModel.findOne({ uid:userid });
        const existingvid = await AuctionModel.findOne({ vid: vid });

        if (existingvid) {
            return res.status(401).send('<script>alert("This Vehicle is in an Active Auction Already"); window.location.href="/myv";</script>');
        }
        // Generate unique article ID
        const aucid = genaucId();
        // Save the article to the database
        const auction = new AuctionModel({
            title: vehi.title + " #" + vehi.vid,
            aucid: aucid,
            vid: vehi.vid,
            oid: userid,    
            status: 'active', 
            created: new Date(), // Current date and time
            time: duration,
            reserve: reserve,
        });

        await auction.save();
        res.redirect(`/auction?id=${aucid}`); // Redirect to a page showing all articles
    }
}

