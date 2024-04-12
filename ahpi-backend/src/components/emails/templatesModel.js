const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

const schema = new Schema({
    nm: {
        type: String,
    },
    code: {
        type: String,
        unique: true
    },
    subject: {
        type: String,
    },
    body: {
        type: String,
    },
    defRecep: { type: Array }, // different recipients
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
    isActive: { type: Boolean, default: true },

}, { timestamps: true });

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const templates = mongoose.model("ejsTemplates", schema, "ejsTemplates");
module.exports = templates;
