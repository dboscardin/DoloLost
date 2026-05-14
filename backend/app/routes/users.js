import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Funziona!");
});


export default router;