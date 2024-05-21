const CommentModel = require('../models/comment');

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        
        try {
            // Find and delete the vehicle with the specified ID
            const deleteComment = await CommentModel.findOneAndDelete({ cid: id });
            if (!deleteComment) {
                // If the vehicle was not found, return a 404 status and an error message
                return res.status(404).json({ message: "comment not found" });
            }
            // If the vehicle was successfully deleted, redirect to the '/profile' page
            res.redirect('/profile');
        } catch (error) {
            // If an error occurs during the deletion process, log the error and return a 500 status and an error message
            console.error("Error deleting cimment:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
