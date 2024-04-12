const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {customLabels: myCustomLabels};
const Schema = mongoose.Schema;
const schema = new Schema({
    nm: {
        type: String,
    },
    code: {
        type: String,
        unique:true
    },
    eventName: {
        type: String
    },
    subject: {
        type: String,
    },
    body: {
        type: String,
    },
    defRecep: {type: Array},
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    updatedBy:
        {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    deletedAt: {
        type: Date,
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    isActive: {type: Boolean, default: true},

}, {timestamps: true});
schema.pre('save', async function (next) {
    this.isDeleted = false;
    this.isActive = true;
    next();
});

schema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
  });
  
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const template = mongoose.model("htmlTemplate", schema, "htmlTemplate");
module.exports = template;
