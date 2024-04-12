const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const idValidator = require('mongoose-id-validator')
const commonSchema = require('./commonSchema')
const {myCustomLabels} = require('../../configuration/common')
const { publishMaterials } = require('./materialsModel');

mongoosePaginate.paginate.options = {
    customLabels : myCustomLabels
}

 // section schemas
 const draftSection = new mongoose.Schema({
    ...commonSchema.sectionSchema(),
    
},{timestamps:true})

const publishSection = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref:'draftSections'},
    ...commonSchema.sectionSchema(),
    
},{timestamps:true})

draftSection.plugin(mongoosePaginate)
draftSection.plugin(idValidator)


publishSection.plugin(mongoosePaginate);
publishSection.plugin(idValidator)

draftSection.pre('save', async function (next)  {
    const count  = await draftSections.count({ courseId: this.courseId });
    this.seq = count+1
    next()
});
  
publishSection.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = {$exists: false};
    next();
});

publishSection.pre('deleteMany', async function (next) {
    await publishMaterials.deleteMany(this._conditions)
    next();
});


var draftSections = mongoose.model('draftSections', draftSection, 'draftSections');
var publishSections = mongoose.model('publishSections', publishSection, 'publishSections');

module.exports = {
    draftSections,
    publishSections
}