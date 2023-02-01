// ******** LOGIQUE CONTROLLEUR USER *********

// on importe le package Dotenv pour pouvoir utiliser des variables d'environnement. 
const dotenv = require("dotenv");
dotenv.config();

// on importe le package 'bcrypt' pour HASHER les MDP utilisateur sur la DB
const bcrypt = require('bcrypt');

// on importe le package 'crypto-js' pour crypter les MAILS utilisateur sur la DB
const cryptoJs = require('crypto-js');

// on importe le package 'jsonwebtoken'qui va nous permettre de créer des Tokens d'authentifications
const jwt = require('jsonwebtoken');

// on importe le modele User
const User = require('../models/User');

// on crée et exporte notre fonction SIGNUP
exports.signup = (req, res, next) => {
    // cryptage de l'addresse mail avec cryptoJs
    const emailCrypto = cryptoJs.HmacSHA256(req.body.email, `${process.env.CRYPTO_MAIL_KEY}`).toString();
    
    // hashage du MDP avec Bcrypt et création d'un nouvel utilisateur avec ces 2 données.
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: emailCrypto,
                password: hash,
            });
            // sauvegarde de l'utilisateur sur la DB avec la fonction .save() de Mongoose
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur crée' }))
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// on crée et exporte notre fonction LOGIN
exports.login = (req, res, next) => {
    // cryptage de l'addresse mail avec cryptoJs
    const emailCrypto = cryptoJs.HmacSHA256(req.body.email, `${process.env.CRYPTO_MAIL_KEY}`).toString();

    // on cherche dans la DB si un utilisateur avec le même mail existe
    User.findOne({ email:emailCrypto })
    .then((user) => {
        // si aucun mail correspond, on renvoie l'erreur
        if (user === null) {
            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });

        // si un utilisateur est dejà présent avec ce mail, alors on compare les MDP avec Bcrypt
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                // si le MDP est incorrect, on renvoie l'erreur
                if(!valid) {
                    return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });

                // si le MDP est correct, on crée un TOKEN de session qui expire dans 24h
                }else{
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json({error }));
};