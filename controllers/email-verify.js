const VerificationModel = require("../models/verimail.js");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const UserModel = require("../models/user.js");

module.exports = {
    post: async (req, res) => {
        const { email } = req.body;
        let user = await UserModel.findOne({ email }); 
        if (user) {
            res.send("User already exists");
            return res.redirect('/signup-email');
        }
        const token = crypto.randomBytes(4).toString('hex');
    
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'willrisetothetop@gmail.com', // mail
                pass: 'qpsf bteo uccg lefw' // app pass
            }
        });

        // Email content
        let mailOptions = {
            from: 'willrisetothetop@gmail.com',
            to: email,
            subject: 'Quiccar: Email Verification',
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <p>Hello,</p>
                <p>To verify your email, please use the following code;</p>
                <div class="box" style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); margin: 0 auto; width: fit-content;">
                <h1><strong style="color: #333;">${token}</strong></h1>
                </div>
                <p>Thank you</p>
                <p>Team Quiccar,</p>
           </div>`
        };

        // Sending email
        transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
                console.log(error);
                // Handle error
                res.redirect('/error-page');
            } else {
                console.log('Email sent: ' + info.response);
                try {
                    const verimail = new VerificationModel({
                    email,
                    token: token,
                    });
                    await verimail.save();
                    req.session.email = email;
                    res.redirect('/signup-verification-code');
                } catch (err) {
                    console.error(err);
                    // Handle error
                    res.redirect('/error-page');
                }
            }
        });
    }
};
