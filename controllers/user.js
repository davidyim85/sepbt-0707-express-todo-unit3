const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SALT_LENGTH = 12;


//A route to sign up 
router.post('/sign-up', async (req, res) => {
    try {

        //1. since the username must be unique do a check to see if it already exists. 
        const userInDatabase = await User.findOne({ username: req.body.username });

        //2. if the username already exists, 
        if (userInDatabase) {
            // return with an error saying 'user already taken'
            res.status(400).json({ error: 'user already taken' });
        }

        //3. create the user using the username and password. 
        const user = await User.create({
            username: req.body.username,
             //  save the password with 12 rounds of excryption 
            password: bcrypt.hashSync(req.body.password, SALT_LENGTH),
        });

        //4. send a JWT as a response (it on line 11 as res), 
        // the json web token must be signed using the username and _id along with our JWT_SECRET
        const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token: token });

    } catch (error) {
        res.status(400).json({ error: error })
    }
});

//A route to sign in
router.post('/sign-in', async (req, res) => {
    try{
        // 1. find the user by username
        const user = await User.findOne({ username: req.body.username });

        // 2. compare the password in the db to the password supplied (req.body.password)
        const doPasswordsMatch = bcrypt.compareSync(req.body.password, user.password); //this will return true or false. true means passwords match. false means they do not
        console.log(user, doPasswordsMatch);

        // 3. if the user is found and passwords match
        if(user && doPasswordsMatch){
            // create a JWT token with username and _id properties and sign it with the JWT_SECRET value
            const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
            // send that to JWT on the response
            res.status(200).json({ token: token });
        } else {
            // 4. if the user is NOT found or the password do not match
                 // return with an error saying 'Invalid username or password'
            res.status(400).json({ error: 'Invalid username or password' })
        }
    } catch (error) {
        res.status(400).json({ error: error })
    }
});

//export all of our routes
module.exports = router;