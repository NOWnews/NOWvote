

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({

    issue: {
        type: Schema.Types.ObjectId,
        ref: 'issue'
    },

    tag: {
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }
});

module.exports = mongoose.model('tagRelation', schema);