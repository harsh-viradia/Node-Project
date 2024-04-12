const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var idValidator = require("mongoose-id-validator");
const {myCustomLabels} = require('../../configuration/common');
const State = require('../state/stateModel');

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String, required: true }, // state name
    code: { type: String, required: true }, // country code
    canDel: { type: Boolean, default: true },
    ISOCode3: { type: String },  // iso2 ex. IND
    ISDCode: { type: String },
    tz: { type: String }, // timezone
    ISOCode2: { type: String }, // ISO2 code ex. GJ
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
    seq: { type: Number}
  },
  { timestamps: true }
);

schema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = {$exists: false};
  next();
});

schema.pre('findOneAndUpdate', async function(next) {
  if (this._update.deletedAt) {
    await State.updateMany({ countryId: this._conditions._id }, this._update, { new: true });
  }
  next();
})

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const country = mongoose.model("country", schema, "country");
module.exports = country;
