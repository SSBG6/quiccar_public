const AuctionModel = require('../models/auction');

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        
        try {
            const deletedAuction = await AuctionModel.findOneAndDelete({ vid: id });
            if (!deletedAuction) {
                return res.status(401).send('<script>alert("Doesnt Exist or Already Deleted"); window.location.href="/myv";</script>');
            }
            res.status(401).send('<script>alert("Auction Terminated Deleted"); window.location.href="/myv";</script>');
        } catch (error) {
            console.error("Error deleting auction:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
