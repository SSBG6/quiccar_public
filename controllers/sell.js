const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const crypto = require('crypto');
const UserModel = require("../models/user.js");
const VehicleModel = require('../models/vehicle');

// Initialize AWS SDK
AWS.config.update({
    accessKeyId: 'AKIAQ3EGV4R2Y7WVNSXL',
    secretAccessKey: 'X04VTTWNyqdReJ7vv6tqtP1O6dJ/mbr0noXpR7L2',
    region: 'Asia Pacific (Mumbai) ap-south-1' // Specify the AWS region where your S3 bucket is located
});

const s3 = new AWS.S3();

// Configure Multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 100MB
});

// Function to generate a unique vehicle ID
const generateVid = () => crypto.randomBytes(5).toString('hex');

// Route handler for POST requests
const post = async (req, res, next) => {
    try {
        // Handle file uploads
        upload.array('images', 5)(req, res, async (err) => {
            if (err) {
                console.error('Error uploading files:', err);
                return res.status(400).send('Error uploading files');
            }

            // Ensure req.files is populated
            if (!req.files || req.files.length === 0) {
                console.error('No files uploaded');
                return res.status(400).send('No files uploaded');
            }

            console.log('Uploaded files:', req.files);
            const { make, model, trim, title, year, regyear, price, negotiable, plate, condition, mileage, exterior, interior, location } = req.body;
            const { userid } = req.session;

            // Check if user is logged in
            const user = await UserModel.findOne({ userid });
            if (!user) {
                return res.redirect('/login');
            }

            // Generate unique vehicle ID
            const vid = generateVid();
            const files = req.files;

            // Upload images to S3
            const fileUploadPromises = files.map(file => {
                const destinationFilename = `${vid}_${file.originalname}`;
                const params = {
                    Bucket: 'myqucckt',
                    Key: destinationFilename,
                    Body: file.buffer,
                    ContentType: file.mimetype
                };
                return s3.upload(params).promise();
            });
        
            await Promise.all(fileUploadPromises);
        
            // Create a new vehicle instance
            const newVehicle = new VehicleModel({
                vid,
                uid: userid,
                title,
                make,
                model,
                trim,
                year,
                regyear,
                plate,
                price,
                negotiable,
                condition,
                mileage,
                exterior,
                interior,
                location,
                time: moment().format('YYYY-MM-DD HH:mm:ss')
            });

            // Save the vehicle to the database
            await newVehicle.save();

            // Redirect to the product page
            res.redirect(`/product?id=${vid}`);
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send(`An error occurred while processing your request: ${error.message}`);
    }
};

module.exports = { post };
