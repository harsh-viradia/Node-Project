const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { PROGRESS_STS } = require('../../../configuration/constants/courseConstant')
const idValidator = require("mongoose-id-validator");
const { myCustomLabels } = require('../../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

const schema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "publishCourses", index: true },
    progress: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    currentId: { type: mongoose.Schema.Types.ObjectId, ref: "publishMaterials" },
    lastPlayTime: { type: String, default: "00:00:00" },
    sts: { type: Number, default: PROGRESS_STS.INPROGRESS, index: true },
    isFromOgm: { type: mongoose.Schema.Types.Boolean, default: false },
    isFromOsc: { type: mongoose.Schema.Types.Boolean, default: false },
    redirectUrl: { type: String },
    certiCode: { type: String },
    certiId: { type: mongoose.Schema.Types.ObjectId, ref: "file" },
    awardedAt: { type: Date },
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

schema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const myLearningModel = mongoose.model("myLearning", schema, "myLearning");

module.exports = myLearningModel