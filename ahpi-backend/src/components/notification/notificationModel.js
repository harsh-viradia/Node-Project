const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idValidator = require("mongoose-id-validator")
const {myCustomLabels} = require('../../configuration/common')

mongoosePaginate.paginate.options = {
    customLables : myCustomLabels
}

const schema = new mongoose.Schema({
    nm : { type : String }, //notification name
    title : { type : String }, //notification title
    desc : { type : String }, //notification description
    imgId : { type : mongoose.Schema.Types.ObjectId, ref : 'file' }, 
    btnUrl : { type : String },
    typeId : { type : mongoose.Schema.Types.ObjectId, ref : 'master' }, // notification type
    isShowList : { type : Boolean }, // notification is check for list.
    startDt : { type : Date }, // notification start date
    endDt : { type : Date }, // notification end date
    isActive : { type : Boolean, default : true },
    criteriaId: { type: mongoose.Schema.Types.ObjectId, ref : 'master'}, // Criteria Type
    userTypeId: { type: mongoose.Schema.Types.ObjectId, ref : 'master'}, // User Type: loggedIn or Guest
    pages : [
        { type: mongoose.Schema.Types.ObjectId, ref: 'page' }
    ],
    users : [
        { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    ],
    courses : [
        { type: mongoose.Schema.Types.ObjectId, ref: 'publishCourses' }
    ],
    categories : [
        { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }
    ],
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
    deletedAt: { type: Date }
}, {timestamps : true});

schema.pre('save', async function (next) {
    this.isActive = true;
    next();
});

schema.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = { $exists: false };
    next();
  });
  
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const model = mongoose.model('notification', schema, 'notification');

module.exports = model