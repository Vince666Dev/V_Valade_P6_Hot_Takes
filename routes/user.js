// ********* ROUTES USER (SIGN UP / LOGIN) *********

// on importe notre app express
const express = require('express');

// on crée un routeur de notre app express pour utiliser nos fonctions CRUD
const router = express.Router();

// on importe nos logiques password et userCtrl
const password = require("../middleware/password")
const userCtrl = require('../controllers/user');

// on crée nos routes post pour signup et login en passant nos logiques associées.
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

// on exporte notre routeur
module.exports = router;