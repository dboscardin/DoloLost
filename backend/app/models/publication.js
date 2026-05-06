import mongoose from 'mongoose';

//var Schema = mongoose.Schema;

const publicationSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String },
    notes: { type: String },
    image: { type: String },
    date: { type: Date, required: true },
    //mongoDB vuole i dati geografici in formato GeoJSON 
    location: {
        type: {
        type: String,
        enum: ['Point'],
        required: true
        },
        coordinates: {
        type: [Number],
        required: true
        },
        address: {
        type: String,
        trim: true
        }
    },
    state: {
        type: String,
        enum: ['solved', 'unresolved', 'decayed'],
        default: 'unresolved'
    },
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
  }
});
//per GPS
publicationSchema.index({ location: '2dsphere' });

export default mongoose.model('Publication', publicationSchema);
