const VehicleModel = require('../models/vehicle');

module.exports = {
    post: async (req, res) => {
        const vid = "b838dbe226";
        console.log(vid);
        try {
            const vehicle = await VehicleModel.findOne({ vid });
            if (!vehicle) {
                console.log('Vehicle not found');
            } else {
                console.log('Data posted successfully');
            }
    
        } catch (error) {
            console.error('Internal Server Error:', error);
        }
    }
};
