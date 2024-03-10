const bcrypt = require('bcryptjs');
const VerificationModel = require("../models/verimail.js");

module.exports = {
    post: async (req, res) => {
        const { email } = req.session;
        let verimail = await VerificationModel.findOne({ email });
        const { code } = req.body;
    
        if (!email || !verimail.token) {
            await VerificationModel.findOneAndDelete({ email });
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error destroying session:", err);
                    return res.redirect('/error-page');
                }
                console.log("Session destroyed Due to no email in session or token in db");
                res.redirect('/error-page');
            });
  
        } else {
                       
            if (code === verimail.token) {
                // Now user is authenticated
                req.session.vemail = email;
                await VerificationModel.findOneAndDelete({ email });
                res.redirect('/signup');
            } else {
                await VerificationModel.findOneAndDelete({ email });
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err);
                        return res.redirect('/error-page');
                    }
                    console.log("Session destroyed");
                    res.redirect('/signup-verification-code');
                });
            }
        }

    }};

