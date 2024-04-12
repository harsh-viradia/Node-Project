const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    metaTitle: { type: String, maxLength: 70 }, //meta title
    metaDesc: { type: String, maxLength: 150 }, //meta description
    keyWords: { type: String },
    slug: { type: String },
    author: { type: String },
    imgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "file",
    },
    ogTitle: { type: String, maxLength: 70 }, //OpenGraph Title
    ogDesc: { type: String, maxLength: 150 }, // OpenGraph Description
    script: {},
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

schema.pre("save", async function (next) {
  this.slug = slugify(this?.metaTitle);
  next();
});
schema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = { $exists: false };
  next();
});

const seoModel = mongoose.model("seo", schema, "seo");

module.exports = seoModel;
