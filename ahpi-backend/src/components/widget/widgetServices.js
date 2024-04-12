const dbService = require("../../services/db.service");
const Widget = require('./widgetModel')
const WidgetTabs = require('./widgetTabsModel')
const {ObjectId} = require('mongodb')
const {Master} = require("@knovator/masters-node");
const { commonProjection } = require('../../configuration/common')
const {topCategoryByHighestSell, topCourseByHighestSell} = require("../courses/services/courseService");

const codeExists = async ({ id, data }) => {
    return await Widget.findOne({ code: data.code, ...( id ? { _id: { $ne: id } } : {}), deletedAt : { $exists : false } });
}

const create = async (data) => {
    try {
        let result;
        let tabs = []
        data.code = data?.code?.toString().toUpperCase().replace(/\s+/g, "_").trim()
        if (await codeExists({ data })) {
            return { flag: false }
        } else if(data.tabs?.length == 0) {
            result = await Widget.ceate(data)
        } else {
            result = await Widget.create(data)
            if(data?.tabs){
                tabs = await Promise.all(data.tabs.map(async (tab) => {
                    tab.widgetId = result._id;
                    
                    if (tab?.isAlgorithmBase) {
                        const course = await Master.findOne({ code: 'COURSE', parentCode: 'WIDGET_TYPE' });
                        const category = await Master.findOne({ code: 'CATEGORY', parentCode: 'WIDGET_TYPE' });
                        if(tab.type && tab.type.toString() === category._id.toString()){
                            tab.categories = await topCategoryByHighestSell();
                        } else if(tab.type && tab.type.toString() === course._id.toString()){
                            tab.course = await topCourseByHighestSell();
                        }
                    }

                    const tabResult = await WidgetTabs.create(tab)
                    return tabResult
                }))
            }
        }
        result = { ...result._doc, tabs}
        return { flag: true, data: result };
    } catch (error) {
        logger.error("Error - createWidget", error);
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        let result;
        let tabs = []
        data.code = data?.code?.toString().toUpperCase().replace(/\s+/g, "_").trim()
        if (await codeExists({ data, id })) {

            return { flag: false }
        } else if(data.tabs?.length == 0) {
            result = await Widget.findOneAndUpdate({_id: id}, data, {new: true})
        } else {
            result = await Widget.findOneAndUpdate({_id: id}, data, {new: true})
            if(data?.tabs){
                await WidgetTabs.deleteMany({widgetId: id})
                tabs = await Promise.all(data.tabs?.map(async (tab) => {
                        tab.widgetId = result._id;

                        if (tab?.isAlgorithmBase) {
                            const course = await Master.findOne({ code: 'COURSE', parentCode: 'WIDGET_TYPE' });
                            const category = await Master.findOne({ code: 'CATEGORY', parentCode: 'WIDGET_TYPE' });
                            if(tab.type && tab.type.toString() === category._id.toString()){
                                tab.categories = await topCategoryByHighestSell();
                            } else if(tab.type && tab.type.toString() === course._id.toString()){
                                tab.course = await topCourseByHighestSell();
                            }
                        }

                        const tabResult = await WidgetTabs.create(tab)
                        return tabResult
                    }))
                }
            }
        result = { ...result._doc, tabs}
        return { flag: true, data: result };
    } catch (error) {
        logger.error("Error - updateWidget", error);
        throw new Error(error)
    }
}

const softDelete = async (data) => {
   try {
       if (data.ids) {
           await Widget.updateMany({ _id: { $in: data.ids } }, data)
           await WidgetTabs.updateMany({ widgetId: { $in: data.ids } }, data)
       }
       return true
 
   } catch (error) {
     logger.error('Error - deleteWidget', error)
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
            options.sort =  data?.options?.sort ? data?.options?.sort : { createdAt: -1 }
        }
        if (data?.query) {
            query = {
                ...data.query,
                ...data.filter,
                deletedAt: {$exists: false}
            };
        }
        const result = await dbService.getAllDocuments(Widget, { ...query }, options);
        return result
    } catch(error){
        logger.error("Error - getWidgetList", error);
        throw new Error(error);
    }
  }

const partialUpdate = async (data, id) => {
    try {
      await Widget.findOneAndUpdate({ _id: id }, data, { new: true });
      return true;
    } catch (error) {
        logger.error("Error - partialUpdateWidget", error);
        throw new Error(error);
    }
  }

const getWidget = async(id) => {
   const result = await Widget.aggregate([
        {
            $match: {
                _id: ObjectId(id),
                deletedAt: { $exists: false }
            }
        },
        {
            $lookup: {
                from: 'master',
                let: { id: '$type' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$id"]
                            },
                            deletedAt: {
                                $exists: false
                            },
                            isActive: true
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            names: 1,
                            code: 1
                        }
                    }
                ],
                as: 'type'
            }
        }, { $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'master',
                let: { id: '$secType' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$id"]
                            },
                            deletedAt: {
                                $exists: false
                            },
                            isActive: true
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            names: 1,
                            code: 1
                        }
                    }
                ],
                as: 'secType'
            }
        }, { $unwind: { path: "$secType", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'master',
                let: { id: '$imgType' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$id"]
                            },
                            deletedAt: {
                                $exists: false
                            },
                            isActive: true
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            names: 1,
                            code: 1
                        }
                    }
                ],
                as: 'imgType'
            }
        }, { $unwind: { path: "$imgType", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$img', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "file",
                let: { fileId: "$img.fileId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$fileId"]
                            },
                        }
                    },
                    {
                        $project: {
                            ...commonProjection
                        }
                    }
                ],
                as: "fileId"
            }
        }, { $unwind: { path: "$fileId", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "file",
                let: { fileId: "$img.fileIdIndo" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$fileId"]
                            },
                        }
                    },
                    {
                        $project: {
                            ...commonProjection
                        }
                    }
                ],
                as: "fileIdIndo"
            }
        }, { $unwind: { path: "$fileIdIndo", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "widgetTabs",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$widgetId", "$$id"]
                            },
                            deletedAt: { $exists: false },
                            isActive: true
                        },
                    },
                    {
                        $lookup: {
                            from: 'master',
                            let: { id: '$cardType' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$id"]
                                        },
                                        deletedAt: {
                                            $exists: false
                                        },
                                        isActive: true
                                    }
                                },
                                {
                                    $project: {
                                        name: 1,
                                        names: 1,
                                        code: 1
                                    }
                                }
                            ],
                            as: 'cardType'
                        }
                    }, { $unwind: { path: "$cardType", preserveNullAndEmptyArrays: true } },
                    {
                        $lookup: {
                            from: 'categories',
                            let: { category: '$categories' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ["$_id", "$$category"]
                                        },
                                        deletedAt: {
                                            $exists: false
                                        },
                                        isActive: true
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "file",
                                        let: { fileId: "$image" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ["$_id", "$$fileId"]
                                                    },
                                                }
                                            },
                                            {
                                                $project: {
                                                    ...commonProjection
                                                }
                                            }
                                        ],
                                        as: "image"
                                    }
                                }, { $unwind: { path: "$image", preserveNullAndEmptyArrays: true } },
                            ],
                            as: 'categories'
                        }
                    },
                    {
                        $lookup: {
                            from: 'publishCourses',
                            let: { course: '$course' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ["$_id", "$$course"]
                                        },
                                        deletedAt: {
                                            $exists: false
                                        },
                                        isActive: true
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "file",
                                        let: { fileId: "$imgId" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ["$_id", "$$fileId"]
                                                    },
                                                }
                                            },
                                            {
                                                $project: {
                                                    ...commonProjection
                                                }
                                            }
                                        ],
                                        as: "imgId"
                                    }
                                }, { $unwind: { path: "$imgId", preserveNullAndEmptyArrays: true } },
                                {
                                    $lookup: {
                                        from: 'categories',
                                        let: { category: '$parCategory' },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $in: ["$_id", "$$category"]
                                                    },
                                                    deletedAt: {
                                                        $exists: false
                                                    },
                                                    isActive: true
                                                }
                                            },
                                        ],
                                        as: 'parCategory'
                                    }
                                },
                            ],
                            as: 'course'
                        }
                    }
                ],
                as: "tabs"
            }
        },
        {
            $lookup: {
                from: "reviews",
                let: { review: "$reviews" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$_id", "$$review"]
                            },
                        }
                    },
                    {
                        $project: {
                            ...commonProjection
                        }
                    }
                ],
                as: "reviews"
            }
        },
        {
            $group: {
                _id: '$_id',
                tabs: { $first: "$tabs" },
                name: { $first: "$name" },
                headingTitle: { $first: "$headingTitle" },
                headingTitleID: { $first: "$headingTitleID" },
                code: { $first: '$code' },
                type: { $first: '$type' },
                secType: { $first: '$secType' },
                isMultiTabs: { $first: '$isMultiTabs' },
                isActive: { $first: '$isActive' },
                isAutoPlay: { $first: '$isAutoPlay' },
                imgType: { $first: "$imgType" },
                img: { $push: { fileId: "$fileId",fileIdIndo: "$fileIdIndo", alt: "$img.alt",altID: "$img.altID", link: "$img.link", title: "$img.title",titleID: "$img.titleID", _id: "$img._id" }},
                image : {$first : '$img'},
                reviews: { $first: '$reviews' },
                rowPerMobile: { $first: '$rowPerMobile' },
                rowPerWeb: { $first: '$rowPerWeb' },
                rowPerTablet: { $first: '$rowPerTablet' },
            }
        },
        {
            $addFields: {
                img: {
                    $cond: [{
                        $and: [
                            { $eq: ['$image', null] }
                        ]
                    }, [], '$img']
                }, 
            },
        },{$unset: "image"}
    ])
    return result;
}

const updateCourseAndCategory = async () => {
     try {
         const course = await Master.findOne({ code: 'COURSE', parentCode: 'WIDGET_TYPE'});
         const category = await Master.findOne({ code: 'CATEGORY', parentCode: 'WIDGET_TYPE' });
         const courseIds = await topCourseByHighestSell();
         const categoryIds = await topCategoryByHighestSell();
         await WidgetTabs.updateMany({ type :  course._id, isAlgorithmBase: true, deletedAt: {$exists: false} }, { $set: { course: courseIds } });
         await WidgetTabs.updateMany({ type :  category._id, isAlgorithmBase: true, deletedAt: {$exists: false} }, { $set: { categories: categoryIds } });
     }catch (error) {
         logger.error("Error - updateCourseAndCategory", error);
     }
}

module.exports = {
    create,
    update,
    softDelete,
    partialUpdate,
    getList,
    getWidget,
    updateCourseAndCategory: updateCourseAndCategory
}
