import mongoose from 'mongoose';
// const mongoose = require('mongoose')

const participantSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    describe: {
        type: String,
        default: '', 
    },
    votes: {
        type: Number,
        default: 0,
    },
    photo: {
        type: String,
        required: true,
    },
    quantity_votes: {
        type: Number,
        default: 0,
    },
    facebook: {
        type: String,
        default: '',
    },
    instagram: {
        type: String,
        default: '',
    },
    tiktok: {
        type: String,
        default: '',
    },
    });
    
module.exports = mongoose.model('participants', participantSchema);