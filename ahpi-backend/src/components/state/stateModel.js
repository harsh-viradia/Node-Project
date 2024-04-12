const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var idValidator = require("mongoose-id-validator");
const {myCustomLabels} = require('../../configuration/common')
const City = require('../city/cityModel');

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String, required: true }, // state name
    code: { type: String, required: true }, // country code
    countryId: { type: Schema.Types.ObjectId, ref: "country" },
    countryNm: { type: String }, //Country name , which belongs to this state
    canDel: { type: Boolean, default: true },
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

schema.pre('updateMany', async function(next) {
  if (this._update.deletedAt) {
    await City.updateMany( this._conditions, this._update, { new: true });
  }
  next();
})

schema.method("toJSON", function () {
  const { __v, createdAt, updatedAt, createdBy, updatedBy, ...object } = this.toObject();
  return object;
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const state = mongoose.model("state", schema, "state");
module.exports = state;
