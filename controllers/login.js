module.exports = {
    post: async (req, res) => {
        const UserModel = require("../models/user");
        const bcrypt = require('bcryptjs');
        const { cred, password } = req.body;

        console.log("cred:", cred); // Log the value of cred
        let user = await UserModel.findOne({ email: cred });
     
        if (!user) {
            // If no user found with the provided email, try to find by username
            user = await UserModel.findOne({ username: cred });
        }
      
        if (!user) {
            return res.redirect('/login');
        }
        
        // Check password
        const match = await bcrypt.compare(password, user.password);
    
        if (!match) {
            console.log("Password does not match");
            return res.redirect('/login');
        }
        // Now user is authenticated
        req.session.userid = user.userid;
        console.log("Logged in as:", user.username);
        res.redirect('/');
    }
}
