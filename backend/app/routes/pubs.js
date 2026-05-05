import express from 'express';
import Pub from '../models/pub.js'
import User from '../models/user.js'
const router = express.Router();

//aggiungere qui le route per le pubblicazioni

router.get('/', (req, res) => {
    res.send("Funziona!");
});


export default router;