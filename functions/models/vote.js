import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    payment_id: {
        type: String,
        required: true,
    },
    participant_id: {
        type: String,
        required: true,
    }
    });
    
module.exports = mongoose.model('vote', voteSchema);