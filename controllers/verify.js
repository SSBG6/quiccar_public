const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../controllers/configjwt')
module.exports = {
    post: async (req, res) => {
        const { email } = req.session;

        try {
            const { code } = req.body;

            // Verify the JWT token
            const decoded = jwt.verify(code, JWT_SECRET);

            // Extract the email address from the decoded token
            const decodedEmail = decoded.email;

            if (email === decodedEmail) {
                // Email address matches the one stored in the session, mark email as verified
                req.session.vemail = email;
                return res.redirect('/signup');
            } else {
                // Email address does not match, destroy session and redirect to verification page
                await req.session.destroy();
                console.log("Session destroyed because email address does not match");
                return res.redirect('/signup-verification-code');
            }
        } catch (error) {
            // Handle invalid or expired token
            console.error("An error occurred while verifying the token:", error);
            await req.session.destroy();
            return res.redirect('/error-page');
        }
    }
};
