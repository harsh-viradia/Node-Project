const mongoose = require("mongoose")
const userSchema = {
    name: { type: String },
    id: { type: mongoose.Types.ObjectId, ref: 'user' },
    countryCode: { type: String },
    mobNo: { type: String },
    email : { type: String },
    firstName: { type: String },
    lastName: { type: String },
}

const addressSchema = {
    addrLine1: { type: String, default: "" },
    addrLine2: { type: String, default: "" },
    cityNm: { type: String, default: "" },
    stateNm: { type: String, default: "" },
    countryNm: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    id: { type: mongoose.Types.ObjectId, ref: 'address' }
}

module.exports = {
    userSchema,
    addressSchema
}