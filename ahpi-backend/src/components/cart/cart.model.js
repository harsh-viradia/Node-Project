const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const {Schema} = require("mongoose");
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

//schema of Cart.
const schema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'user'}, 
    deviceToken: {type: String}, //mac address or another unique value to identify device
    fcmToken: {type: String}, //firebase notification token
    courses: [{type: Schema.Types.ObjectId, ref: 'publishCourses'}],
    coupon: {
        couponAmt: { type: Schema.Types.Number, min: 0 },
        couponCode: { type: Schema.Types.String },
        couponType: { type: Schema.Types.ObjectId,  ref: "master" },
        couponPercent: { type: Schema.Types.Number, min: 0 }
    },
    createdBy: {
        type: Schema.Types.ObjectId, ref: "user"
    },
    updatedBy: {
        type: Schema.Types.ObjectId, ref: "user"
    },
    deletedAt: {type: Date},
}, {timestamps: true});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const cart = mongoose.model('carts', schema, "carts");

module.exports = cart
