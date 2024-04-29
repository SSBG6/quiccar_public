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

const save = require('./controllers/sort.js');
app.post('/sort',save.post);

//product page
app.get('/product', async (req, res) => {
    await getVehicle.post(req, res); 
});
//
const dela = require('./controllers/darticle.js');
app.get('/darticle', async (req, res) => {
    await dela.post(req, res); 
});


//browse pages
app.get('/browse', async (req, res) => {
    try {
        const vehicles = await VehicleModel.find();
        // Render a page to display all articles
        console.log(vehicles);
        res.render('browse', { vehicles });
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
            return res.status(404).send('User not found');
        }
        const vehicles = await VehicleModel.find({ uid: usersid });
        if (!vehicles) {
            return res.status(404).send('Vehicle not found');
        }
        const articles = await ArticleModel.find({ userid: usersid });
        if (!articles) {
            return res.status(404).send('Article not found');
        }
        // const auctions = await AuctionModel.find({ oid: usersid });
        // const comments = await CommentModel.find({ userid: usersid });
        res.render('account', { vehicles, articles });
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

//generation ai title
app.post('/gen', async (req, res) => {
    const { year, make, model, condition} = req.body; 
    function generateTitle(year, make, model, condition) {
        return new Promise((resolve, reject) => {
            exec(`python title.py ${year} ${make} ${model} ${condition}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject(error);
                    return;
                }
                resolve(stdout.trim()); // Trim any whitespace from the titl
            });
        });
    }
    
    // Call the async function to generate the title
    try {
        const gt = await generateTitle(year, make, model, condition);

        const data = {
            title: gt,
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
        res.render('ai1_restofinfo', { data: data }); // Pass the data object to the template
    } catch (error) {
        // Handle any errors that occur during title generation
        console.error('Error generating title:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






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

