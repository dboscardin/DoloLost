import express from 'express';
import User from './models/user.js'
const router = express.Router();


router.get('/', (req, res) => {
    res.send("Funziona!");
});


export default router;