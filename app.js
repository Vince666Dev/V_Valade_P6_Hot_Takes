// ********* MISE EN PLACE DE NOTRE APP ET SON ENVIRONNEMENT **********

// on importe le framework 'Express'
const express = require('express');

// on importe le package Dotenv pour pouvoir utiliser des variables d'environnement. 
const dotenv = require('dotenv');
dotenv.config();

// on importe le package 'Mongoose', pour pouvoir utiliser notre base de données Mongoose et ses fonctions.
const mongoose = require('mongoose');

// variable path pour nous permettre de créer des chemins entre nos différents fichiers du backend
const path = require('path');

// on importe nos routes sauce et user
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// on importe le package helmet pour sécuriser nos Headers HTTP
const helmet = require("helmet");

// on importe le package mongo sanitize pour empecher les injections malveillantes dans notre base de données.
const mongoDbSanitize = require("mongodb-sanitize");

// on crée notre app express (permet d'utiliser des fonctions du framework express)
const app = express();

// on importe le package cors qui nous autorise à utiliser des ressources de différentes origines (API/DATABASE)
const cors = require('cors')

// on supprime des messages d'alertes inutiles venant de mongoose
mongoose.set('strictQuery', true);

// on connecte notre backend à notre compte MongoDb Atlas (BASE DE DONNEES) en utilisant nos variables d'environnement pour masquer les données sensibles.
mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + process.env.DB_HOST + '?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// utilisation de nos imports et packages
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use(helmet());
app.use(mongoDbSanitize());

// on exporte notre module app
module.exports = app;