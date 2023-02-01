//  ********* CREATION DU MODELE USER *********

// on importe le package 'Mongoose', pour pouvoir utiliser notre base de données Mongoose et ses fonctions.
const mongoose = require('mongoose');

// on importe le package 'mongoose-unique-validator' 
// pour ne pas autoriser la création de 2 comptes sur la DB avec le même e-mail
const uniqueValidator = require('mongoose-unique-validator');

// on crée notre userSchema via la fonction .Schema() de Mongoose
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
});

// on passe le package uniqueValidator à notre userSchema
userSchema.plugin(uniqueValidator);

// on exporte notre userSchema comme modèle mongoose sur la DB
module.exports = mongoose.model('User', userSchema);