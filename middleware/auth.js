// ********* MIDDLEWARE D'AUTHENTIFICATION POUR VERIFIER LES INFOS D'AUTH ENVOYEES PAR LE CLIENT POUR LES DONNEES SAUCES *********

// on importe le package Dotenv pour pouvoir utiliser des variables d'environnement. 
const dotenv = require("dotenv");
dotenv.config();

// on importe le package 'jsonwebtoken'qui va nous permettre ici d'utiliser sa fonction verify
const jwt = require('jsonwebtoken');

// on crée notre logique auth qui permettra d'authentifier un userId depuis son token 
// Ceci permettra aux rêquetes via les routes sauces d'être vérifiées afin d'acceder, de modifier, supprimer ou liker les sauces
module.exports = (req, res, next) => {
    try{
        //on récupére le token dans l'en-tête authorization en splitant 'Bearer' du token
        const token = req.headers.authorization.split(' ') [1];
        //on verifie et décode le token en y passant notre clé secrète
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        //on récupere l'userId dans le token
        const userId = decodedToken.userId;
        //on ajoute l'user ID dans la requête pour que les differentes routes sauces puissent l'utiliser.
        req.auth = {
            userId: userId,
        };
        next();
    }catch(error){
        res.status(401).json({ error });
    }
};