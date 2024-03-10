const session = require('express-session');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');

const skey = crypto.randomBytes(64).toString('hex');
const mwsess = session({
    name: 'qccar.sid',
    secret: skey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://admin:hWhFls94NmEdGZ6E@qcdb.6y9mcpc.mongodb.net/qccardb',
        ttl: 3600 // TTL 30min
    })
});

module.exports = mwsess;