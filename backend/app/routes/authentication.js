

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