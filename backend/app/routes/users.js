import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const router = express.Router();
import tokenChecker from '../middleware/tokenChecker.js'
import adminChecker from '../middleware/adminChecker.js'
//aggiungere qui le route per le pubblicazioni

router.get('/', (req, res) => {
    res.send("Funziona!");
});


export default router;