
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

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    policy: {
        type: String,
        default: 'ADMIN',
        enum: ['ADMIN']
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'adminUser',
        required: true
    },

    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'adminUser'
    },

    trashed: {
        type: Boolean,
        default: false
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
    model: 'adminUser',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('adminUser', schema);