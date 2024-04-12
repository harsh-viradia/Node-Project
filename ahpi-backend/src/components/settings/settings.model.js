const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const {Schema} = require("mongoose");
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};
const settingsSchema = new mongoose.Schema(
  {
    name: { type: Schema.Types.String },
    code: { type: Schema.Types.String },
    url: { type: Schema.Types.String },
    details: { type: Schema.Types.Mixed },
    isActive: {
      type:Boolean,
      default:true
    },
    deletedAt:{
      type:Date,
    },
    deletedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
  },
  {
    timestamps: true,
  }
);

settingsSchema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = {$exists: false};
  next();
});

settingsSchema.plugin(mongoosePaginate);
settingsSchema.plugin(idValidator);
const settings = mongoose.model('settings', settingsSchema,'settings');

module.exports = settings;
