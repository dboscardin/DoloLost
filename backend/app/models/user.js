import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Email non valida']
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

export default mongoose.model('User', userSchema);
