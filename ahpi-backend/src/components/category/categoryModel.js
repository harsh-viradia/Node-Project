const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

//schema of category.
const schema = new mongoose.Schema({
    name: { type: String },
    slug: { type: String },
    parentCategory: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }
    ], // parent catgory
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "file"
    },
    description: { type: String },
    topics: [{type: mongoose.Schema.Types.ObjectId, ref: "master"}],
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
    canDel:{
        type:Boolean,
        default:true,
        alias: 'canDelete'
      },
    deletedAt: { type: Date },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

schema.pre("save", async function (next) {
    this.slug = slugify(this.name);
    next();
});

schema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = {$exists: false};
    next();
  });

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const category = mongoose.model('categories', schema, "categories");

module.exports = category
