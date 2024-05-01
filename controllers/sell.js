const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const crypto = require('crypto');
const UserModel = require("../models/user.js");
const VehicleModel = require('../models/vehicle');

// Initialize AWS SDK
AWS.config.update({
    accessKeyId: 'AKIAQ3EGV4R2Q6CQK3GN',
    secretAccessKey: 'Z1QreqMaaAPeONKQo/+fvdkQz6ZzB/oLJp2spQJJ',
    region: 'ap-south-1' // Specify the AWS region where your S3 bucket is located
});

const uploadedFiles = []; // Array to store objects with filepath:score

const uploadPath = path.join(__dirname, 'uploads');

const s3 = new AWS.S3();

// Configure Multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 100MB
});
//ai python yolo
const runPythonScript = (filePath) => {
    return new Promise((resolve, reject) => {
        exec(`python ip.py "${filePath}"`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                const score = parseFloat(stdout); // Assuming the output is a score
                resolve(score);
            }
        });
    });
};
// runs python takes score
const processFile = async (file, index) => {
    const filePath = path.join('./controllers/uploads/', file.filename); // Modified filepath
    try {
        const score = await runPythonScript(filePath);
        uploadedFiles[index].score = score; // Update the score in the object
        
        // Delete the file after processing
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
    } catch (error) {
        console.error('Error processing file:', error);
    }
};
//local saving files
const test = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            try {
                await fs.mkdir(uploadPath, { recursive: true });
                cb(null, uploadPath);
            } catch (err) {
                cb(err);
            }
        },
        filename: (req, file, cb) => {
            const index = uploadedFiles.length + 1;
            const fileName = `test_${index}${path.extname(file.originalname)}`;
            uploadedFiles.push({ filepath: fileName, score: null }); // Initialize score as null
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 100 * 1024 * 1024 }
});
// Function to generate a unique vehicle ID
const generateVid = () => crypto.randomBytes(5).toString('hex');


// Route handler for POST requests
const post = async (req, res, next) => {
    try {
        test.array('images', 5)(req, res, async (err) => {
            if (err) {
                console.error('Error uploading files:', err);
                return res.status(400).send('Error uploading files');
            }
        
            if (!req.files || req.files.length === 0) {
                console.error('No files uploaded');
                return res.status(400).send('No files uploaded');
            }
        
            console.log('Uploaded files:', req.files);
        
            // Process each uploaded file
            await Promise.all(req.files.map((file, index) => processFile(file, index)));
        
            // Sort uploaded files in descending order based on score
            uploadedFiles.sort((a, b) => b.score - a.score);
        
            // Console log the sorted array
            console.log('Sorted files:', uploadedFiles);
            
        });
        upload.array('images')(req, res, async (err) => {
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
            const { make, model, trim, title, year, regyear, price, negotiable, plate, condition, mileage, exterior, interior, location, description } = req.body;
            const { userid } = req.session;

            // Check if user is logged in
            const user = await UserModel.findOne({ userid });
            if (!user) {
                return res.redirect('/login');
            }

            // Generate unique vehicle ID
            const vid = generateVid();
            const files = req.files;
            
            // Define an array to store S3 URLs of uploaded files
            const uploadedFileUrls = [];

            // Upload files to S3 and store their URLs
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                const destinationFilename = `${userid}_${vid}_${index}`;
                const params = {
                    Bucket: 'myqucckt',
                    Key: destinationFilename,
                    Body: file.buffer,
                    ContentType: file.mimetype
                };
                const data = await s3.upload(params).promise();
                uploadedFileUrls.push(data.Location);
            }

            console.log(description)
            // Create a new vehicle instance
            const newVehicle = new VehicleModel({
                files: uploadedFileUrls,
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
                description,
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
