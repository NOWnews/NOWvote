
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({

    adminUser: {
        type: Schema.Types.ObjectId,
        ref: 'adminUser'
    },

    method: {
        type: Schema.Types.Mixed
    },

    ip: {
        type: Schema.Types.Mixed
    },

    url: {
        type: Schema.Types.Mixed
    },

    body: {
        type: Schema.Types.Mixed
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('adminLog', schema);