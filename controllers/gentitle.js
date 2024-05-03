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
                    resolve(stdout.trim()); 
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
        
            console.log(data.title);
            res.render('ai1_restofinfo', { data: data });
        } catch (error) {
            // Handle any errors that occur during title generation
            console.error('Error generating title:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
