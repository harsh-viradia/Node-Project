const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var idValidator = require("mongoose-id-validator");
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    nm: { type: String }, // Name
    oriNm: { type: String }, // Original name
    type: { type: String },
    exten: { type: String }, // Extension
    uri: { type: String },
    mimeType: { type: String },
    isActive: { type: Boolean, default: true},
    size: { type: Number },
    sts: { type: Number }, // Status (Processing = 0, Failed = 1, Uploaded = 2)
    dimensions: { height: Number, width: Number },
    preview: { type: String },
    mediaStatus: { type: String },
    vidObj: {
      folderNm: { type: String },
      uploadId: { type: String },
      mpdUrl: { type: String },
      hslUrl: { type: String },
      status: { type: Number }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { 
    timestamps: true,
    toObject: {
      transform: function (doc, ret, game) {
        delete ret.__v;
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.createdBy
        delete ret.updatedBy
      }
    }
  }
);

schema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = { $exists: false };
  next();
});

schema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const file = mongoose.model("file", schema, "file");
module.exports = file;
