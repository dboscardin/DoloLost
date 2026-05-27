import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../../models/user.js';

const router = express.Router();
import tokenChecker from '../../middleware/tokenChecker.js'
import adminChecker from '../../middleware/adminChecker.js'


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

//NON SPOSTARE DA QUI!
router.delete('/me', tokenChecker, async (req, res) => {
    try {
        const loggedUserId = req.loggedUser.id;
        const deletedUser = await User.findByIdAndDelete(loggedUserId);

        if(!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'Utente non trovato'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Account eliminato con successo'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Errore nell'eliminazione dell'account",
            error: error.message
        });
    }
})


router.use('/:id', async (req, res, next) => {
   
    let pub = await User.findById(req.params.id).exec();
    if (!pub) {
        res.status(404).json({error: "Utente non trovato" })
        //console.log('user not found')
        return;
    }
    req['user'] = pub;
    next()
});

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


router.post("/", async (req, res) => {

    try {
        const { name, surname, username, email, password } = req.body;
        const role = "user"
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(!username){
            return res.status(400).json({
                success: false, message: "Username mancante",
            });
        }
        if(!surname){
            return res.status(400).json({
                success: false, message: "Cognome mancante",
            });
        }
        if(!name){
            return res.status(400).json({
                success: false, message: "Nome mancante",
            });
        }
        if(!email){
            return res.status(400).json({
                success: false, message: "Email mancante",
            });
        }
        

        const existingUser = await User.findOne({
            $or: [{email}, {username}],
        })

        if(existingUser) {
            return res.status(400).json({
                success: false, message: "Email o username già esistente",
            });
        }
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                success: false, message: "Email non valida",
            });}
        if(!password || password.length < 8) {
            return res.status(400).json({
               success: false,  message: "La password deve contenere almeno 8 caratteri",
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
       // console.log("Utente creato:", newUser);
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
        //console.log("Token creato");

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

//x ADMIN
/*router.delete('/:id', tokenChecker, adminChecker, async (req, res) => {
    try {
        const targetUserId = req.params.id;

        if(!targetUserId) {
            return res.status(404).json({
                success: false,
                message: 'Utente non trovato'
            });
        }
        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Account eliminato con successo'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Errore nell'eliminazione dell'account",
            error: error.message
        });
    }
})*/

export default router;