
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

const schema = new Schema({

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

schema.plugin(autoIncrement.plugin, {
    model: 'adminUser',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('adminUser', schema);