const AuctionModel = require('../models/auction');

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        
        try {
            const deletedAuction = await AuctionModel.findOneAndDelete({ auctionId: id });
            if (!deletedAuction) {
                return res.status(404).json({ message: "Auction not found" });
            }
            res.redirect('/profile');
        } catch (error) {
            console.error("Error deleting auction:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
