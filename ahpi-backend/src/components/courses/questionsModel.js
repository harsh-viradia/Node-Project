const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const commonSchema = require("./commonSchema");
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

// Question schemas
const draftQues = new mongoose.Schema(
  {
    ...commonSchema.questionsSchema(),
  },
  { timestamps: true }
);

const publishQues = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "draftQuestions" },
    ...commonSchema.questionsSchema(),
  },
  { timestamps: true }
);

draftQues.plugin(mongoosePaginate);
draftQues.plugin(idValidator);

publishQues.plugin(mongoosePaginate);
publishQues.plugin(idValidator);

draftQues.pre("save", async function (next) {
  const count = await draftQuestions.count({
    courseId: this.courseId,
    secId: this.secId,
    quizId: this.quizId
  });
  this.seq = count + 1;
  next();
});

publishQues.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = {$exists: false};
  next();
});

var draftQuestions = mongoose.model(
  "draftQuestions",
  draftQues,
  "draftQuestions"
);
const publishQuestions = mongoose.model(
  "publishQuestions",
  publishQues,
  "publishQuestions"
);

module.exports = {
  draftQuestions,
  publishQuestions,
};
