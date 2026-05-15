import express from 'express';
import User from '../models/user.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const router = express.Router();



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
