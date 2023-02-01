// ********* MIDDLEWARE D'AUTHENTIFICATION *********

// on importe le package Dotenv pour pouvoir utiliser des variables d'environnement. 
const dotenv = require("dotenv");
dotenv.config();

// on importe le package 'jsonwebtoken'qui va nous permettre de créer des Tokens d'authentifications
const jwt = require('jsonwebtoken');

// on crée notre token d'authentification
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ') [1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
    }catch(error){
        res.status(401).json({ error });
    }
};