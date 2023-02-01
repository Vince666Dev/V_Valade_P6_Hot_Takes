// ******** MIDDLEWARE PASSWORD POUR COMPLEXIFICATION MDP UTILISATEUR *********
// !!! POUR ETRE FONCTIONNEL, MANQUE INFOS SUR FRONTEND POUR INFORMER L'UTILISATEUR DES CARACTERES EXIGES !!!

// on importe le package "password-validator", 
// qui permet d'exiger certaines conditions de sécurité de mot de passe
const passwordValidator = require("password-validator");

// on crée un nouveau passwordSchema avec une fonction de "password-validator"
const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// on exporte le module du passwordSchema en passant sa validation avec le mot de passe du req.body.password
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)) {
        next();
    }else{
        console.log("mot de passe pas assez fort")
        return res.status(400).json({ error: `Le mot de passe n'est pas assez fort: ${passwordSchema.validate("req.body.password", { details: true })}`})
    }
}