const mongoose = require("mongoose");
const { PROGRESS_STS } = require('../../../configuration/constants/courseConstant')

const schema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "publishCourses" },
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: "publishMaterials", index: true },
    playFrom: { type: String, default: "00:00" },
    percent: { type: Number },
    nextId: { type: mongoose.Schema.Types.ObjectId, ref: "publishMaterials", default: null },
    secId: { type: mongoose.Schema.Types.ObjectId, ref: "publishSections" },
    sts: { type: Number, default: PROGRESS_STS.INPROGRESS },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    canDel: {
        type: Boolean,
        default: true,
        alias: 'canDelete'
    },
    deletedAt: { type: Date }
}, { timestamps: true });

schema.pre(["findOne", "find","findOneAndUpdate"], function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
});
const progressModel = mongoose.model("courseProgress", schema, "courseProgress");

module.exports = progressModel