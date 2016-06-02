
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

    content: {
        type: String,
        required: true
    },

    counter: {
        type: Number,
        default: 0
    },

    fackNumber: {
        type: Number,
        default: 0
    },

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

schema.statics.increaseCounterByIds = co.wrap(function*(ids) {

    let self = this;

    if(!is.array(ids)){
        return yield Promise.reject(new Error('ids must array'));
    }

    return yield Promise.map(ids, function(id) {
        return self.findByIdAndUpdate(id, {
                $inc: { counter: 1 }
            }, {
                new: true
            })
            .execAsync();
    });
});

schema.plugin(autoIncrement.plugin, {
    model: 'option',
    field: 'sn',
    startAt: 1
});

module.exports = mongoose.model('option', schema);
