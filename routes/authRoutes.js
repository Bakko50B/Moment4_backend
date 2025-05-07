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
    try {
        const { username, password, email } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Du måste ange både användarnamn och lösenord" });
        }

        // Kontrollera om användaren redan finns
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log(existingUser.username);
            return res.status(409).json({ message: `Användarnamnet ${existingUser.username} är upptaget` });
        }

        // Använd den statiska metoden `register` från modellen
        const user = await User.register(username, password, email);

        res.status(201).json({ message: "Användaren skapades", user });
    } catch (error) {
        console.error("Register fel:", error);
        res.status(500).json({ error: "Serverfel" });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Du måste ange både användarnamn och lösenord" });
        }

        const user = await User.login(username, password); 

        // Skapa JWT
        const payload = { username: user.username };
        const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

        // Exkludera lösenord vid hämtning av användardata
        const userData = await User.findOne({ username }).select("-password");

        const response = {
            message: "Användaren loggades in!",
            token: token,
            user: userData
        };

        console.log(response);
        res.status(200).json( response );

    } catch (error) {
        console.error("Login fel:", error);
        res.status(401).json({ error: "Felaktigt användarnamn eller lösenord!" });
    }
});


router.get("/protected", authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Hämtar alla användare från databasen

        res.status(200).json({
            message: "Inloggad till skyddat område...",
            users: users // Skickar tillbaka alla användare
        });
    } catch (error) {
        res.status(500).json({ error: "Serverfel vid hämtning av data!" });
    }
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