const VehicleModel = require('../models/vehicle'); // Import VehicleModel
const UserModel = require('../models/user'); // Import UserModel
const AuctionModel = require('../models/auction');
const BidModel = require('../models/bid');
const moment = require('moment');
const auction = require('../models/auction');
module.exports = {
    post: async (req, res) => {
        const auctionid = req.query.id;
        
        try {
            const auctid = await AuctionModel.findOne({ aucid: auctionid });
            if (!auctid) {
                return res.status(404).send('Auction not found');
            }
            const vehicle = await VehicleModel.findOne({ vid: auctid.vid });
            if (!vehicle) {
                return res.status(404).send('Vechicle not found');
            }
            const user = await UserModel.findOne({ userid: auctid.oid});
            if (!user) {
                return res.status(404).send('User not found');
            }
            const bids = await BidModel.find({ aucid: auctionid });
            if (bids.length > 0) {
                var highestBid = bids[0].bid;
                for (let i = 1; i < bids.length; i++) {
                    if (bids[i].bid > highestBid) {
                        highestBid = bids[i].bid;
                    }
                }
                const hbid = highestBid;
            } else if (bids.length == 0) {
                highestBid = "No Bids Yet";
            }
            //time 
            const currentTime = moment(); 
            const auctionEndTime = moment(auctid.created).add(auctid.time, 'hours');
            const timeLeft = moment.duration(auctionEndTime.diff(currentTime)).humanize();
            const duration = moment.duration(auctionEndTime.diff(currentTime));
            const hoursLeft = duration.hours();
            const minutesLeft = duration.minutes();
            const secondsLeft = duration.seconds();
            if (hoursLeft === 0 && minutesLeft === 0 && secondsLeft === 0) {
                auctid.status = 'closed';
                await auctid.save();
            }

            if (auctid.status === 'closed') {
                let highestBidderId;

                if (bids.length > 0) {
                    let highestBid = bids[0].bid;
                    highestBidderId = bids[0].uid; // Initialize highestBidderId with the bidder ID of the first bid

                    for (let i = 1; i < bids.length; i++) {
                        if (bids[i].bid > highestBid) {
                            highestBid = bids[i].bid;
                            highestBidderId = bids[i].uid; // Update highestBidderId if a higher bid is found
                        }
                    }
                } else if (bids.length === 0) {
                    highestBid = "No Bids";
                }

                // Now highestBidderId contains the ID of the highest bidder
                console.log("Highest bidder ID:", highestBidderId);
                if (highestBidderId) {
                    
                    auctid.highestbidder = highestBidderId;
                    await auctid.save();
                    console.log(auctid.highestbidder);
                }
            }

            console.log(timeLeft);
            console.log(highestBid);
            const data = {
                highestbidder: auctid.highestbidder,
                hbid: highestBid,
                id: auctid.aucid,
                user: user.username,
                status: auctid.status,
                created:  auctid.created,
                time:   timeLeft,
                reserve: auctid.reserve,
                files: vehicle.files,
                title: auctid.title,
                make: vehicle.make,
                model: vehicle.model,
                trim: vehicle.trim,
                year: vehicle.year,
                ryear: vehicle.regyear,
                plate: vehicle.plate,
                mileage: vehicle.mileage,
                condition: vehicle.condition,
                exterior: vehicle.exterior,
                interior: vehicle.interior,
                location: vehicle.location,
                description: vehicle.description,
            };
            const remainingTime = {
                hours: hoursLeft,
                minutes: minutesLeft,
                seconds: secondsLeft
            };
            res.render('auction', { data: data, remainingTime: remainingTime});
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};
