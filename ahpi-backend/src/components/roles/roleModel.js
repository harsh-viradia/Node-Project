const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator");
const { myCustomLabels } = require("../../configuration/common");

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
};
const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    // Key use for can Delete validation. It will be default false.
    canDel: {
      type: Boolean,
      default: true,
      required: true,
      alias: "canDelete",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isUnq: {
      type: Boolean,
      default: false,
      alias: "isUnique",
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

RoleSchema.pre(["findOne", "find"], function (next) {
  this.getQuery().deletedAt = { $exists: false };
  next();
});

RoleSchema.plugin(mongoosePaginate);
RoleSchema.plugin(idValidator);
const Role = mongoose.model("role", RoleSchema, "role");

module.exports = Role;
