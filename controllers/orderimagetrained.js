const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // Import exec for running Python script
const VehicleModel = require('../models/vehicle.js');

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

module.exports = {
    post: async (req, res) => {
        const vvid = req.query.id;;
        console.log(vvid);
        try {
            const vehicle = await VehicleModel.findOne({ vid:vvid });
            if (!vehicle) {
                return res.status(404).send('Vehicle not found');
            }
            console.log(vehicle.files);

            const downloadedPaths = []; // Array to store downloaded paths
            const filenameScoreArray = []; // 2D array to store filename and score

            // Loop through each file URL and download the images
            for (let file of vehicle.files) {
                const filename = path.basename(file);
                const imagePath = path.join(__dirname, 'uploads', filename); // Define the path where images will be saved

                const response = await axios({
                    url: file,
                    method: 'GET',
                    responseType: 'stream'
                });

                response.data.pipe(fs.createWriteStream(imagePath)); // Pipe the image stream to a file
                downloadedPaths.push(imagePath); // Add downloaded image path to array
            }
        
            console.log('Images downloaded successfully');
            console.log('Downloaded Paths:', downloadedPaths); // Log downloaded paths

            // Run ip.py for each downloaded image
            for (let imagePath of downloadedPaths) {
                const score = await runPythonScript(imagePath);
                console.log(`Score for ${imagePath}: ${score}`);
                filenameScoreArray.push([path.basename(imagePath), score]); // Push filename and score to the 2D array
            }

            // Sort the 2D array based on score (ascending order)
            filenameScoreArray.sort((a, b) => b[1] - a[1]);

            console.log('Sorted Filename and Score Array:', filenameScoreArray); // Log sorted filename and score array

            // Create an array containing only the filenames with the URL prefix
            const updatedFiles = filenameScoreArray.map(entry => `https://myqucckt.s3.ap-south-1.amazonaws.com/${entry[0]}`);

            console.log('Updated Files:', updatedFiles); // Log updated files

            // Update the vehicle record with the updated file URLs
            await VehicleModel.updateOne({ vvid }, { files: updatedFiles });
            res.redirect(`/product?id=${vvid}`);
            console.log('Vehicle record updated successfully');
        } catch (error) {
            console.log(error);
            console.log('Internal Server Error');
        }
    }
};
