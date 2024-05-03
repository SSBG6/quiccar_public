const crypto = require('crypto');
const ArticleModel = require("../models/article.js");
const moment = require('moment');
const UserModel = require("../models/user.js");
const bcrypt = require('bcrypt');

const generateArticleId = () => crypto.randomBytes(5).toString('hex');

module.exports = {
    post: async (req, res) => {
        const { title, text, tags } = req.body;
        
        const { userid } = req.session;
      
        const user = await UserModel.findOne({ userid:userid });
            if (!user) {
                return res.redirect('/login');
            }

        
    
        const articleId = generateArticleId();

 
        const article = new ArticleModel({
            userid: user.userid,
            title:title,
            artid:articleId,
            content:text,
            created: moment().format('MMMM Do YYYY, h:mm:ss a'),
            tags:tags,
         
        });

        await article.save();
        res.redirect(`/article?id=${articleId}`); 
    }
}

