const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    seoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seo",
    },
    entityNm: { type: String },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

schema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = { $exists: false };
  next();
});

const seoEntity = mongoose.model("seoEntity", schema, "seoEntities");

module.exports = seoEntity;
