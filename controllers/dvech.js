const VehicleModel = require('../models/vehicle'); // Import VehicleModel
const AuctionModel = require('../models/auction'); // Import AuctionModel

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        
        try {
            const deletedVehicle = await VehicleModel.findOneAndDelete({ vid: id });
            const delauc = await AuctionModel.findOneAndDelete({ vid: id });
            console.log(deletedVehicle);
            if (!deletedVehicle) {
                return res.status(404).json({ message: "Vehicle not found" });
            }
            res.redirect('/profile');
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
