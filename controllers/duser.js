const UserModel = require('../models/user');
const BidModel = require('../models/bid');
const AuctionModel = require('../models/auction');
const VehicleModel = require('../models/vehicle');
const CommentModel = require('../models/comment');
module.exports = {
    post: async (req, res) => {
        const id = req.session.userid;
        console.log(req.session.userid, "ok ig")
        try {
            const deletedUser = await UserModel.deleteMany({ userId: id });
            if (deletedUser) {
                try {
                    const deletedBids = await BidModel.deleteMany({ uid: id});
                    const deletedAuctions = await AuctionModel.deleteMany({ oid: id });
                    const deletedVehicles = await VehicleModel.deleteMany({ uid: id });
                    const deletedComments = await CommentModel.deleteMany({ uid: id });
                }
                catch (error) {
                    console.error("Error deleting user:", error);
                    return res.status(500).json({ message: "Internal server error" });
            }}
           
            if (!deletedUser) {
                return res.status(404).json({ message: "Rec not found" });
            }
            return res.status(401).send('<script>alert("Acc Deleted"); window.location.href="/login";</script>');
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
