
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

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    options: [{
        type: Schema.Types.ObjectId,
        ref: 'option'
    }],

    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }],

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

schema.plugin(autoIncrement.plugin, {
    model: 'issue',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('issue', schema);