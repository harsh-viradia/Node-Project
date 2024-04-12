const mongoose = require("mongoose")
const idValidator = require("mongoose-id-validator")
const mongoosePaginate = require("mongoose-paginate-v2")
const {myCustomLabels} = require("../../configuration/common")

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
}

const schema = mongoose.Schema({
    payoutType: { type: Number },
    status: { type: String },
    trnsType: { type: String },
    amt: { type: Number },
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    month: { type: Number },
    currency: { type: mongoose.Types.ObjectId, ref: "master" },
    year: { type: Number },
    transferDate: { type: Date },
    desc: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "user" },
}, {
    timestamps: true
})

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const payoutModel = mongoose.model("payout", schema, "payout")

module.exports = payoutModel