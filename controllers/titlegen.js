const { exec } = require('child_process');

const year = '2019';
const make = 'Make';
const model = 'Model';
const condition = 'Condition';

function generateTitle(year, make, model, condition) {
    exec(`python title.py ${year} ${make} ${model} ${condition}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`Generated Title: ${stdout}`);
    });
}

generateTitle(year, make, model, condition);
