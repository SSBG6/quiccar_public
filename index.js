const express = require('express');
const { exec } = require('child_process');
const mwsess = require('./controllers/session.js');
const axios = require('axios');
//routes
const routes = require('./controllers/routes.js');
//model imports
const VehicleModel = require('./models/vehicle.js');
const UserModel = require('./models/user.js');
const ArticleModel = require('./models/article.js');
const AuctionModel = require('./models/auction.js');
const CommentModel = require('./models/comment.js');
const app = express();
const fs = require('fs');
const multer = require('multer');
//port
const port = process.env.PORT || 4000;
//code imports
const dbSelectMongo = require('./controllers/dbselect.js'); 
const getVehicle = require('./controllers/getVehicle.js');
const bodyParser = require('body-parser');
//middleware
app.use(bodyParser.json());
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
    res.cookie('session', 'loggedin', { maxAge: 0 }); 
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
//ai image sort
const img = require('./controllers/orderimage.js');
app.get('/orderimg', async (req, res) => {
    await img.post(req, res); 
});


//login
const log = require('./controllers/login.js');
app.post('/login',log.post);

//edit accoumd
const edit = require('./controllers/updateacc.js');
app.post('/updateacc',edit.post);

const editv = require('./controllers/editveh.js');
app.post('/editv',editv.post);
//edit password
const epass = require('./controllers/updpass.js');
app.post('/updatepass',epass.post);

//send email verification code
const email = require('./controllers/email-verify.js');
app.post('/signup-email',email.post);

//verify email
const verify = require('./controllers/verify.js');
app.post('/signup-verification-code',verify.post);

//create a vehicle record
const aiimage = require('./controllers/ogsort.js');
const vehicle = require('./controllers/sell.js');
app.post('/savevehicle',vehicle.post);
// app.post('/savevehicle', async (req, res) => {
//     const results = await aiimage.post(req, res);
//     await vehicle.post(req, res, results); 
// });

//create an auction record
const auction = require('./controllers/createauction.js');
app.post('/createauction',auction.post);

const save = require('./controllers/sort.js');
app.post('/sort',save.post);

//product page
app.get('/product', async (req, res) => {
    await getVehicle.post(req, res); 
});
const eveh = require('./controllers/eveh.js'); 
app.get('/edveh', async (req, res) => {
    await eveh.post(req, res); 
});


//auction page
const getAuc = require('./controllers/getAuction.js');
app.get('/auction', async (req, res) => {
    await getAuc.post(req, res); 
});

//make bids
const mbids = require('./controllers/bid.js');
app.post('/makebid', async (req, res) => {
    await mbids.post(req, res); 
} );

//DELETE FUNCTIONS 
    //delete article
    const dela = require('./controllers/darticle.js');
    app.get('/darticle', async (req, res) => {
        await dela.post(req, res); 
    });
    //delete vehicle
    const delv = require('./controllers/dvech.js');
    app.get('/dvehicle', async (req, res) => {
        await delv.post(req, res); 
    });
    //auction status manual change
    const astatus = require('./controllers/aucstatus.js');
    app.get('/aucstatus', async (req, res) => {
        await astatus.post(req, res); 
    });
    //delete auction
    const dauc = require('./controllers/dauc.js');
    app.get('/delauc', async (req, res) => {
        await dauc.post(req, res);
    });
    //delete comment
    const delcom = require('./controllers/dcomment.js');
    app.get('/dcomment', async (req, res) => {
        await delcom.post(req, res); 
    });
    //delete user
    const deluser = require('./controllers/duser.js');
    app.post('/duser',deluser.post);
//browse pages
app.get('/browse', async (req, res) => {
    try {
        const vehicles = await VehicleModel.find();
        const data = { 
            title: vehicles.title,
            price: vehicles.price,
            milage: vehicles.milage,
            location: vehicles.location,
            time: vehicles.time,
            files: vehicles.files,
        };
        res.render('browse', { vehicles:vehicles });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//auction pages
app.get('/auct', async (req, res) => {
    try {
        const auctions = await AuctionModel.find();
        // Render a page to display all articles
        console.log(auctions);
        res.render('auctions', { auctions });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


//user profile
app.get('/profile', async (req, res) => {
    try {
        const usersid = req.session.userid;
        const user = await UserModel.findOne({ userid: usersid });
        if (!user) {
            return res.status(401).send('<script>alert("you shall not pass"); window.location.href="/";</script>');
        }
        const vehicles = await VehicleModel.find({ uid: usersid });
        if (!vehicles) {
            return res.status(404).send('Vehicle not found');
        }
        const articles = await ArticleModel.find({ userid: usersid });
        if (!articles) {
            return res.status(404).send('Article not found');
        }
        const auctions = await AuctionModel.find({ oid: usersid });
        if (!auctions) {
            return res.status(404).send('Article not found');
        }
        // const comments = await CommentModel.find({ userid: usersid });
        res.render('account', { vehicles, articles, auctions });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
//edit vehicle


app.get('/settings', async (req, res) => {
    try {
        const usersid = req.session.userid;
        const user = await UserModel.findOne({ userid: usersid });
        if (!user) {
            return res.status(404).send('User not found');
        }
       
        res.render('accountsettings', { data: user});
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/myv', async (req, res) => {
    try {
        const usersid = req.session.userid;
        const vehicles = await VehicleModel.find({ uid: usersid });
        if (!vehicles) {
            return res.status(404).send('Vehicle not found');
        }
        res.render('myvehicles', { vehicles});
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


//community pages
app.get('/community', async (req, res) => {
    // Fetch all articles from the database
    try {
        const articles = await ArticleModel.find();
        // Render a page to display all articles
        res.render('community', { articles });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
//saving
const savearticle = require('./controllers/savearticle.js');
const getarticle = require('./controllers/getArticle');
app.post('/savearticle',savearticle.post);

//loading articles
app.get('/article', async (req, res) => {
    await getarticle.post(req, res); 
});
// tes
const manimord = require('./controllers/manimord.js');
manimord.post();



//generation ai title
const titlegen = require('./controllers/gentitle.js');
app.post('/gen', async (req, res) => {
    await titlegen.post(req, res); });
//generate description
const des = require('./controllers/gendes.js');
app.post('/gendes', async (req, res) => {
    await des.post(req, res); });

async function runServer() {
    try{//server
        app.listen(port, () => {
            console.log(`http://localhost:${port} Active`);
        });}catch (error){
            console.error('Error starting server:', error);
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
