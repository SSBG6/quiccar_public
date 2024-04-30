module.exports = {
    post : async (req, res) => {
        try {
            const { password, password1, password2 } = req.body;
            const UserModel = require("../models/user");
            const bcrypt = require('bcryptjs');
            const uid = req.session.userid;
            // Validate if new passwords match
            if (password1 !== password2) {
                return res.status(401).send('<script>alert("Passwords Do not Match"); window.location.href="/settings";</script>');
            }
    
            // Retrieve the user based on the session username
            const user = await UserModel.findOne({ userid: uid});
    
            if (!user) {
                return res.status(401).send('<script>alert("User Not Signed in"); window.location.href="/login";</script>');
            }
    
            // Validate the current password (password1) before allowing changes
            const isPasswordValid = await bcrypt.compare(password, user.password);
    
            if (!isPasswordValid) {
                return res.status(401).send('Incorrect current password');
            }
    
            // Check if a new password is provided and update it
            if (password1 && password2) {
                if (password!=password2){
                    const hashedNewPassword = await bcrypt.hash(password2, 12);
                    user.password = hashedNewPassword;
                } else {
                    return res.status(401).send('<script>alert("Current Password and New Password identical"); window.location.href="/settings";</script>');
                }
            }
    
            console.log('Changes have been applied');
            // Save the updated user data to the database
            await user.save();
    
            // Redirect to the profile page or any other suitable route after successful update
            res.redirect('/logout');
        } catch (error) {
            console.log('Error updating profile:', error);
            res.status(500).send('Error updating profile');
        }
    }}