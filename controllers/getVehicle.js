const VehicleModel = require('../models/vehicle'); // Import VehicleModel
const UserModel = require('../models/user'); // Import UserModel

module.exports = {
    post: async (req, res) => {
        const vid = req.query.id;
        console.log(vid);
        try {
            const vehicle = await VehicleModel.findOne({ vid });
            if (!vehicle) {
                return res.status(404).send('Vehicle not found');
            }
            const user = await UserModel.findOne({ userid: vehicle.uid});
            if (!user) {
                return res.status(404).send('User not found');
            }
            const data = {
                title: vehicle.title,
                time: vehicle.time,
                name: user.username,
                make: vehicle.make,
                model: vehicle.model,
                trim: vehicle.trim,
                year: vehicle.year,
                regYear: vehicle.regYear,
                plate: vehicle.plate,
                mileage: vehicle.mileage,
                condition: vehicle.condition,
                exterior: vehicle.exterior,
                interior: vehicle.interior,
                location: vehicle.location,
                description: vehicle.description,
                price: vehicle.price,
                negotiable: vehicle.negotiable
            };
            res.render('product', data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};
