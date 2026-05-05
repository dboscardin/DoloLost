import mongoose from 'mongoose';
//import { startTransition } from 'react';
//eventualemnte importare users per il riferimento

//const mongoose = require('mongoose');

//var Schema = mongoose.Schema;

const pubSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String },
    notes: { type: String },
    imageUrl: { type: String },
    date: { type: Date },
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
pubSchema.index({ location: '2dsphere' });

//module.exports = mongoose.model('Publication', pubSchema);
export default mongoose.model('Pub', pubSchema);