const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2");
var idValidator = require("mongoose-id-validator");
const Schema = mongoose.Schema;

const myCustomLabels = {
    totalDocs: "itemCount",
    docs: "data",
    limit: "perPage",
    page: "currentPage",
    nextPage: "next",
    prevPage: "prev",
    totalPages: "pageCount",
    pagingCounter: "slNo",
    meta: "paginator",
};
mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

const schema = new Schema({
    type: {
        type: String, //1 for order, 2 for transaction, 3 for invoice 4 for certificate, 5 for customer id
    },
    startFrom: {
        type: Number,
        default: 0,
    },
    prefix: {
        type: String,
    },
    suffix: {
        type: String,
    },
    totalEntry: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},
    { timestamps: true }
);

schema.pre("save", async function (next) {
    next();
});

schema.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const seriesGenerator = mongoose.model('seriesGenerator', schema, 'seriesGenerator');
module.exports = seriesGenerator;