const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require('mongoose-id-validator')
const Schema = mongoose.Schema;
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

const widgetTabsSchema = new Schema({
    isAlgorithmBase: { type: Boolean, default: false },
    widgetId: { type: Schema.Types.ObjectId, ref:"widgets" },
    type: { type: Schema.Types.ObjectId, ref:"master" },
    cardType: {type: Schema.Types.ObjectId, ref:"master"},
    name: {type: String},
    course: [{  type: Schema.Types.ObjectId, ref: 'publishCourses' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    isActive: {
        type: Boolean,
        default: true
    },
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

widgetTabsSchema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = {$exists: false};
    next();
});

widgetTabsSchema.plugin(mongoosePaginate);
widgetTabsSchema.plugin(idValidator)

const widgetTabsModel = mongoose.model('widgetTabs', widgetTabsSchema, 'widgetTabs');
module.exports = widgetTabsModel;
