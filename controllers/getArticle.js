const ArticleModel = require('../models/article'); // Import articleModel
const UserModel = require('../models/user'); // Import UserModel

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        try {
            const  article = await ArticleModel.findOne({ artid: id});
            const user = await UserModel.findOne({ userid: article.userid});
            console.log(article);
            if (!article) {
                return res.status(404).send('Comminity Article not found');
            }
            const data = {
                user: user.username,
                title: article.title,
                content: article.content,
                time: article.created,
                tags: article.tags,
            };
            res.render('article', data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};
