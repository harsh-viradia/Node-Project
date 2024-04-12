const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const idValidator = require('mongoose-id-validator')
const commonSchema = require('./commonSchema')
const {myCustomLabels} = require('../../configuration/common')
const { publishSections } = require('./sectionModel');

mongoosePaginate.paginate.options ={
    customLabels: myCustomLabels
}
 // course schemas
const draftCourse = new mongoose.Schema({
    ...commonSchema.courseSchema(),
    
},{timestamps:true})

const publishCourse = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref:'draftCourses'},
    ...commonSchema.courseSchema(),
    
},{timestamps:true})

draftCourse.plugin(mongoosePaginate);
draftCourse.plugin(idValidator)

publishCourse.plugin(mongoosePaginate);
publishCourse.plugin(idValidator)

publishCourse.pre(["findOne", "find"], function (next) {
    this.getQuery().deletedAt = {$exists: false};
    next();
});

publishCourse.pre('deleteOne', async function (next) {
    await publishSections.deleteMany({courseId: this._conditions._id})
    next();
});

const draftCourses = mongoose.model('draftCourses', draftCourse, 'draftCourses');
const publishCourses = mongoose.model('publishCourses', publishCourse, 'publishCourses');

module.exports = {
    draftCourses,
    publishCourses
}