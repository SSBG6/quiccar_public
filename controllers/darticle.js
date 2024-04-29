const ArticleModel = require('../models/article');

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        
        try {
            const deletedArticle = await ArticleModel.findOneAndDelete({ artid: id });
            if (!deletedArticle) {
                return res.status(404).json({ message: "Article not found" });
            }
            res.redirect('/profile');
        } catch (error) {
            console.error("Error deleting article:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
