const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    rejectReason: { type: String },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "draftCourses" },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const rejectCourseLog = mongoose.model("rejectCourseLog", schema, "rejectCourseLog");

module.exports = rejectCourseLog;
