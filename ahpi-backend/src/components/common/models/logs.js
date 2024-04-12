const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { myCustomLabels } = require('../../../configuration/common');
const { LOG_STATUS } = require('../../../configuration/constants/logConstant');

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const Schema = mongoose.Schema;
const schema = new Schema({
    type: {
        type: String,
        index: true
    },
    status: {
        type: String,
        default: LOG_STATUS.PENDING,
        index: true
    },
    sentData: {
        type: JSON
    },
    isActive: { type: Boolean, default: true},
    response: {
        type: JSON
    }
}, {
    timestamps: true
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const logs = mongoose.model('logs', schema, 'logs');
module.exports = logs;