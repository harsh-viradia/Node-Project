const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;
const { myCustomLabels } = require("../../configuration/common");

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    fullName: {
      type: String,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "publishCourses",
      index: true
    },
    stars: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    desc: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    deletedAt: { type: Date, index: true },
  },
  { timestamps: true }
);

reviewSchema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = { $exists: false };
  next();
});

reviewSchema.index({createdAt: -1})

reviewSchema.plugin(mongoosePaginate);
const pageModel = mongoose.model("reviews", reviewSchema, "reviews");
module.exports = pageModel;
