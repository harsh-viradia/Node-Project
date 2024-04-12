const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const { QUIZ_STS } = require('../../configuration/constants/courseConstant')
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

const schema = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'publishCourses', index: true}, 
        secId: { type: Schema.Types.ObjectId, ref: 'publishSections', index: true },
        quizId: { type: Schema.Types.ObjectId, ref: 'publishMaterials', index: true },
        quesId: { type: Schema.Types.ObjectId, ref: 'publishQuestions', index: true},
        queType: { type: Schema.Types.ObjectId, ref: "master" },
        ansIds: [{ type: Schema.Types.ObjectId }],
        marks: { type: Number, default: 0 },
        isCorrect: { type: Boolean, default: false },
        sts: { type: Number, default : QUIZ_STS.NOT_ATTEMPTED}, // 1 for not_attempted, 2 for attempted
        userId: { type: Schema.Types.ObjectId, ref: 'user', index: true },
        isActive: {type: Boolean, default : true},
        takenTm: { type: String, default: "00:00:00" }, // time spend on per question.
        createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'user' },
        deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
        deletedAt: { type: Date },
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

const questionAnswer = mongoose.model('questionAnswer', schema, 'questionAnswer');
module.exports = questionAnswer;