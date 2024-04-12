const mongoose = require("mongoose");
const {myCustomLabels} = require('../../configuration/common')
const mongoosePaginate = require("mongoose-paginate-v2");
var idValidator = require("mongoose-id-validator");
const Zipcode = require('../zipCode/zipModel');
const State = require('../state/stateModel');

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const Schema = mongoose.Schema;
const schema = new Schema(
  {
    name: { type: String,required:true}, // city name
    code : {type:String,required:true}, // city code
    stateId: {type: Schema.Types.ObjectId,ref: "state"},  // state id
    stateNm: {type: String}, // state name
    countryId: { type: Schema.Types.ObjectId, ref: "country" },
    canDel : {type:Boolean, default: true}, // can delete this state
    isActive : {type:Boolean,default:true},
    isDefault : {type:Boolean,default:false},
    deletedAt: {type:Date},
    createdBy: {type: Schema.Types.ObjectId,ref: "user",},
    updatedBy: [{type: Schema.Types.ObjectId,ref: "user"}],
    deletedBy: {type: Schema.Types.ObjectId,ref: "user",},
    seq: { type: Number }
},{timestamps:true}
);


schema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = {$exists: false};
  next();
});

schema.pre('updateMany', async function(next) {
  if (this._update.deletedAt) {
    await Zipcode.updateMany( {country: this._conditions.countryId}, this._update, { new: true });
  }
  next();
})

schema.pre('findOneAndUpdate', async function(next) {
  if (this._update.stateId) {
    const state = await State.findOne({ _id: this.stateId });
    this.countryId = state?.countryId;
  }
  next();
})


schema.method("toJSON", function () {
  const { __v, createdAt, updatedAt, createdBy, updatedBy, ...object } = this.toObject();
  return object;
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);



const city = mongoose.model("city", schema, "city");
module.exports = city;
