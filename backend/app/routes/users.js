import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const router = express.Router();
import tokenChecker from '../middleware/tokenChecker.js'
import adminChecker from '../middleware/adminChecker.js'

//aggiungere qui le route per le pubblicazioni

router.post("/", async (req, res) => {

    try {
        const { name, surname, username, email, password } = req.body;
        const role = "user"
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


export default router;