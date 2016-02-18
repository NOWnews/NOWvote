
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

const schema = new Schema({

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
    }
});

schema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('user', schema);