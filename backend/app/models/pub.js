import mongoose from 'mongoose';
//eventualemnte importare users per il riferimento
var Schema = mongoose.Schema;
const PubSchema = new Schema({
    //qui ci vanno i dati
    
});

export default mongoose.model('Pub', PubSchema);