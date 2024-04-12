const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { Schema } = require("mongoose");
const { myCustomLabels } = require("../../configuration/common");

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

//schema of Certificate.
const schema = new Schema(
  {
    name: { type: String },
    code: { type: String },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    description: { type: String },
    details: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const certificate = mongoose.model("certificate", schema, "certificate");

module.exports = certificate;
