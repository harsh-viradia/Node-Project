const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { myCustomLabels } = require("../../configuration/common");

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const schema = new mongoose.Schema(
  {
    city: { type: mongoose.Schema.Types.ObjectId, ref: "city" },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "state" },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "country" },
    zipcode: { type: String },
    isActive: { type: Boolean, default: true },
    canDel: { type: Boolean, default: true },
    deletedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    updatedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    seq: {type: Number}
  },
  { timestamps: true }
);

schema.pre('save', async function(next) {
  const count  = await zipModel.count({ country: this.country, state: this.stateId, city: this.city });
  this.seq = count+1
  next()
})

schema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = {$exists: false};
  next();
});

schema.plugin(mongoosePaginate);
mongoose.plugin(idValidator);

var zipModel = mongoose.model("zipcode", schema, "zipcode");

module.exports = zipModel;
