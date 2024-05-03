const UserModel = require('../models/user'); // Import UserModel

module.exports = {
    post: async (req, res) => {
        const name = req.query.id;
        console.log(name);
        try {
            const users = await UserModel.findOne({ username: name });
            if (!users) {
                return res.status(401).send('<script>alert("No User Found"); window.location.href="/";</script>');
            }
            const data = {
                username: user.phone,
                phone: vehicle.files,
            };
            res.redirect(`/user?id=${username}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};
