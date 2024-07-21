const { MongoClient } = require('mongodb');


// Connection URI
const uri = 'mongodb+srv://admin:xxx@xxx.xxx.mongodb.net/';

// Mongoose

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to connect to MongoDB
const connectToMongoDB = async () => {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('(mongocon.js) MongoDB has entered the chat');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectToMongoDB;

