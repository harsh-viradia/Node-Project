const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { COUNTRYCONST } = require("../../configuration/constants/userConstant");
const mongoosePaginate = require("mongoose-paginate-v2");
var idValidator = require("mongoose-id-validator");
const bcrypt = require("bcrypt");
const { JOB_NAME } = require("../../configuration/constants/queueConstant");
const { createJobQueue } = require("../../services/bull-jobs/createJobs");
const { COLLECTION_REF } = require("../../configuration/constants/refUpdateConstant");

const myCustomLabels = {
  totalDocs: "itemCount",
  docs: "data",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  pagingCounter: "slNo",
  meta: "paginator",
};

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};

const schema = new Schema(
  {
    name: { type: String },
    countryCode: { type: String, default: COUNTRYCONST.INDIA },
    mobNo: { type: String }, // Mobile No of User
    bio: { type: String }, // instructor bio.
    email: { type: String },
    companyNm: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    isActive: { type: Boolean, default: true }, //isActive
    services: {
      // auth services
      linkedIn: {
        // if signup with linkedin
        allow: { type: Boolean },
        accessToken: { type: String }, // linkedinaccess token
        socialId: { type: String },
        socialType: { type: String },
        enable: { type: Boolean },
      },
    },
    socialLinks: {
      linkedIn: { type: String },
      websiteLink: { type: String },
      instaLink: { type: String },
      fbLink: { type: String }
    },
    passwords: {
      pass: { type: String }, //bcrypt password
      createdAt: { type: Date }, //password created date
      updatedAt: { type: Date }
    },
    roles: [
      { roleId: { type: Schema.Types.ObjectId, ref: "role", index: true } }, // role ref  schema = role
    ],
    bankDetails: {
      userAdd: { type: String },
      bankNm: { type: String },
      accNo: { type: String },
      swiftCode: { type: String, uppercase: true },
      refCode: { type: String },
      branchNm: { type: String },
      branchAdd: { type: String },
      branchCode: { type: String },
      cityId: { type: Schema.Types.ObjectId, ref: "city" }, //user bank city id
      cityNm: { type: String }, //user bank city Name
      countryId: { type: Schema.Types.ObjectId, ref: "country" },
      countryNm: { type: String }
    },
    agreement: {
      courseLimit: { type: Number },
      isApproved: { type: Boolean, default: false },
      category: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
      payedPercent: { type: Number },
      certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "certificate" }]
    },
    genderId: { type: Schema.Types.ObjectId, ref: "master" }, // User Gender Id
    genderNm: { type: String }, // User Gender Name
    nikNo: { type: String }, //Customs Identification Number (NIK)
    nimNo: { type: String },
    ipk: { type: String },
    tz: { type: String }, //user Timezone
    utcOffset: { type: String }, //user timezone offset
    dob: { type: Date }, //User Date of birth
    tokens: [
      {
        token: { type: String },
        expire: { type: String }
      }
    ],
    otp: {
      code: { type: Number },
      createTime: { type: String },
      createdAt: { type: Date },
      expireTime: { type: String },
    },
    registrationVerified: { type: Boolean },
    usedRewards: { type: Number, default: 0 },
    earnedRewards: { type: Number, default: 0 },
    canDel: { type: Boolean, default: true }, // can delete this record
    lastLogin: { type: Date },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
    status: { type: String },
    deviceToken: { type: Array }, //mac address or another unique value to identify device
    fcmToken: { type: Array }, // firebase token for notification
    profileId: { type: Schema.Types.ObjectId, ref: "file" },
    allCat: { type: Boolean },
    totalPurchaseCourse: { type: Schema.Types.Number, default: 0 },
    designation: {
      state: { type: mongoose.Types.ObjectId, ref: 'master' },
      place: { type: String },
      department: { type: String }
    }
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.firstName || this.lastName) {
    this.name = `${this?.firstName ? `${this?.firstName} ` : ""}${this?.lastName || ""}`
  }
  next();
});

schema.pre('findOneAndUpdate', async function (next) {
  if (this._update.firstName || this._update.lastName) {
    this._update.name = `${this?._update.firstName ? `${this?._update.firstName} ` : ""}${this?._update.lastName || ""}`
    if (this._conditions._id) {
      await mongoose.model('reviews').updateMany({ userId: this._conditions._id }, { $set: { fullName: this._update.name } }).then()
    }
  }
  next();
});

schema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = { $exists: false };
  next();
});

schema.post(["findOneAndUpdate", "findByIdAndUpdate"], async function (doc) {
  if (doc) {
    const updateData = doc.toObject();
    await createJobQueue(JOB_NAME.REF_DATA_UPDATION, { collectionDetails: COLLECTION_REF.USER, updateData })
  }
})

schema.methods.comparePass = function (password) {
  return bcrypt.compare(password, this.passwords.pass)
}

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);


const user = mongoose.model("user", schema, "user");
module.exports = user;
