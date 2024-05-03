const UserModel = require("../models/user.js");
const CommentModel = require("../models/comment.js");

const crypto = require('crypto');

// Function to generate a unique user ID
const genaucId = () => crypto.randomBytes(5).toString('hex');

module.exports = {
    post: async (req, res) => {
        
        const { artid, comment} = req.body;
        
        const { userid } = req.session;
        console.log(userid, comment);
       const user = await UserModel.findOne({ userid });
        if (!user) {
            return res.status(401).send('<script>alert("Login to comment"); window.location.href="login";</script>');
        }
        // Generate unique article ID
        const cid = genaucId();
        // Save the article to the database
        const ncomment = new CommentModel({
            artid: artid,
            uid: userid,
            cid: cid,
            comment: comment,
            created: new Date(), // Current date and time
        });
        await ncomment.save();
        res.redirect(`/article?id=${artid}`); // Redirect to a page showing all articles
    }
}

