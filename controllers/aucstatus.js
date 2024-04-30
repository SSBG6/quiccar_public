const AuctionModel = require('../models/auction');
const UserModel = require('../models/user');

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        const { userid } = req.session;

        try {
            // Find the auction
            const auction = await AuctionModel.findOne({ aucid: id });

            // Check if the auction exists
            if (!auction) {
                return res.status(404).send('<script>alert("No such auction found"); window.location.href="/profile";</script>');
            }

            // Check if the auction status is 'active'
            if (auction.status === 'active') {
                // If yes, change it to 'closed'
                auction.status = 'closed';
            } else {
                // If not, change it to 'active'
                auction.status = 'active';
            }
            await auction.save();

            // Find the user
            const user = await UserModel.findOne({ userid: auction.oid });

            // Check if the user exists
            if (!user) {
                return res.status(401).send('<script>alert("User not authorized"); window.location.href="/myauc";</script>');
            }

            // Return a success response
            return res.status(200).send('<script>alert("Auction status updated successfully"); window.location.href="/profile";</script>');

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
