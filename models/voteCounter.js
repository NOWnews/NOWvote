/*
 * 這個 model 是用來記錄 issue 有多少投票人員
 */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({

    issue: {
        type: Schema.Types.ObjectId,
        ref: 'issue'
    },

    counter: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('voteCounter', schema);