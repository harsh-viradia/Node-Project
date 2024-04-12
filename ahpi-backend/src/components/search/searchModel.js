const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SEARCH = require('../../configuration/constants/searchConstants')

const schema = new Schema({

        title: {
            type: String,
        },
        desc: {
            type: String,
        },
        searchData: {
            type: JSON,
        },
        type: {
            type: Number,
            default: SEARCH.GLOBAL, // 1 for global search
        },
        remark: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        deviceToken: { type: String },
        userId: {
            type: Schema.Types.ObjectId, ref: "user"
        },
        searchResultCount: {
            type: Number, // total items comes in search.
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "user" },
        updatedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
        deletedBy: { type: Schema.Types.ObjectId, ref: "user" },
        deletedAt: { type: Date },
    }, 
    {timestamps: true}
);

const search = mongoose.model('search', schema, 'search')
module.exports = search;