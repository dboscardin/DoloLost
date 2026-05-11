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


//paramentri per filtrare:
//Description (stringa contenuta in description) -> description
//Category (drop down list tra una serie preimpostata) -> comunque stringa contenuta -> category
//data -> a partire da -> date_from
//data -> prima di -> date_before
//tipologia (lost o found) -> type
//posizione (sprint 2)

router.get('/', async (req, res) => {
    let query = req["pubs"];

    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = url.searchParams;
    const description = params.get('description');
    const category = params.get('category');
    const date_from = params.get('date_from');
    const date_before = params.get('date_before');
    const type = params.get('type');


    if(description){
        query = query.where('description').regex(new RegExp(description, 'i'));
    }

    if(category)
    {
        query = query.where('category').regex(new RegExp(category, 'i'));
    }

    if (type) {
        query = query.where('type').equals(type);
    }

    if (date_from) {
        query = query.where('date').gte(new Date(date_from));
    }

    if (date_before) {
        query = query.where('date').lte(new Date(date_before));
    }

    let pubs = await query.exec();
    res.status(200).json(pubs);
    return;
});


router.get('/attive', async(req, res) => {
    //let pubs = await req["pubs"].where('state').equals('unresolved').exec();
    let query = req["pubs"].where('state').equals('unresolved');



    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = url.searchParams;
    const description = params.get('description');
    const category = params.get('category');
    const date_from = params.get('date_from');
    const date_before = params.get('date_before');
    const type = params.get('type');


    if(description){
        query = query.where('description').regex(new RegExp(description, 'i'));
    }

    if(category)
    {
        query = query.where('category').regex(new RegExp(category, 'i'));
    }

    if (type) {
        query = query.where('type').equals(type);
    }

    if (date_from) {
        query = query.where('date').gte(new Date(date_from));
    }

    if (date_before) {
        query = query.where('date').lte(new Date(date_before));
    }

    let pubs = await query.exec();
    res.status(200).json(pubs);
    return;
});

router.post('', async(req, res) => {
    
    /*
    let book = new Book({
        title: req.body.title
    });
    
	book = await book.save();
    
    let bookId = book._id;

    console.log('Book saved successfully');

    
    res.location("/api/v1/books/" + bookId).status(201).send();
    */
   //al momento ho ignorato la parte di posizione, mettendo dei parametri di default
    try {
        //quando si creano sono unresolved
        const { description, category, notes, image, date, type, user } = req.body;
        const newPub = await Publication.create({description, category, notes, image, date, type, user});
        let pubId = newPub._id;
        //da togliere il commento quando aggiungeremo la possibilità di vedere la pubblicazione singola
        //res.location("/api/v1/publications/" + pubId).status(201).send();
    }
    catch (error) {
        console.error("Errore signup:", error);
        res.status(500).json({
            message: "Errore nella creazione pubblicazione",
            error: error.message
        });
    };

    return;
})

export default router;