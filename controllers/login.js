module.exports = {
    post: async (req, res) => {
        const UserModel = require("../models/user");
        const bcrypt = require('bcryptjs');
        const axios = require('axios'); // Import axios here
        const { cred, password } = req.body;

        console.log("cred:", cred); // Log the value of cred
        let user = await UserModel.findOne({ email: cred });
     
        if (!user) {
            // If no user found with the provided email, try to find by username
            user = await UserModel.findOne({ username: cred });
        }
      
        if (!user) {
            return res.redirect('/login');
        }
        
        // Check password
        const match = await bcrypt.compare(password, user.password);
    
        if (!match) {
            console.log("Password does not match");
            return res.redirect('/login');
        }
        // Now user is authenticated
        req.session.userid = user.userid;
        console.log("Logged in as:", user.username);

        // Now execute Axios request
        const data = JSON.stringify({
            "collection": "users",
            "database": "qccardb",
            "dataSource": "qcdb",
            "projection": {
                "_id": 1
            }
        });
        console.log("Data:", data);
        const config = {
            method: 'post',
            url: 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-urcqm/endpoint/data/v1/action/findOne',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Request-Headers': '*',
              'api-key': 'AojZPDds8URkeMsZsTKDAcffsPa1jas6MPPQQJ7iQli07e81s6cv9faNPwzu0ymd',
              'Accept': 'application/ejson'
            },
            data: data
        };
        

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                res.cookie('session', 'loggedin', { maxAge: 3600000 }); // Set cookie with a time limit of 1 hour (3600000 milliseconds)
                res.redirect('/'); // Redirect after Axios request
            })
            .catch(function (error) {
                console.log(error);
                res.redirect('/login'); // Redirect even if Axios request fails
            });
    }
}
