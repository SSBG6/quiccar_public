const AuctionModel = require('../models/auction');
const BidModel = require('../models/bid');
module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        const auction = await AuctionModel.findOne({ vid: id });
        try {
            const deletedAuction = await AuctionModel.findOneAndDelete({ vid: id });
            const deletedBids = await BidModel.deleteMany({ aucid: auction.aucid });
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
