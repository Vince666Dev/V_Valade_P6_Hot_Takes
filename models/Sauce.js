//  ********* CREATION DU MODELE SAUCE *********

// on importe le package 'Mongoose', pour pouvoir utiliser notre base de données Mongoose et ses fonctions.
const mongoose = require('mongoose');

// on crée notre sauceSchema via la fonction .Schema() de Mongoose
const sauceSchema = mongoose.Schema({
   userId: { type: String, required: true},
   name: { type: String, required: true},
   manufacturer: { type: String, required: true},
   description: { type: String, required: true},
   mainPepper: { type: String, required: true},
   imageUrl: { type: String, required: true},
   heat: { type: Number, required: true},
   likes: { type: Number, default: 0 },
   dislikes: { type: Number, default: 0 },
   usersLiked: [{type: String }],
   usersDisliked: [{type: String }]
});

// on exporte notre sauceSchema comme modèle mongoose sur la DB
module.exports = mongoose.model('Sauce', sauceSchema);