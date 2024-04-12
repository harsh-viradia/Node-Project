const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require('mongoose-id-validator')
const Schema = mongoose.Schema;
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};
const widgetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    headingTitle: {
        type: String,
        required: true
    },
    //headingTitleID for another heading title in indonesia
    headingTitleID: {
        type: String
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: Schema.Types.ObjectId, ref: "master"
    },
    secType: {
        type: Schema.Types.ObjectId, ref:"master"
    },
    isMultiTabs: {
        type: Boolean,
        default: false //true when cardType is tabs
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAutoPlay: {
        type: Boolean,
        default: true
    },
    imgType: {
        type: Schema.Types.ObjectId, ref:"master",
    },
    img: [{
        title: String,
        titleID: String, //titleID for another title in indonesia
        alt: String,
        altID: String, //altID for another alt in indonesia
        link: String,
        fileId: {type: Schema.Types.ObjectId, ref: 'file'},
        fileIdIndo: {type: Schema.Types.ObjectId, ref: 'file'}, //fileIdIndo for another file 
    }],
    reviews: [{type: Schema.Types.ObjectId, ref: 'reviews'}],
    rowPerMobile: {type: Number},
    rowPerWeb: {type: Number},
    rowPerTablet: {type: Number},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    deletedAt: {type: Date},
}, {timestamps: true})

widgetSchema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = {$exists: false};
    next();
});

widgetSchema.plugin(mongoosePaginate);
widgetSchema.plugin(idValidator)

const widgetModel = mongoose.model('widgets', widgetSchema, 'widgets');
module.exports = widgetModel;
