const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { myCustomLabels } = require('../../configuration/common');
const Schema = mongoose.Schema;

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels
}

const schema = new Schema({
    notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'notification' },
    deviceToken: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    type: { type: String },
    isRead: { type: Boolean, default: false },
    updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
},
    { timestamps: true }
)

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

var notificationsList = mongoose.model('notificationsList', schema, 'notificationsList')
module.exports = notificationsList;