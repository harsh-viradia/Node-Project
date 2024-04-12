const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const {Schema} = require("mongoose");
const { ORDERSTATUS, TYPE, CURRENCY } = require("../../configuration/constants/paymentConstant");
const {myCustomLabels} = require('../../configuration/common');
const { userSchema, addressSchema } = require('../../configuration/commonRefSchema');

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

//schema of order.
const schema = new mongoose.Schema({
    orderNo: { type: Schema.Types.String }, // from seriesGenerator
    user: { ...userSchema, earnedRewards: { type: Number, default: 0 }, usedRewards: { type: Number, default: 0 } },
    address: addressSchema,
    payMethod: { type: Schema.Types.String, default: TYPE.PYTM },
    courses: [{
        courseId: { type: Schema.Types.ObjectId, ref:'publishCourses'},
        nm: { type: String },
        price: { type: Number }, // course original price
        sellPrice: { type: Number }, // course selling price
        primaryCat: { type: Schema.Types.ObjectId, ref: "categories"},
    }],
    sts: { type: Number, default: ORDERSTATUS.PENDING }, // 1 for success, 2 for pending, 3 for failed
    coupon: {
        couponAmt: { type: Schema.Types.Number, min: 0 },
        couponCode: { type: Schema.Types.String },
        couponType: { type: Schema.Types.ObjectId,  ref: "master" },
        couponPercent: { type: Schema.Types.Number, min: 0 }
    },
    isActive: { type: Boolean, default: true },
    currency: { type: Schema.Types.String, default: CURRENCY.INR }, // default currency is INR because we use PAYTM payment gateway.
    receiptNo: { type: Schema.Types.String }, // from seriesGenerator
    receiptId: { type: Schema.Types.ObjectId, ref: "file" },
    subTotal: { type: Schema.Types.Number, default: 0 }, // price of purchased items.
    tax: { type: Schema.Types.Number, default: 0 },
    totalCourses: { type: Schema.Types.Number, default: 0 },
    grandTotal: { type: Schema.Types.Number, default: 0 }, // final amount
    isFromOgm :{type: Schema.Types.Boolean, default: false},
    isFromOsc :{type: Schema.Types.Boolean, default: false},
    usedRewardsForOrder: { type: Number , default : 0 },
    earnedRewardsForOrder: { type: Number , default : 0 },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
    createdBy: {
        type: Schema.Types.ObjectId, ref: "user"
    },
    updatedBy: {
        type: Schema.Types.ObjectId, ref: "user"
    }
}, { timestamps: true });

schema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
  });

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const order = mongoose.model('order', schema, "orders");

module.exports = order
