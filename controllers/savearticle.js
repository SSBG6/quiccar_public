const crypto = require('crypto');
const ArticleModel = require("../models/article.js");
const moment = require('moment');
const UserModel = require("../models/user.js"); // Assuming UserModel is imported from user.js
const bcrypt = require('bcrypt');

// Function to generate a unique user ID
const generateArticleId = () => crypto.randomBytes(5).toString('hex');

module.exports = {
    post: async (req, res) => {
        const { title, text, tags } = req.body;
        
        const { userid } = req.session;
        // Assuming you have a session variable for email
        const user = await UserModel.findOne({ userid:userid });
            if (!user) {
                return res.redirect('/login');
            }

        
        // Generate unique article ID
        const articleId = generateArticleId();

        // Save the article to the database
        const article = new ArticleModel({
            userid: user.userid,
            title:title,
            artid:articleId,
            content:text,
            created: moment().format('MMMM Do YYYY, h:mm:ss a'),
            tags:tags,
            // Any other fields you may have in your ArticleModel
        });

        await article.save();
        res.redirect(`/article?id=${articleId}`); // Redirect to a page showing all articles
    }
}

