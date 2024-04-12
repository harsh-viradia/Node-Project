const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const idValidator = require("mongoose-id-validator")
const { myCustomLabels } = require("../../configuration/common")

mongoosePaginate.paginate.options = { customLabels : myCustomLabels }

const schema = new mongoose.Schema({
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "publishCourses"
    },
    courseNm: {
        type: String
    },
    withDrawnAmt: { type: Number, default: 0 },
    earnings: [{ 
        totalEarning: { type: Number, default : 0 },
        date: { type: Date },
        isEarningSend: { type: Boolean },
        month: { type: Number },
        year: { type: Number }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true })

schema.plugin(mongoosePaginate)
schema.plugin(idValidator)

const myEarning = mongoose.model("myEarning", schema, "myEarning")
module.exports = myEarning