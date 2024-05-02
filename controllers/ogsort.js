const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');

const uploadedFiles = []; // Array to store objects with filename:score

const uploadPath = path.join(__dirname, 'uploads');

const upload = multer({
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
            uploadedFiles.push({ filename: file.originalname, score: null }); // Initialize score as null
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 100 * 1024 * 1024 }
});

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

const post = async (req, res, next) => {
    try {
        upload.array('images', 5)(req, res, async (err) => {
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
            res.send(uploadedFiles);
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send(`An error occurred while processing your request: ${error.message}`);
    }
};

module.exports = { post };