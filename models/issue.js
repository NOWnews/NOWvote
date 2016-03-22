
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

    type: {
        type: Schema.Types.ObjectId,
        ref: 'type'
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    continued: {
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
}, {
    timestamps: {
        updatedAt: 'updatedAt'
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
    model: 'issue',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('issue', schema);
