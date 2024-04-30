const crypto = require('crypto');
const AuctionModel = require("../models/auction.js");
const BidModel = require("../models/bid.js");
const moment = require('moment');
const UserModel = require("../models/user.js"); // Assuming UserModel is imported from user.js

// Function to generate a unique user ID
const genid = () => crypto.randomBytes(5).toString('hex');

module.exports = {
    post: async (req, res) => {
        const { cbid, idauc } = req.body;
        const { userid } = req.session;
    
        // Assuming you have a session variable for email
        const auc = await AuctionModel.findOne({ aucid:idauc });
        if (!auc) {
            return res.redirect('/auction');
        }
        if (auc.status === 'closed') {
            return res.status(401).send('<script>alert("Auction Has Concluded"); window.location.href="/auct";</script>');
        }

        const user = await UserModel.findOne({ userid:userid });
            if (!user) {
                return res.redirect('/login');
            }
        const bids = await BidModel.find({ aucid:idauc });
        // Generate unique bid ID
        const gbidid = genid();
        //highest bid
        if (bids.length > 0) {
            if (cbid > bids[bids.length-1].bid) {
                auc.hbid = gbidid;
                await auc.save();
            } else {
                auc.hbid = gbidid;
                await auc.save();
            }
        }
        // Save the article to the database
        const bid = new BidModel({
            aucid: auc.aucid,
            bidid: gbidid,
            uid: user.userid,
            bid: cbid,
            created: moment().format('MMMM Do YYYY, h:mm:ss a'),
            // Any other fields you may have in your ArticleModel
        });

        await bid.save();
        res.redirect(`/auction?id=${auc.aucid}`); // Redirect to a page showing all articles
    }
}

