
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

    nickname: {
        type: String,
        required: true
    },

    oauthType: {
        type: String,
        enum: ['GOOGLE', 'FACEBOOK'],
        required: true
    },

    oauthId: {
        type: String,
        required: true
    },

    email: {
        type: String
    },

    password: {
        type: String
    },

    phone: {
        type: String
    },

    address: {
        type: String
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

schema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('user', schema);