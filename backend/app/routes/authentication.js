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
});


import express from 'express';
import User from '../models/user.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const router = express.Router();

//da chiamare in qualche modo quando si fa il login
router.post('', async function(req, res) {
    //console.log(req.body.username)
    const hashPassword = await bcrypt.hash(req.body.password,10)
    let user = await User.findOne({ username: req.body.username }).exec()
    if (!user) return res.status(404).json({success:false,message:'User not found'})
    if (user.password!=hashPassword) return res.status(401).json({success:false,message:'Wrong password'})
    // user authenticated -> create a token
    //dati criptati
    var payload = { username: user.username, id: user._id, role: user.role }
    var options = { expiresIn: 86400 } // expires in 24 hours
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    //dati in chiaro
    res.json({ success: true, message: 'Enjoy your token!',
        token: token, username: user.username, name: user.name, id: user._id, role: user.role /*, self: "api/v1/" + user._id*/
    });
});
export default router;
