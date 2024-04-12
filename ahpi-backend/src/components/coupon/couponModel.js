const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;
const { myCustomLabels } = require('../../configuration/common');

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels
};

const schema = new Schema({
    name: { type: String },
    code: { type: String },
    typeId: { type: Schema.Types.ObjectId, ref: 'master' },
    appliedDate: { type: Date },
    expireDate: { type: Date },
    totalUse: { type: Number, min: 0 },
    totalPurchase: { type: Number, min: 0 },
    details: { type: String },
    discountAmount: { type: Number, min: 0 },
    discountPercentage: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    criteriaId: { type: Schema.Types.ObjectId, ref: 'master' },
    users : [
        { type: Schema.Types.ObjectId, ref: 'user' }
    ],
    buyCourses : [
        { type: Schema.Types.ObjectId, ref: 'publishCourses' }
    ],
    getCourses : [
        { type: Schema.Types.ObjectId, ref: 'publishCourses' }
    ],
    buyCategories : [
        { type: Schema.Types.ObjectId, ref: 'categories' }
    ],
    getCategories : [
        { type: Schema.Types.ObjectId, ref: 'categories' }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    deletedAt: { type: Date }
}, { timestamps: true });

schema.pre(['find', 'findOne'], async function(next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const coupon = mongoose.model('coupons', schema, 'coupons');
module.exports = coupon;