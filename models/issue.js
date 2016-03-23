
import co from 'co';
import Promise from 'bluebird';
import is from 'is_js';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const deepPopulate = require('mongoose-deep-populate')(mongoose);

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

    // issue 內容業主圖
    mainImage: {
        type: String
    },

    // issue 列表頁縮圖
    thumbnail: {
        type: String
    },

    type: {
        type: Schema.Types.ObjectId,
        ref: 'type'
    },

    status: {
        type: Boolean,
        default: true
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
        type: Boolean,
        default: false
    },

    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'question'
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

schema.plugin(deepPopulate);

/*
 * 找出首頁 12 則 issue，按照創造時間排序
 */
schema.statics.findIndexIssues = co.wrap(function*() {

    let self = this;
    let now = Date.now();

    return yield self.find()
        .where('trashed').equals(false)
        .where('status').equals(true)
        .or([
            { continued: true },
            { startTime: { $lte: now }, endTime: { $gte: now } }
        ])
        .limit(12)
        .sort('-createdAt')
        .execAsync();
});

schema.plugin(autoIncrement.plugin, {
    model: 'issue',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('issue', schema);
