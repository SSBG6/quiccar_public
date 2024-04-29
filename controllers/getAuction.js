const VehicleModel = require('../models/vehicle'); // Import VehicleModel
const UserModel = require('../models/user'); // Import UserModel
const AuctionModel = require('../models/auction');

module.exports = {
    post: async (req, res) => {
        const auctid = req.query.id;
        
        try {
            const auctid = await AuctionModel.findOne({ aucid: auctid });
            if (!auctid) {
                return res.status(404).send('Auction not found');
            }
            const vech = await VehicleModel.findOne({ vid:vid });
            if (!vech) {
                return res.status(404).send('Vechicle not found');
            }
            const user = await UserModel.findOne({ userid: auctid.oid});
            if (!user) {
                return res.status(404).send('User not found');
            }
            const data = {
                user: user.username,
                status: auctid.status,
                created:  auctid.created,
                time:   auctid.time,
                reserve: auctid.reserve,
                bid: auctid.bid,
                files: vehicle.files,
                title: vehicle.title,
                time: vehicle.time,
                name: user.username,
                make: vehicle.make,
                model: vehicle.model,
                trim: vehicle.trim,
                year: vehicle.year,
                ryear: vehicle.regYear,
                plate: vehicle.plate,
                mileage: vehicle.mileage,
                condition: vehicle.condition,
                exterior: vehicle.exterior,
                interior: vehicle.interior,
                location: vehicle.location,
                description: vehicle.description,
                price: vehicle.price,
            };
            res.render('auction', data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};
