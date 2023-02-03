// ********* ROUTES SAUCE (CRUD) *********

// on importe le framework 'Express'
const express = require('express');

// on crée un routeur de notre app express pour utiliser nos fonctions CRUD
const router = express.Router();

// on importe notre middleware d'authentification
const auth = require('../middleware/auth');

// on importe notre middleware mutler-config (gestion des fichiers images utilisateur)
const multer = require('../middleware/multer-config');

// on importe notre logique sauceCtrl
const sauceCtrl = require('../controllers/sauce');

// on crée les routes (CRUD) de nos sauces en passant nos logiques associées.
router.post('/', auth, multer, sauceCtrl.createSauce); 
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

// on exporte notre routeur
module.exports = router;