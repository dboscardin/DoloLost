import 'dotenv/config'
import app from './app/app.js'
import mongoose from 'mongoose'; 

//apre le api sulla 8080
app.locals.db = mongoose.connect(process.env.DB_URL).then ( () => {
    console.log("Connected to Database");
    app.listen(8080, () => { console.log(`Server listening`) });
});