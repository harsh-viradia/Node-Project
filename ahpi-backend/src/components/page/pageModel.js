const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};
const pageSchema = new Schema({
    name: {
        type: String
    },
    slug: {
        type: String
    },
    widget: [{
       widgetId: { type: Schema.Types.ObjectId, ref: 'widgets' },
       seq: {type: Number}
}],
    // Key use for can Delete validation. It will be default false.
    canDel:{
        type:Boolean,
        default:true,
        alias: 'canDelete'
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

pageSchema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
  });

pageSchema.plugin(mongoosePaginate);
const pageModel = mongoose.model('page', pageSchema, 'pages');
module.exports = pageModel;
