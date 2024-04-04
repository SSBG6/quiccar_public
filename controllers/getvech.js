const VehicleModel = require('../models/vehicle'); // Import VehicleModel
const UserModel = require('../models/user'); // Import UserModel

module.exports = {
    post: async (req, res) => {
        const skip = parseInt(req.query.skip) || 0; // Get the number of records to skip
        try {
            const vehicles = await VehicleModel.find().skip(skip).limit(10); // Limit the results to 10 vehicles
            if (!vehicles || vehicles.length === 0) {
                return res.status(404).send('No more vehicles found');
            }
            
            const data = vehicles.map(vehicle => ({
                vid: vehicle.vid,
                title: vehicle.title,
                time: vehicle.time,
                year: vehicle.year,
                regYear: vehicle.regYear,
                mileage: vehicle.mileage,
                location: vehicle.location,
                price: vehicle.price,
            }));
            
            res.json({ vehicles: data });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};
