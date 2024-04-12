const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var idValidator = require("mongoose-id-validator");
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

const Schema = mongoose.Schema;
const schema = new Schema(
    {
        type: { type: Number }, // 1 for save, deleted for dislike, 2 for View(24 Hours)
        courseId: { type: Schema.Types.ObjectId, ref: "publishCourses" }, // course id
        courseNm: { type: String }, // course title
        userId: { type: Schema.Types.ObjectId, ref: "user" }, // learner id from user collection
        deletedAt: { type: Date },
        createdBy: { type: Schema.Types.ObjectId, ref: "user", },
        updatedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
        deletedBy: { type: Schema.Types.ObjectId, ref: "user", },
    }, { timestamps: true }
);

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

schema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = {$exists: false};
    next();
});

schema.index({ courseId: 1 });

const wishlist = mongoose.model("wishlist", schema, "wishlist");
module.exports = wishlist;
