const express = require('express');
const mwsess = require('./controllers/session.js');
const connectToMongoDB = require('./controllers/mongocon.js');
const routes = require('./controllers/routes.js');
const VehicleModel = require('./models/vehicle.js');
const UserModel = require('./models/user.js');
const app = express();
const port = process.env.PORT || 4000;
const dbSelectMongo = require('./controllers/dbselect.js'); 
const getVehicle = require('./controllers/getVehicle.js');
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongoose connection
dbSelectMongo()

//session
app.use(mwsess);

//check user
const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next()
    }else {
        res.redirect('/login');
    }
}
//logout 
app.get('/logout', (req, res) => {
    console.log("Logging out");
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/");
    })
});
//ejs thing
app.set('view engine', 'ejs');

// Importing assets
app.use(express.static('public/css')); 
app.use(express.static('public/imgs')); 

//complete the signup process
const sign = require('./controllers/signup.js');
app.post('/signup',sign.post);

//login

const log = require('./controllers/login.js');
app.post('/login',log.post);

//send email verification code
const email = require('./controllers/email-verify.js');
app.post('/signup-email',email.post);

//verify email
const verify = require('./controllers/verify.js');
app.post('/signup-verification-code',verify.post);

//create a vehicle record
const vehicle = require('./controllers/sell.js');
app.post('/savevehicle',vehicle.post);

app.get('/product', async (req, res) => {
    await getVehicle.post(req, res); 
});


async function runServer() {
    try{//server
        app.listen(port, () => {
            console.log(`http://localhost:${port} Active`);
        });}catch (error){
            console.error('Error starting server:', error);
        }
    try {//mongoDB connection
        const db = await connectToMongoDB();
        console.log('(index.js) MongoDB has entered the chat');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
    try {//routing
        const rt =await routes();
        for (const [path, handler] of Object.entries(rt)) {
            app.get(path, handler);
        }
    }catch (error){
        console.error('Error connecting routes:', error);
        process.exit(1); 
    }
}

runServer();

