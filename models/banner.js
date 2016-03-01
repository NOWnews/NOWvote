
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

const schema = new Schema({

    image: {
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

    startTime: {
        type: Date,
        default: Date.now
    },

    endTime: {
        type: Date,
        default: Date.now
    },

    trashed: {
        type: Boolean,
        default: false
    }
});

schema.plugin(autoIncrement.plugin, {
    model: 'banner',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('banner', schema);