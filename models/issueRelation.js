
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({

    issue: {
        type: Schema.Types.ObjectId,
        ref: 'issue'
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    option: {
        type: Schema.Types.ObjectId,
        ref: 'option'
    }

});

module.exports = mongoose.model('issueRelation', schema);