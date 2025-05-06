/**
 * Route för autentisering
 */
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

mongoose.set("strictQuery", false); 
mongoose.connect(process.env.DATABASE, {
    dbName: 'BE-2025' // Specify the database name
 }).then(() => {
    console.log('Connected to MongoDB BE-2025'); 
 }).catch((err) => { 
    console.error('Error connecting to MongoDB:', err); 
 });
 
const User = require("../models/User");

// ny användare
router.post('/register', async (req, res) => {
    // console.log("Register request received:");
    try {
        const { username, password, email } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Du måste ange både användarnamn och lösenord" });
        }
        //Correct
        const user = new User({ username, password, email });
        await user.save();
        res.status(201).json({ message: "Användaren skapades" })
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
});

router.post('/login', async (req, res) => {
    // console.log("Login request received:");
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Du måste ange både användarnamn och lösenord" });
        }
        //User existing
        const user = await User.findOne({ username });
        if(!user){
            return res.status(401).json({ error: "Felaktigtigt användarnamn eller lösenord!" });
        }
        const isPasswordMatch = await user.comparePassword(password);   
        if(!isPasswordMatch){
            return res.status(401).json({ error: "Felaktigtigt användarnamn eller lösenord!" }); 
        } else {
            //skapa jwt
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' }); // Token är valid i 1 timme
            const response = {
                message: "Användaren loggades in!",
                token: token
            }
            res.status(200).json({ response });
        }
    } catch (error) {
        res.status(500).json({ error: "" })
    }
});

router.get("/protected", autenticateToken, (req, res) => {
    res.status(200).json({ message: "Inloggad till skyddat område..."});
});

function autenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token === null){
        res.status(401).jsaon({ message: "You're not allowed to be here!"});
    }
    jwt.verify(token, process.env.JWT_KEY, (err, username) => {
        if(err) {
            return res.status(403).json({ message: "No valida token!"});
        }
        req.username = username;    
        next();

    });
}

module.exports = router;