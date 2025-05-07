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
    console.log('Inloggad till MongoDB BE-2025');
}).catch((err) => {
    console.error('Det gick inte att ansluta till MongoDB:', err);
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
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log(existingUser.username);
            return res.status(409).json({ message: `Användarnamnet ${existingUser.username  } är upptaget` })
        }

        const user = new User({ username, password, email });
        await user.save();
        res.status(201).json({ message: "Användaren skapades" })
    } catch (error) {
        res.status(500).json({ error: "Serverfel" })
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
        if (!user) {
            return res.status(401).json({ error: "Felaktigt användarnamn eller lösenord!" });
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Felaktigt användarnamn eller lösenord!" });
        } else {
            //skapa jwt
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' }); // Token är valid i 1 timme
            
            const userData = await User.findOne({ username} , {password:0})
            const response = {
                message: "Användaren loggades in!",
                token: token,
                user: userData
            }
            console.log(response);
            res.status(200).json({ response });
        }
    } catch (error) {
        console.error("Login fel:", error);
        res.status(500).json({ error: "Serverfel!" })
    }
});

router.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Inloggad till skyddat område..." });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null || !token) {
        return res.status(401).json({ message: "Du får inte vara här!" });
    }
    jwt.verify(token, process.env.JWT_KEY, (err, username) => {
        if (err) {
            return res.status(403).json({ message: "Ingen giltig token!", error: err.message });
        }
        req.username = username;
        next();
    });
}

module.exports = router;