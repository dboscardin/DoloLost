import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const router = express.Router();

//aggiungere qui le route per gli utenti

router.get('/', (req, res) => {
    res.send("Funziona!");
});

router.post("/signup", async (req, res) => {
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

        const newUser = await User.create({
            name,
            surname,
            username,
            email,
            password: hashedPasssword,
            role
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );

        
    }
    catch (error) {
        res.status(500).json({
            message: "Errore nella registrazione",
            error: error.message
        });
    };
});


export default router;