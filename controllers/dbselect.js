mongoose = require('mongoose');


function dbSelectMongo() {
    mongoose.connect('mongodb+srv://admin:password@dbaneme.anothername.mongodb.net/qccardb', { useNewUrlParser: true, useUnifiedTopology: true })//named the qccardb
        .then(() => console.log('Mongoose Activated (index.js)'))
        .catch(err => console.error('Could not activate Mongoose', err));
}
module.exports = dbSelectMongo;

