

import express from 'express';
import User from './models/user.js'
import jwt from 'jsonwebtoken';

const router = express.Router();

//da chiamare in qualche modo quando si fa il login
router.post('', async function(req, res) {
    let user = await User.findOne({ username: req.body.username }).exec()
    if (!user) res.json({success:false,message:'User not found'})
    if (user.password!=req.body.password) res.json({success:false,message:'Wrong password'})
    // user authenticated -> create a token
    //dati criptati
    var payload = { username: user.username, id: user._id, role: user.role , other_data: encrypted_in_the_token }
    var options = { expiresIn: 86400 } // expires in 24 hours
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    //dati in chiaro
    res.json({ success: true, message: 'Enjoy your token!',
        token: token, username: user.username, name: user.name, id: user._id, role: user.role , self: "api/v1/" + user._id
    });
});
export default router;