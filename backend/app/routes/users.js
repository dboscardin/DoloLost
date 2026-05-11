import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const router = express.Router();

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
            password: hashedPassword,
            role,
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
        res.status(500).json({
            message: "Errore nella registrazione",
            error: error.message
        });
    };
});


export default router;