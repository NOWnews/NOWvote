
import co from 'co';
import Promise from 'bluebird';
import is from 'is_js';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

const schema = new Schema({

    sn: {
        type: Number,
        required: true
    },

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

    startTime: {
        type: Date,
        default: Date.now
    },

    endTime: {
        type: Date,
        default: Date.now
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

schema.statics.findBySn = co.wrap(function*(sn) {

    let self = this;
    let thisSn = parseInt(sn, 10);

    if(!is.number(thisSn)){
        return yield Promise.reject(new Error('sn must number'));
    }

    return yield self
        .findOne()
        .where('sn').equals(thisSn)
        .execAsync();
});

schema.plugin(autoIncrement.plugin, {
    model: 'category',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('category', schema);