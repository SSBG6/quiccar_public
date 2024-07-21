const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const JWT_SECRET = require('../controllers/config');

module.exports = {
    post: async (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            // Generate a jwt token 
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
            
            // Setup nodemailer 
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'willrisetothetop@gmail.com',
                    pass: 'xxxx xxxx xxxx xxxx'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // Construct email message
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
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);

            req.session.email = email;
            return res.redirect('/signup-verification-code');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};
