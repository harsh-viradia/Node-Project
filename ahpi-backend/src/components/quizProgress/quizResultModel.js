const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const idValidator = require('mongoose-id-validator');
const { QUIZ_STS } = require('../../configuration/constants/courseConstant')
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {customLabels: myCustomLabels};

const schema = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'publishCourses', index: true}, 
        secId: { type: Schema.Types.ObjectId, ref: 'publishSections', index: true },
        quizId: { type: Schema.Types.ObjectId, ref: 'publishMaterials', index: true },
        userId: { type: Schema.Types.ObjectId, ref: 'user', index: true },
        sts: {type: Number, default: QUIZ_STS.NOT_ATTEMPTED}, // 1 for not_attempted, 2 for attempted, 3 for ongoing
        totalMarks: {type: Number, default: 0},
        takenTm: {type: String, default: "00:00:00"}, // time spend on quiz.
        percentage: {type: Number, default: 0},
        isActive: {type: Boolean, default: true, index: true},
        createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'user' },
        deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
        deletedAt: { type: Date },
        totalAttempts: {type: Number},
    },
    {
        timestamps: true,
        toJSON: {virtuals: true}
    }
);

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

schema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
});

const quizResult = mongoose.model('quizResult', schema, 'quizResults');
module.exports = quizResult;