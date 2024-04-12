const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { STATUS } = require('../../configuration/constants/courseConstant')

const courseSchema = () => {
  return {
    title: { type: String },
    slug: { type: String },
    category: [{ type: Schema.Types.ObjectId, ref: "categories" }],
    parCategory: [
      { type: Schema.Types.ObjectId, ref: "categories" }, // parent category
    ],
    desc: { type: String }, // description
    briefDesc: { type: String }, // brief description
    about: { type: String }, // Who should eligible for enroll Lec.
    includes: { type: String }, // what includes in course
    require: { type: String }, // requirements
    price: {
      MRP: { type: Number },
      sellPrice: { type: Number },
      InAppPurchaseSellPrice: { type: Number },
      InAppPurchaseMRP: { type: Number },
      InAppPurchaseProductId: { type: String },
    },
    levelId: { type: Schema.Types.ObjectId, ref: "master" },
    badgeId: { type: Schema.Types.ObjectId, ref: "master" },
    lang: { type: Schema.Types.ObjectId, ref: "master" }, // language
    imgId: { type: Schema.Types.ObjectId, ref: "file" }, // image
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    certiPrefix: { type: String },
    sts: { type: Number, default: STATUS.DRAFT }, // 1 for draft, 2 for publish
    isActive: { type: Boolean, default: false },
    avgStars: { type: Number, min: 0, default: 0}, // average ratings
    totalReviews: { type: Number, min: 0, default: 0}, // total reviews
    ratings: {
      '0Stars': { type: Number, min: 0, default: 0 },
      '1Stars': { type: Number, min: 0, default: 0 },
      '2Stars': { type: Number, min: 0, default: 0 },
      '3Stars': { type: Number, min: 0, default: 0 },
      '4Stars': { type: Number, min: 0, default: 0 },
      '5Stars': { type: Number, min: 0, default: 0 }
    },
    activatedAt: { type: Date },
    totalLessons: { type: Number },
    totalLength: { type: Number },
    isApproved: { type: Boolean },
    isPreview : { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isReject: { type: Boolean, default: false },
    certificateId : { type: mongoose.Schema.Types.ObjectId, ref: 'certificate' },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
    deletedAt: { type: Date },
    rewardPoints : { type: Number, default : 0 }
  };
};

const sectionSchema = () => {
  return {
    nm: { type: String }, // name
    desc: { type: String }, // description
    seq: { type: Number, default: 0 }, // sequence
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    courseId: { type: Schema.Types.ObjectId },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
    deletedAt: { type: Date },
  };
};

const materialSchema = () => {
  return {
    nm: { type: String }, // name
    desc: { type: String }, // description
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    courseId: { type: Schema.Types.ObjectId },
    secId: { type: Schema.Types.ObjectId },
    type: { type: Number }, // 1 for video, 2 for quiz, 3 for text, 4 for documents, 5 for quiz with certificate
    vidId: { type: Schema.Types.ObjectId, ref: "file" }, // videoId
    viewSetOfQue: { type: Number }, // total number of questions we want to display
    seq: { type: Number }, // sequence of question
    duration: { type: String, default: "00:00:00" }, // duration of quiz
    completionPercent: { type: Number }, // percentage for completing one material.
    passingScore: { type: Number }, // number for passing score of quiz.
    text: { type: String },
    docId: { type: Schema.Types.ObjectId, ref: "file" }, // document Id
    canDownload: { type: Boolean, default: false }, // can download documents
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
    deletedAt: { type: Date },
  };
};

const questionsSchema = () => {
  return {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    courseId: { type: Schema.Types.ObjectId },
    secId: { type: Schema.Types.ObjectId },
    quizId: { type: Schema.Types.ObjectId },
    queType: { type: Schema.Types.ObjectId, ref: "master" }, // MCQ type, MSQ type
    ques: { type: String },
    seq: { type: Number }, // sequence of question.
    opts: [
      {
        nm: { type: String },
        seq: { type: Number }, // sequence of options.
        isAnswer: { type: Boolean, default: false },
      },
    ], // options
    posMark: {type: Number, default: 1},
    negMark: {type: Number, default: 0},
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
    deletedAt: { type: Date },
  };
};

module.exports = {
  courseSchema,
  sectionSchema,
  materialSchema,
  questionsSchema,
};
