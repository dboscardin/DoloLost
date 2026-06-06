import express from 'express';
import Publication from '../../models/publication.js'
import User from '../../models/user.js'
import tokenChecker from '../../middleware/tokenChecker.js'
import adminChecker from '../../middleware/adminChecker.js'
import { createClient } from '@supabase/supabase-js';
import multer  from 'multer';
import user from '../../models/user.js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
});

/*
output messages
get 200
post 201
put 200 -> con obj, 204 -> no obj
delete 200 -> conferma, 204 -> no body

400 bad input
401/403 errori di autenticazione
404 obj non trovato
500 problema interno server
*/
//Via Dietro le Mura A, Centro storico, San Giuseppe - Santa Chiara, Villazzano, Trento, Territorio Val d'Adige, Trento, Trentino-Alto Adige, 38122, Italia
//11.1239513
//46.0651365

//TENERE IN MINUSCOLO !!!!!!!
const categories = ["accessori", "elettronica", "documenti", "chiavi", "abbigliamento", "borse e zaini", "animali", "altro"];


router.use('', async (req, res, next) => {
    let pubs = Publication.find().populate('user', 'username');
    req["pubs"] = pubs;
    next();
});

router.get('/proprie', tokenChecker, async(req, res) => {
    
    const decoded = req.loggedUser;
    //console.log(decoded);
    let pubs = await req["pubs"].where('user').equals(decoded.id).exec();

    res.status(200).json(pubs);
    return;
});
router.get('/attive', async(req, res) => {
    
    //let pubs = await req["pubs"].where('state').equals('unresolved').exec();
    let query = req["pubs"].where('state').equals('unresolved');
    //console.log("attive")


    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = url.searchParams;
    const description = params.get('description');
    const category = params.get('category');
    const date_from = params.get('date_from');
    const date_before = params.get('date_before');
    const type = params.get('type');
    const distance = params.get('distance');
    const userLngLat = params.get('userLngLat')


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

    if(distance && distance < 0)
    {
        return res.status(400).json({success: false, error: "Distanza non valida" });
    }
    
    if(userLngLat)
    {
        const lnglat = userLngLat.split(',')
        if(( Number(lnglat[0]) < -180 || Number(lnglat[0]) >  180 ))
        {
             return res.status(400).json({success: false, error: "Longitudine non valida" });
        }
        
        if(Number(lnglat[1]) < -90 || lnglat[1] >  90)
        {
            return res.status(400).json({success: false, error: "Latitudine non valida" });
        }
       
    }


    if (distance && distance != 0 && userLngLat) {
        const lnglat = userLngLat.split(',')
       // console.log("distanza da:" + userLngLat + " a distanza " + distance);
        query = query.where('location').near({
            center: {
                type: 'Point',
                coordinates: [Number(lnglat[0]), Number(lnglat[1])]
            },
            maxDistance: distance
        })
    }

    let pubs = await query.exec();
    res.status(200).json(pubs);
    return;
});
router.use('/:id', tokenChecker , async (req, res, next) => {
    //se entra in questa route perchè crede che /attive sia l'id va avanti
    if (req.params.id === 'attive') return next();
    let pub = await Publication.findById(req.params.id).exec();
    if (!pub) {
        res.status(404).json({success: false, error: "Pubblicazione non trovata" })
        //console.log('Pubblicazione non trovata.')
        return;
    }
    
    
    req['pub'] = pub;
    next()
});

router.post('', tokenChecker, upload.single('image'), async(req, res) => {
    
    try {
        //quando si creano sono unresolved
        const { description, category, notes, date, type, lat, lng, address } = req.body;
        //prendo user da middleware
        const user = req.loggedUser.id;

       
        if (!description || description.trim().length < 5) {
            return res.status(400).json({success: false, error: "La descrizione deve essere di almeno 5 caratteri." });
        }
        if (description.length > 500) {
            return res.status(400).json({success: false, error: "La descrizione è troppo lunga (max 500 caratteri)." });
        }

        if (!category || !categories.includes(category.toLowerCase())) {
            return res.status(400).json({success: false, error: "Categoria non valida" });
        }

        if (notes && notes.length > 1000) {
            return res.status(400).json({success: false, error: "Le note non possono superare i 1000 caratteri." });
        }

        const eventDate = new Date(date);
        if (!date || isNaN(eventDate.getTime())) {
            return res.status(400).json({success: false, error: "Data non valida o mancante." });
        }
        if (eventDate > new Date()) {
            return res.status(400).json({success: false, error: "La data non può essere nel futuro." });
        }
        if(!address)
        {
            return res.status(400).json({success: false, error: "Indirizzo mancante" });
        }
        if(!lng || Number(lng) < -180 || Number(lng) >  180 )
        {
            return res.status(400).json({success: false, error: "Longitudine non valida" });
        }
        if(!lat || Number(lat) < -90 || Number(lat) >  90 )
        {
            return res.status(400).json({success: false, error: "Latitudine non valida" });
        }
        const location = { "type": "Point", "coordinates": [Number(lng), Number(lat)],"address": address}
        let image = null;

        const newPub = await Publication.create({description, category, notes, location,image, type, date, user});

        let pubId = newPub._id;

        if (req.file) {
           // console.log("immagine arrivata")
            const ext = req.file.originalname.split('.').pop();
            const filePath = `publications/${newPub._id}/${Date.now()}.${ext}`;

            const { error: uploadError } = await supabase
                .storage
                .from('publications')
                .upload(filePath, req.file.buffer, {contentType: req.file.mimetype, upsert: false});

            if(uploadError) {
                await Publication.findByIdAndDelete(newPub._id);
                return res.status(500).json({
                    success: false,
                    error: "Upload immagine fallito",
                    details: uploadError.message
                });
            }

            const { data: publicUrlData } = supabase
                .storage
                .from('publications')
                .getPublicUrl(filePath);
            
            newPub.image = publicUrlData.publicUrl;
            await newPub.save();
        }
        res.status(201).json({
            success: true,
            message: "Pubblicazione creata con successo",
            self: "/api/v2/publications/" + newPub._id,
            publication: newPub
        });



    } catch (error) {
        console.error("Errore creazione:", error);
        res.status(500).json({
            success: false,
            message: "Errore nella creazione pubblicazione",
            error: error.message
        });
    };

    return;
})

router.put('/:id', tokenChecker, upload.single('image'),  async(req, res) => {
    try {
       
        const user = req.loggedUser.id;
        const publication = req['pub'];
        
        //controllo che la pub sia dell'user o chiamata da un admin
        if (publication.user.toString() !== user && req.loggedUser.role !== "admin") {
            return res.status(403).json({success: false, error: "Non sei autorizzato a modificare questa pubblicazione." });
        }

        const { description, category, notes, image, date, type, state } = req.body;

        if (description) {
            if (description.trim().length < 5 || description.length > 500) {
                return res.status(400).json({success: false, error: "La descrizione deve essere tra 5 e 500 caratteri." });
            }
            publication.description = description;
        }

        if (category) {
            if (!categories.includes(category.toLowerCase())) {
                return res.status(400).json({ success: false, error: "Categoria non valida." });
            }
            publication.category = category;
        }

        if (date) {
            const eventDate = new Date(date);
            if (isNaN(eventDate.getTime()) || eventDate > new Date()) {
                return res.status(400).json({success: false, error: "Data non valida o nel futuro." });
            }
            publication.date = date;
        }

        if (state) {
            const validStates = ['unresolved', 'solved', 'decayed'];
            if (!validStates.includes(state)) {
                return res.status(400).json({success: false, error: "Stato non valido (deve essere 'unresolved', 'solved', 'decayed')." });
            }
            publication.state = state;
        }

       
        if (notes !== undefined) publication.notes = notes;
       // if (image !== undefined) publication.image = image;
        if (type) publication.type = type;

        if (req.file) {
           // console.log('file arrivato' + req.file);
            const ext = req.file.originalname.split('.').pop();
            const filePath = `publications/${publication._id}/${Date.now()}.${ext}`;

            const { error: uploadError } = await supabase
                .storage
                .from('publications')
                .upload(filePath, req.file.buffer, {contentType: req.file.mimetype, upsert: false});

            if(uploadError) {
                //await Publication.findByIdAndDelete(publication.id);
                return res.status(500).json({
                    success: false,
                    error: "Upload immagine fallito",
                    details: uploadError.message
                });
            }

            const { data: publicUrlData } = supabase
                .storage
                .from('publications')
                .getPublicUrl(filePath);
            
            publication.image = publicUrlData.publicUrl;
        }

        
        const updatedPub = await publication.save();




        
        res.status(200).json({
            success: true,
            message: "Pubblicazione aggiornata con successo!",
            publication: updatedPub,
            self: "/api/v2/publications/" + updatedPub._id
        });

    }
    catch (error) {
        console.error("Errore modifica:", error);
        res.status(500).json({
             success: false,
            message: "Errore nella modifica pubblicazione",
            error: error.message
        });
    };

    return;
})


router.get('/:id', tokenChecker, async (req, res) => {
    let pub = req['pub'];
    res.status(200).json({
        self: '/api/v2/pub/' + pub._id,
        _id: pub._id,
        description: pub.description,
        category: pub.category,
        user: pub.user,
        date: pub.date,
        notes: pub.notes,
        image: pub.image,
        state: pub.state,
        type: pub.type,
        //se da problemi si più decomporre nei singoli
        location: pub.location
    });
});

router.delete('/:id', tokenChecker, async (req, res) => {
    let pub = req['pub'];
    const user = req.loggedUser.id;
    //controllo che la pub sia dell'user o chiamata da un admin
        if (pub.user.toString() !== user && req.loggedUser.role !== "admin") {
            return res.status(403).json({success:false,  error: "Non sei autorizzato a eliminare questa pubblicazione." });
        }
    let result = await Publication.deleteOne({"_id": pub._id})
    res.status(result? 200: 500).json({success: result})
})


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
    const distance = params.get('distance');
    const userLngLat = params.get('userLngLat')
    
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

    if(distance && distance < 0)
    {
        return res.status(400).json({success: false, error: "Distanza non valida" })
    }
    
   if(userLngLat )
    {
        const lnglat = userLngLat.split(',')
        if(( Number(lnglat[0]) < -180 || Number(lnglat[0]) >  180 ))
        {
             return res.status(400).json({success: false, error: "Longitudine non valida" });
        }
        
        if(Number(lnglat[1]) < -90 || lnglat[1] >  90)
        {
            return res.status(400).json({success: false, error: "Latitudine non valida" });
        }
       
    }


    if (distance && distance != 0 && userLngLat) {

        const lnglat = userLngLat.split(',')
       // console.log("distanza da:" + userLngLat);
        query = query.where('location').near({
            center: {
                type: 'Point',
                coordinates: [Number(lnglat[0]), Number(lnglat[1])]
            },
            maxDistance: distance
        })
    }

    let pubs = await query.exec();
    res.status(200).json(pubs);
    return;
});


export default router;