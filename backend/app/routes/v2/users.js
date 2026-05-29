import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../../models/user.js';

const router = express.Router();
import tokenChecker from '../../middleware/tokenChecker.js'
import adminChecker from '../../middleware/adminChecker.js'
import Publication  from '../../models/publication.js';
import user from '../../models/user.js';

/*
output messages
get 200
post 201
put 200 -> con obj, 204 -> no obj
delete 200 -> conferma, 204 -> no body

400 bad input
401/403 errori di autenticazione
404 obj non trovato
500 problema interno server
*/


router.use('/:id', async (req, res, next) => {
    if(req.params.id == "admin") {return next()}
    let userr = await User.findById(req.params.id).exec();
    if (!userr) {
        res.status(404).json({success: false, error: "Utente non trovato" })
        //console.log('user not found')
        return;
    }
    req['user'] = userr;
    next()
});

router.delete('/:id', tokenChecker, async (req, res) => {
    try {
        const loggedUserId = req.loggedUser.id;

        //controllo che sia lo user stesso o chiamata da un admin
        if (loggedUserId != req.params.id && req.loggedUser.role !== "admin") {
            return res.status(403).json({success:false,  error: "Non sei autorizzato a eliminare questo Utente." });
        }

        //eliminazione pubblicazioni dell'user
        const toDelete = await User.findById(req.params.id);
        if(toDelete.role == 'user')
        {
           await Publication.deleteMany({user:toDelete.id});
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        
        return res.status(200).json({
            success: true,
            message: 'Account eliminato con successo'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Errore nell'eliminazione dell'account " + error.message,
            error: error.message
        });
    }
})

router.get('/:id', async (req, res) => {
    let user = req['user'];
    res.status(200).json({
        self: '/api/v2/users/' + user._id,
        _id: user._id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email
    });
});

router.post("/admin",  adminChecker, async (req, res) => {

    try {
        const { name, surname, username, password, email } = req.body;
        const role = "admin"
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(!username){
            return res.status(400).json({
                success: false, error: "Username mancante",
            });
        }
        if(!surname){
            return res.status(400).json({
                success: false, error: "Cognome mancante",
            });
        }
        if(!name){
            return res.status(400).json({
                success: false, error: "Nome mancante",
            });
        }

        if(!email){
            return res.status(400).json({
                success: false, error: "Email mancante",
            });
        }
        

        const existingUser = await User.findOne({
            $or: [{email}, {username}],
        })

        if(existingUser) {
            return res.status(400).json({
                success: false, error: "Username o email già esistente",
            });
        }
        if(!password || password.length < 8) {
            return res.status(400).json({
               success: false,  error: "La password deve contenere almeno 8 caratteri",
            });
        }
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                success: false, error: "Email non valida",
            });}


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            role,
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
            },
            process.env.SUPER_SECRET,
            { expiresIn: 86400 }
        );

        res.status(201).json({
            success: true,
            message: "registrazione completata",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error("Errore signup:", error);
        res.status(500).json({
            success: false,
            message: "Errore nella registrazione",
            error: error.message
        });
    };
});
router.post("/", async (req, res) => {

    try {
        const { name, surname, username, email, password } = req.body;
        const role = "user"
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(!username){
            return res.status(400).json({
                success: false, error: "Username mancante",
            });
        }
        if(!surname){
            return res.status(400).json({
                success: false, error: "Cognome mancante",
            });
        }
        if(!name){
            return res.status(400).json({
                success: false, error: "Nome mancante",
            });
        }
        if(!email){
            return res.status(400).json({
                success: false, error: "Email mancante",
            });
        }
        

        const existingUser = await User.findOne({
            $or: [{email}, {username}],
        })

        if(existingUser) {
            return res.status(400).json({
                success: false, error: "Email o username già esistente",
            });
        }
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                success: false, error: "Email non valida",
            });}
        if(!password || password.length < 8) {
            return res.status(400).json({
               success: false,  error: "La password deve contenere almeno 8 caratteri",
            });
        }
    


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            role,
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            process.env.SUPER_SECRET,
            { expiresIn: 86400 }
        );

        res.status(201).json({
            success: true,
            message: "registrazione completata",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error("Errore signup:", error);
        res.status(500).json({
            success: false,
            message: "Errore nella registrazione",
            error: error.message
        });
    };
});



router.put("/:id", tokenChecker,  async (req, res) => {

    try {
        const userId = req.loggedUser.id;
        let user = req['user']
        
        //controllo sia l'user stesso o un admin
        if (String(user.id) !== String(userId) && req.loggedUser.role !== "admin") {
            return res.status(403).json({success: false, error: "Non sei autorizzato a modificare i dati di questo utente." });
        }
        //per ora non si può cambiare il ruolo nè l'id
        const { username, new_password, old_password, email, name, surname } = req.body;

        
        //check che username sia univoco
        if (username) {
            const existingUser = await User.findOne({username})
            if (existingUser && String(existingUser.id) != String(userId)) {
                return res.status(400).json({success: false, error: "Username già esistente" });
            }
            user.username = username
        }
        //check che email sia univoca e regex
        if (email) {
            const existingUser = await User.findOne({email})
            if (existingUser && String(existingUser.id) != String(userId)) {
                return res.status(400).json({success: false, error: "Email già esistente" });
            }
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if(!emailRegex.test(email)) {
                return res.status(400).json({success: false, error: "Email non valida", });
            }
            user.email = email
        }
        if (new_password) {
            if (new_password.length < 8) {
                return res.status(400).json({success: false, error: "La password deve contenere almeno 8 caratteri" });
            }
            if(!old_password)
            {
                return res.status(400).json({success: false, error: "Inserire la vecchia password" });
            }
            const isMatch = await bcrypt.compare(old_password, user.password);
            if(!isMatch)
            {
                return res.status(400).json({success: false, error: "Vecchia password errata" });
            }
            user.password = await bcrypt.hash(new_password, 10);

        }
        if (name) {
            user.name = name
        }
        if (surname) {
            user.surname = surname
        }
        const updatedUser = await user.save();
        res.status(200).json({
            message: "User aggiornato con successo!",
            user: updatedUser,
            self: "/api/v2/users/" + userId
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Errore nella modifica Utente",
            error: error.message
        });
    };
});
export default router;