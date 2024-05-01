const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
    post: async (req, res) => { 
        const { title, make, model, trim, year, regyear, plate, price, negotiable, condition, mileage, exterior, interior, location } = req.body; 
        function gen(make, model, year, price, condition, mileage, exterior, interior) {
            return new Promise((resolve, reject) => {
                exec(`python des.py ${year} ${make} ${model} ${price} ${condition} ${mileage} ${exterior} ${interior}`, (error, stdout) => {
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
            const description = await gen(make, model, year, price, condition, mileage, exterior, interior);
        
            const data = {
                title:title,
                make:make,
                model:model,
                year:year,
                condition:condition,
                description: description,
                title:title,
                make:make,
                model:model,
                trim:trim,
                year:year,
                regyear:regyear,
                plate:plate,
                price:price,
                negotiable:negotiable,
                condition:condition,
                mileage:mileage,
                exterior:exterior,
                interior:interior,
                location:location,
            };
            console.log(title)
            console.log(description)
            res.render('ai1_vehicledes', { data: data });
        } catch (error) {
            // Handle any errors that occur during title generation
            console.error('Error generating title:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
