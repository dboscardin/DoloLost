import express from 'express';
import Publication from '../models/publication.js'
import User from '../models/user.js'
const router = express.Router();

//aggiungere qui le route per le pubblicazioni

router.use('/', async (req, res, next) => {
    let pubs = Publication.find().populate('user');
    if(!pubs){
        res.status(404).send();
        console.log("Nessuna pubblicazione trovata");
        return;
    }
    req["pubs"] = pubs;
    //console.log("Use Pubblicazioni");
    next();
});

router.get('/', async (req, res) => {
    let pubs = await req["pubs"].exec();
    //console.log("get pubblicazioni");
    res.status(200).json(pubs);
    return;
});

//paramentri per filtrare:
//Description (stringa contenuta in description)
//Category (drop down list tra una serie preimpostata) -> comunque stringa contenuta
//data -> a partire da
//tipologia (lost o found)
//posizione (sprint 2)
router.get('/attive', async(req, res) => {
    let pubs = await req["pubs"].where('state').equals('unresolved').exec();
    //console.log("get attive");
    res.status(200).json(pubs);
    return;
});

export default router;