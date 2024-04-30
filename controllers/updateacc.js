const UserModel = require("../models/user");
const bcrypt = require('bcryptjs');

module.exports = {
    post: async (req, res) => {
        try {
            const { username, password, phone, email } = req.body;
            const uid = req.session.userid;

            const user = await UserModel.findOne({ userid: uid });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).send('<script>alert("Invalid password"); window.location.href="/settings";</script>');
            }

            user.username = username;
            user.email = email;
            user.phone = phone;

            await user.save();

            return res.redirect('/settings');
        } catch (error) {
            console.error('Error updating profile:', error);
            return res.status(500).send('Error updating profile');
        }
    }
}
