const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
    post: async (req, res) => { 
        const { year, make, model, condition } = req.body; 
        function generateTitle(year, make, model, condition) {
            return new Promise((resolve, reject) => {
                exec(`python title.py ${year} ${make} ${model} ${condition}`, (error, stdout) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        reject(error);
                        return;
                    }
                    resolve(stdout.trim()); // Trim any whitespace from the title
                });
            });
        }
        
        // Call the async function to generate the title
        try {
            const gt = await generateTitle(year, make, model, condition);
            const capitalizedTitle = gt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const data = {
                title: capitalizedTitle,
                make: make,
                model: model,
                year: year,
                condition: condition,
            };

            //sorting the images based on
            fs.readFile('./controllers/sort.txt', 'utf8', (err, jsonString) => {
                if (err) {
                    console.log('Error reading file:', err);
                    return;
                }
              
                try {
                    // Parse the JSON data
                    const data = JSON.parse(jsonString);
                
                    // Sorting function to sort by score
                    data.sort((a, b) => b.score - a.score);
                
                    // Convert the sorted data back to JSON string
                    const sortedJsonString = JSON.stringify(data, null, 2);
                
                    // Write the sorted JSON back to the file
                    fs.writeFile('./controllers/sort.txt', sortedJsonString, 'utf8', (err) => {
                        if (err) {
                            console.log('Error writing file:', err);
                            return;
                        }
                        console.log('File sorted and saved successfully.');
                    });
                } catch (err) {
                    console.log('Error parsing JSON data:', err);
                }
            });
        
            console.log(data.title);
            res.render('ai1_restofinfo', { data: data });
        } catch (error) {
            // Handle any errors that occur during title generation
            console.error('Error generating title:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
