const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: { type: String, required: true },
    email: {
        type: String,
        required: function () {
            return this.role === 'user';
        },
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email non valida']
    },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
