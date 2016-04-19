
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({

    method: {
        type: String
    },

    url: {
        type: String
    },

    body: {
        type: Schema.Types.Mixed
    },

    query: {
        type: Schema.Types.Mixed
    },

    message: {
        type: String
    },

    stack: {
        type: Schema.Types.Mixed
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('adminErrorLog', schema);