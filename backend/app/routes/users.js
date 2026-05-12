import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Funziona!");
});

/*router.post("/signup", async (req, res) => {

    try {
        const { name, surname, username, email, password, role } = req.body;

        const existingUser = await User.findOne({
            $or: [{email}, {username}],
        })

        if(existingUser) {
            return res.status(400).json({
                message: "Email o username già esistente",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("JWT secret presente?", !!process.env.SUPER_SECRET);

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
                email: newUser.email,
                role: newUser.role,
            },
            process.env.SUPER_SECRET,
            { expiresIn: "1h"}
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
            message: "Errore nella registrazione",
            error: error.message
        });
    };
});*/


export default router;