const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const idValidator = require('mongoose-id-validator')
const commonSchema = require('./commonSchema')
const {myCustomLabels} = require('../../configuration/common')
const { publishQuestions }= require('./questionsModel');

mongoosePaginate.paginate.options = {
    customLabels : myCustomLabels
}

 // materials schemas
 const draftMaterial = new mongoose.Schema({
    ...commonSchema.materialSchema(),
    
},{timestamps:true})

const publishMaterial = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref:'draftMaterials'},
    ...commonSchema.materialSchema(),
    
},{timestamps:true})

draftMaterial.plugin(mongoosePaginate)
draftMaterial.plugin(idValidator)


publishMaterial.plugin(mongoosePaginate);
publishMaterial.plugin(idValidator)

draftMaterial.pre('save', async function (next)  {
    const count  = await draftMaterials.count({ courseId: this.courseId, secId: this.secId });
    this.seq = count+1
    next()
});

publishMaterial.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = {$exists: false};
    next();
});

publishMaterial.pre('deleteMany', async function (next) {
    await publishQuestions.deleteMany(this._conditions)
    next();
});

var draftMaterials = mongoose.model('draftMaterials', draftMaterial, 'draftMaterials');
const publishMaterials = mongoose.model('publishMaterials', publishMaterial, 'publishMaterials');

module.exports = {
    draftMaterials,
    publishMaterials
}