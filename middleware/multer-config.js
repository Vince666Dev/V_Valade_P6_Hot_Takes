// ********* MIDDLEWARE MULTER-CONFIG, POUR LA GESTION DES IMAGES UTILISATEUR **********

// on importe notre package multer (gestion des fichiers images utilisateur)
const multer = require('multer');

// déclaration des MIME TYPES (permet de décrire quels types de fichiers seront envoyés dans la requête HTTP)
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'jpg' 
};

// on utilise la fonction diskStorage de multer pour stocker les images utilisateur dans notre dossier images
const storage = multer.diskStorage({
    destination:(req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// on exporte notre module multer 
module.exports = multer({ storage: storage }).single('image');