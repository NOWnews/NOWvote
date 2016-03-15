
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

    status: {
        type: Boolean,
        default: true
    },

    continued: {
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
    },

    trashed: {
        type: Boolean,
        default: false
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

/*
 * 找出有效的 categoryMenu
 */
schema.statics.findEffective = co.wrap(function*() {

    let self = this;
    let now = Date.now();
    console.log(now);

    return yield self.find()
        .where('trashed').equals(false)
        .where('status').equals(true)
        .or([
            { continued: true },
            { startTime: { $lte: now }, endTime: { $gte: now } }
        ])
        .sort('weight')
        .execAsync();
});

schema.plugin(autoIncrement.plugin, {
    model: 'menuCategory',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('menuCategory', schema);
