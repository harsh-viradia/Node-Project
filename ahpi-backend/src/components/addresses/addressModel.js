const mongoose = require("mongoose");
const {myCustomLabels} = require('../../configuration/common')
const mongoosePaginate = require("mongoose-paginate-v2");
var idValidator = require("mongoose-id-validator");

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    addrLine1: { type: String },
    addrLine2: { type: String },
    stateId: { type: Schema.Types.ObjectId, ref: "state" }, //user's state Id
    stateNm: { type: String }, //user's state name
    cityId: { type: Schema.Types.ObjectId, ref: "city" }, //user's city id
    cityNm: { type: String }, //user's city Name
    countryId: { type: Schema.Types.ObjectId, ref: "country" },
    countryNm: { type: String }, //user's country Name
    zipcodeId: { type: Schema.Types.ObjectId, ref: "zipcode" },
    zipcode: { type: String }, //user's zipcode Name
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    isDefault: { type: Boolean, default: false },
    canDel:{ type:Boolean, default: true, alias: 'canDelete' },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

schema.pre('save', async function (next) {
  const firstAddress = await address.findOne({userId: this.userId})
  if (!firstAddress) {
    this.isDefault = true,
    this.canDel = false
  }
  next()
})

schema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = {$exists: false};
    next();
  });
  
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

var address = mongoose.model("address", schema, "address");
module.exports = address;
