import 'dotenv/config'
import app from './app/app.js'
import mongoose from 'mongoose'; 

const PORT = process.env.PORT || 8080;

//apre le api sulla 8080
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connesso al DB');
        app.listen(PORT, () => {
            console.log('Server in ascolto');
        });
    })
    .catch((err) => {
        console.error('Errore nella connessione al DB: ', err);
    });
    
/*app.locals.db = mongoose.connect(process.env.DB_URL).then ( () => {
    console.log("Connected to Database");
    app.listen(8080, () => { console.log(`Server listening`) });
});*/