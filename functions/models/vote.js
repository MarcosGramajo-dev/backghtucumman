import mongoose from 'mongoose';
// const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
    payment_id: {
        type: Number,
        required: true,
    },
    participant_id: {
        type: Number,
        required: true,
    },
    quantity_votes: {
        type: Number,
        required: true,
    }
    });
    
module.exports = mongoose.model('vote', voteSchema);