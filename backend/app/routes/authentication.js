import express from 'express';
import User from '../models/user.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const router = express.Router();

router.post("/signup", async (req, res) => {

    try {
        const { name, surname, username, email, password, role } = req.body;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        const existingUser = await User.findOne({
            $or: [{email}, {username}],
        })

        if(existingUser) {
            return res.status(400).json({
                message: "Email o username già esistente",
            });
        } else if(!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Email non valida",
            });
        } else if(password.length < 8) {
            return res.status(400).json({
                message: "La password deve contenere almeno 8 caratteri",
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
        console.log("Utente creato:", newUser);
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
        console.log("Token creato");

        res.status(201).json({
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

router.post('', async function(req, res) {
    try {
        let user = await User.findOne({ username: req.body.username }).exec()

        if (!user) {
            return res.status(404).json({
                success:false,
                message:'Utente non trovato'
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success:false,
                message:'Password errata'
            });
        }
        
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
        const options = { expiresIn: 3600 } // expires in 1 hour
        console.log("Token creato");
        const token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        //dati in chiaro
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            username: user.username,
            name: user.name,
            id: user._id,
            role: user.role /*, self: "api/v1/" + user._id*/
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Errore nel login',
            error: error.message
        });
    }
});
export default router;
