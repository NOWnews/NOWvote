
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

/*
 * sn: [String, Number], 要查詢的編號
 * populates: [Array]，要 relation 的欄位
 * lean: [Boolean]， true 則會去掉 mongoose doc 自己的屬性
 */
schema.statics.findBySn = co.wrap(function*(sn, populates, lean) {

    let self = this;
    let thisSn = parseInt(sn, 10);

    if(lean !== undefined && !is.boolean(lean)) {
        return yield Promise.reject(new Error('lean must boolean'));
    }

    if(!is.number(thisSn)){
        return yield Promise.reject(new Error('sn must number'));
    }

    if(populates !== undefined && !is.array(populates)) {
        return yield Promise.reject(new Error('populates must array'));
    }

    let query = self
        .findOne()
        .where('sn').equals(thisSn);

    if(populates) {
        query.populate(populates);
    }

    if(lean) {
        query.lean();
    }

    return yield query.execAsync();
});

schema.plugin(autoIncrement.plugin, {
    model: 'adminUser',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('adminUser', schema);