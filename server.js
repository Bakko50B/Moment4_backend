/**
 * Skal till ett REST-API med Nodejs och Express
 * Av Mattias Dahlgren, mattias.dahlgren@miun.se
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Importera authRoutes
require('dotenv').config(); // Ladda miljövariabler från .env-filen

const port = process.env.PORT || 3000; // Använd port från .env eller standardport 3000

const app = express();
app.use(bodyParser.json());

// Aktivera CORS middleware för alla rutter
app.use(cors());

/** ------ Rutter (Routes) ------ */

app.use('/api', authRoutes); // Använd authRoutes för /api/auth

// Om ingen av ovanstående rutter fångar upp anropet
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Starta servern
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});      