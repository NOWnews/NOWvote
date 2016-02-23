
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

const schema = new Schema({

    title: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    weight: {
        type: Number,
        default: 0
    },

    status: {
        type: Boolean,
        default: true
    },

    trashed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('menu', schema);