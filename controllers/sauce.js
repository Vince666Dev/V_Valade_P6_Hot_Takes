// ******** LOGIQUE CONTROLLEUR SAUCE *********

// on importe le modele Sauce
const Sauce = require('../models/Sauce');

// le module fs (file system) permet d'interagir avec les fichiers de l'ordinateur (photos sauces)
const fs = require('fs');


// création et export de la logique CREATION D'UNE SAUCE
exports.createSauce = (req, res, next) => {
    // on parse les données de la sauce qui va être envoyer en requete
    const sauceObject = JSON.parse(req.body.sauce);

    // on crée un nouvel objet sauce qui va récupérer (...spread operator) les données du sauceObject,
    // et on ajoute l'url de stockage de l'image entrante.
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    // on sauvegarde la nouvelle sauce avec la methode .save() de mongoose.
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' })})
        .catch(error => { res.status(400).json({ error })});
};


// création et export de la logique MODIFIER UNE SAUCE
exports.modifySauce = (req, res, next) => {
    // on regarde si une image est présente dans la requête
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    // si une image est présente
    if(req.file) {
         // on recherche la sauce correspondante dans la DB avec la fonction .findOne() de Mongoose
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                // puis on récupère le nom de l'image dans l'url
                const filename = sauce.imageUrl.split('/images/')[1];
                // puis on supprime l'ancienne image avec la fonction .unlink() de fs
                fs.unlink(`images/${filename}`, () => {
                    // Puis on met à jour la sauce avec la fonction .updateOne() de Mongoose
                    // en envoyant les modifications faites dont l'URL de la nouvelle image dans la DB
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
                        .then(() => { res.status(200).json({message: 'Objet modifié !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            })
            .catch(error => {res.status(500).json({ error })});
    
    // si il n'y a pas de nouvelle image, on met à jour dans la DB le reste des modifications
    }else{
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'objet modifié' }))
        .catch(error => res.status(401).json({ error }));
    }
};


// création et export de la logique SUPPRIMER UNE SAUCE
exports.deleteSauce = (req, res, next) => {
    // on recherche la sauce correspondante dans la DB
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // On récupère le nom de l'image dans l'url
            const filename = sauce.imageUrl.split('/images/')[1];
            // puis on supprime l'image avec la fonction .unlink() de fs
            fs.unlink(`images/${filename}`, () => {
                // et on supprime la sauce dans la DB avec la fonction .deleteOne() de Mongoose
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        })
        .catch(error => {res.status(500).json({ error })});
};


// création et export de la logique LIKE/DISLIKE UNE SAUCE
exports.likeDislikeSauce = (req, res, next) => {
    // si le like de la requête est positif (1)
    if (req.body.like === 1 ) {
        // on met à jour la sauce dans la DB en pushant le userID dans le tableau des usersLiked et on incrémente +1 like
        Sauce.updateOne({ _id: req.params.id}, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 }})
        .then(() => res.status(200).json({ message: 'Like Ajouté' }))
        .catch((error) => res.status(400).json({ error }));

    // si le like de la requête est négatif (-1)
    } else if (req.body.like === -1 ) {
        // on met à jour la sauce dans la DB en pushant le userID dans le tableau des usersDisliked et on incrémente +1 dislike
        Sauce.updateOne({ _id: req.params.id}, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 }})
        .then(() => res.status(200).json({ message: 'Dislike Ajouté' }))
        .catch((error) => res.status(400).json({ error }));

    // si le like de la requête devient neutre (0)
    } else {
        // on recherche la sauce correspondante dans la DB
        Sauce.findOne({ _id: req.params.id})
        .then((sauce) => {
            // si l'userId de la requête est présent dans le tableau des usersLiked
            if (sauce.usersLiked.includes(req.body.userId)) {
                // alors on retire cet userId du tableau des usersLiked et on retire le like en incrémentant -1
                Sauce.updateOne({ _id: req.params.id}, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: 'Like Supprimé' }))
                .catch(error => res.status(401).json({ error }))

            // si l'userId de la requête est présent dans le tableau des usersDisliked
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                // alors on retire cet userId du tableau des usersDisliked et on retire le dislike en incrémentant -1
                Sauce.updateOne({ _id: req.params.id}, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: 'Dislike Supprimé' }))
                .catch((error) => res.status(401).json({ error }))
            }
        })
        .catch((error) => res.status(400).json({ error }));
    }
};


// création et export de la logique AFFICHER UNE SAUCE
exports.getOneSauce = (req, res, next) => {
    // on recherche la sauce correspondante à la requête dans la DB avec la fonction .findOne() de Mongoose
    Sauce.findOne({ _id: req.params.id })
        // on retourne un statut 200 et la sauce au format JSON
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};


// création et export de la logique AFFICHER TOUTES LES SAUCES
exports.getAllSauces = (req, res, next) => {
    // on recherche toutes les sauces dans la DB avec la fonction .find() de Mongoose
    Sauce.find()
        // on retourne un statut 200 et toutes les sauces au format JSON
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};