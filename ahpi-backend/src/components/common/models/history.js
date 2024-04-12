const mongoose = require("mongoose")

const schema = mongoose.Schema({
    module: { type: String },
    historyDetalis: {
        type: mongoose.Schema.Types.Mixed
    },
    code: { type: String },
    history_type: { type: Number }, //1 for generate certificate history 2 for paytm payment
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
}, { timestamps: true })

const historyModel = mongoose.model("history", schema, "history")

module.exports = historyModel