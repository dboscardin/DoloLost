import 'dotenv/config'
import app from './app/app.js'
import mongoose from 'mongoose'; 


app.locals.db = mongoose.connect(process.env.DB_URL).then ( () => {
    console.log("Connected to Database");
    app.listen(8080, () => { console.log(`Server listening`) });
});