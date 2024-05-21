const ArticleModel = require('../models/article'); // Import articleModel
const UserModel = require('../models/user'); // Import UserModel
const CommentModel = require('../models/comment'); // Import CommentModel

module.exports = {
    post: async (req, res) => {
        const id = req.query.id;
        try {
            const article = await ArticleModel.findOne({ artid: id });
            const user = await UserModel.findOne({ userid: article.userid });
            const comments = await CommentModel.find({ artid: id });
            console.log(comments);
            if (!article) {
                return res.status(404).send('Community Article not found');
            }
            if (!user) {
                return res.status(404).send('User not found');
            }
            const newData = {
                id: article.artid,
                title: article.title,
                content: article.content,
                time: article.created,
                tags: article.tags,
                username: user.username,
            };
            let newComments = [];
            for(let comment of comments){
                const usernames = await UserModel.findOne({ userid: comment.uid });
                console.log(usernames);
                newComments.push({...comment._doc, uname: usernames.username})
            }
            res.render('article', { data: newData, cdata: newComments});
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};
