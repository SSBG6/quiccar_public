const VehicleModel = require('../models/vehicle');
const bcrypt = require('bcryptjs');


module.exports = {
    post: async (req, res) => {
        try {
            const { title, time, make, model, trim, year, reg, plate, mileage, condition, exterior, interior, location, description, price, files, vid} = req.body;
            
            const vehicle = await VehicleModel.findOne({ vid:vid });
            if (!vehicle) {
                return res.status(401).send('<script>alert("no vehicle found"); window.location.href="/profile";</script>');
            }
            vehicle.title = title;
            vehicle.time = time;
            vehicle.make = make;
            vehicle.model = model;
            vehicle.trim = trim;
            vehicle.year = year;
            vehicle.reg = reg;
            vehicle.plate = plate;
            vehicle.mileage = mileage;
            vehicle.condition = condition;
            vehicle.exterior = exterior;
            vehicle.interior = interior;
            vehicle.location = location;
            vehicle.description = description;
            vehicle.price = price;
            
            

            await vehicle.save();
            console.log('Data updated successfully');
            return res.redirect('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            return res.status(500).send('Error updating profile');
        }
    }
}
