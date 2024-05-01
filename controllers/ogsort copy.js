const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');

const uploadedFiles = []; // Array to store objects with filepath:score

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
            uploadedFiles.push({ filepath: fileName, score: null }); // Initialize score as null
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

            // Save uploaded files
            await saveUploadedFiles();
            
            res.redirect('/sell'); // Redirect to '/sell'
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send(`An error occurred while processing your request: ${error.message}`);
    }
};

const saveUploadedFiles = async () => {
    const jsonContent = JSON.stringify(uploadedFiles, null, 2);
    const filePath = path.join(__dirname, 'sort.txt');
    
    try {
        await fs.writeFile(filePath, jsonContent);
        console.log('Uploaded files saved to sort.txt');
        // Modify the file paths after initial saving
        await modifyFilePaths();
    } catch (err) {
        console.error('Error saving uploaded files:', err);
    }
};

const modifyFilePaths = async () => {
    try {
        const filePath = path.join(__dirname, 'sort.txt');
        const data = await fs.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        // Update file paths
        parsedData.forEach((file, index) => {
            parsedData[index].filepath = `${file.filepath}`;
        });
        // Save modified data back to the file
        await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2));
        console.log('File paths modified in sort.txt');
    } catch (err) {
        console.error('Error modifying file paths:', err);
    }
};

module.exports = { post };