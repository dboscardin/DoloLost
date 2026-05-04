import mongoose from 'mongoose';
var Schema = mongoose.Schema;
const UserSchema = new Schema({
    //qui ci vanno i dati
});

export default mongoose.model('User', UserSchema);
