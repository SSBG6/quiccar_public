const session = require('express-session');
const MongoStore = require('connect-mongo');

const crypto = require('crypto');

const skey = crypto.randomBytes(64).toString('hex');
const mwsess = session({
    name: 'qccar.sid',
    secret: skey,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://admin:xxx@xxx.xxx.mongodb.net/qccardb',
        ttl: 3600 // TTL 1 hour in seconds
    })
});

module.exports = mwsess;
