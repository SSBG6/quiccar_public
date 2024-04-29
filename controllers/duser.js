const UserModel = require('../models/user');

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        
        try {
            const deletedUser = await UserModel.findOneAndDelete({ userId: id });
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.redirect('/profile');
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
