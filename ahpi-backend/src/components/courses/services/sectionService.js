const { draftSections, publishSections } = require('../sectionModel')
const { publishCourses, draftCourses } = require('../courseModel')
const dbService = require("../../../services/db.service");
const {ObjectId} = require('mongodb')
const { draftMaterials, publishMaterials } = require("../materialsModel");
const { draftQuestions, publishQuestions } = require("../questionsModel");
const {commonProjection} = require('../../../configuration/common')
const { PROGRESS_STS } = require('../../../configuration/constants/courseConstant')

const addSection = async(data) => {
    try {
        const result = await draftSections.create(data)
        return result
    } catch (error) {
        logger.error('Error - addSection', error)
        throw new Error(error)
    }
}

const updateSection = async(id, data) => {
    try {
        const result = await draftSections.findOneAndUpdate({_id: id}, data, { new: true })
        return result
    } catch (error) {
        logger.error('Error - updateSection', error)
        throw new Error(error)
    }
}

const deleteSection = async(ids) => {
    try {
      const isMaterialsFound = await draftMaterials.find({ secId: { $in: ids } })
      if(isMaterialsFound?.length) {
        const materialIds = isMaterialsFound.map(material => material._id).filter(data => data)
        await dbService.deleteMultipleDocuments(draftMaterials, materialIds)
      }
      const isQuestionsFound = await draftQuestions.find({ secId: { $in: ids } })
      if(isQuestionsFound?.length) {
        const questionIds = isQuestionsFound.map(question => question._id).filter(data => data)
        await dbService.deleteMultipleDocuments(draftMaterials, questionIds)
      }
      await Promise.all(ids.map(async(id)=>{
          const findDoc = await draftSections.findOne({_id:id})
          await draftSections.updateMany({ seq: { $gt: findDoc?.seq }, courseId: findDoc?.courseId }, { $inc: { seq: -1 } })
      }))
      const result = await dbService.deleteMultipleDocuments(draftSections, ids)
      return result
    } catch (error) {
        logger.error('Error - deleteSection', error)
        throw new Error(error)
    }
}

const updateSequence = async(id, data) => {
    try {
        const modelSeq = await draftSections.findOne({_id: id, deletedAt:{$exists: false}})
        if ( modelSeq?.seq > data?.seq) {
          await draftSections.updateMany({ $and:[{seq: { $gte: data.seq }}, {seq: { $lt: modelSeq.seq }}], courseId: modelSeq?.courseId }, { $inc: { seq: 1 } })
        } else {
          await draftSections.updateMany({ $and:[{seq: { $gt: modelSeq.seq }}, {seq: { $lte: data.seq }}], courseId: modelSeq?.courseId }, { $inc: { seq: -1 } })
        }
        const result = await draftSections.updateOne({ _id: id }, { $set: { seq: data.seq } })
        return result
    } catch (error) {
        logger.error('Error - updateSequenceSection', error)
        throw new Error(error)
    }
}

const getList = async (data) => {
    try {
        let options = {};
        let query = {};
        if (data?.options) {
            options = {
                ...data.options,
            };
            options.sort =  data?.options?.sort ? data?.options?.sort : { seq: 1 }
        }
        if (data?.query) {
            query = {
                ...data.query,
                deletedAt:{$exists: false}
            };
        }
        const result = await dbService.getAllDocuments(draftSections, { ...query }, options);
        return result
    } catch (error) {
        logger.error("Error - sectionList", error);
        throw new Error(error);
    }
}

const getSectionsByCourse = async(req, status, model) => {
    try{
      let course
      if(req.query?.isFromAdmin) {
        course = await draftCourses.findOne({slug: req.params.slug, deletedAt: {$exists: false}})
      } else {
        course = await publishCourses.findOne({slug: req.params.slug, deletedAt: {$exists: false}, isActive: true})
      }

      let aggregateArray = [];
      let inProgressMaterial = req.userId ? [{
        $lookup: {
            from: 'myLearning',
            let: {materialId: "$_id"},
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$currentId", "$$materialId"]
                        },
                        userId: ObjectId(req.userId),
                        courseId: ObjectId(course?._id),
                        sts: PROGRESS_STS.INPROGRESS
                    }
                }
            ],
            as: "myLearning"
        }
      },
      {
          $addFields: {
              inProgress: {
                  $cond: [{$ne: [{$size: "$myLearning"}, 0]}, true, false]
              }
          }
      }, {$unset: "myLearning"} ] : []

      aggregateArray.push(
        {
          $match:{
            deletedAt:{$exists: false},
            courseId: ObjectId(course?._id)
          }
        },
        {
          $lookup:{
            from: `${status}Materials`,
            let:{id: "$_id"},
            pipeline:[
              {
                $match:{
                  $expr:{
                    $eq:["$secId", "$$id"],
                },
                deletedAt:{$exists: false}
                }
              },
              {
                $lookup:{
                  from: `${status}Questions`,
                  let:{id: "$_id"},
                  pipeline:[
                    {
                      $match:{
                        $expr:{
                          $eq:["$quizId", "$$id"],
                        },
                        deletedAt:{$exists: false},
                      }
                    },
                    {
                      $lookup: {
                        from: "master",
                        let: { id: "$queType" },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $eq: [ "$_id", "$$id" ]
                              }
                            }
                          }
                        ],
                        as: "queType"
                      }
                    },
                    {
                        $project:{
                            "opts.isAnswer": 0
                        }
                    }
                  ],
                  as: "questions"
                }
              },
              {
                $lookup:{
                  from:'file',
                  let: {id: "$docId"},
                  pipeline:[
                    {
                      $match:{
                        $expr:{
                          $eq:["$_id","$$id"]
                        }
                      }
                    },
                    {
                      $project:{
                        ...commonProjection
                      }
                    }
                  ],
                  as: "docId"
                }
              },
              {$unwind: {path:"$docId", preserveNullAndEmptyArrays: true}},
              ...inProgressMaterial,
              {
                $sort: {
                  seq: 1, createdAt: 1
                }
              }
            ],
            as: "materials"
          }
        },
        {
          $sort: {
            seq: 1, createdAt: 1
          }
        }
      )
      
      const result = await model.aggregate(aggregateArray)
      return result;
    } catch(error){
      logger.error("Error - getCourse", error)
      throw new Error(error)
    }
  }

module.exports = {
    addSection,
    updateSection,
    deleteSection,
    updateSequence,
    getList,
    getSectionsByCourse
}