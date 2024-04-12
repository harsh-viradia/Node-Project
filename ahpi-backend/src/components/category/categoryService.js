const dbService = require("../../services/db.service");
const Category = require("./categoryModel");
const mongoose = require("mongoose");
const { convertPaginationResult } = require("../../configuration/common");
const seoEntity = require("../seo/seoEntities");
const seoModel = require("../seo/seoModel");
const user = require("../user/userModel");

//findSlug.
const slugExist = async ({ id, data }) => {
    return await Category.findOne({ slug: slugify(data?.name), ...(id ? { _id: { $ne: id } } : {}), deletedAt: { $exists: false } });
}

//create category.
const create = async (data) => {
    try {
        if (await slugExist({ data })) {
            return { flag: false }
        }

        const result = await dbService.createDocument(Category, data);
        const resp = {
            "name": result.name,
            "parentCategory": result.parentCategory,
            "image": result.image,
            "description": result.description,
            "topics": result.topics,
            "canDel": result.canDel,
            "isActive": result.isActive,
            "slug": result.slug,
            _id: result._id
        }
        return { flag: true, data: resp };
    } catch (error) {
        logger.error("Error - createCategory", error);
        throw new Error(error)
    }

}

//update category.
const update = async (id, data) => {
    try {
        if (await slugExist({ id, data })) {
            return { flag: false }
        }

        data.slug = slugify(data?.name);
        const SELECT = {
            "name": 1,
            "parentCategory": 1,
            "image": 1,
            "description": 1,
            "topics": 1,
            "canDel": 1,
            "isActive": 1,
            "slug": 1,
            _id: 1
        }
        const result = await Category.findOneAndUpdate({ _id: id }, data, {
            new: true, populate: [
                {
                    path: "parentCategory image topics",
                    select: "name uri"
                }
            ],
            fields: SELECT
        });
        return { flag: true, data: result };
    } catch (error) {
        logger.error("Error - updateCategory", error);
        throw new Error(error)
    }
}

//uupdate category activation.
const partialUpdate = async (id, data) => {
    try {
        const updateActivation = await dbService.updateDocument(Category, id, data);
        if (updateActivation) {
            return { flag: true, data: updateActivation }
        }
        return { flag: flase }
    } catch (error) {
        logger.error("Error - updateCategoryActivation", error);
        throw new Error(error);
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
            options.sort = data?.options?.sort ? data?.options?.sort : { createdAt: -1 }
        }
        if (data?.query) {
            query = {
                ...data.query,
                ...data.query.filter,
                deletedAt: { $exists: false }
            };
        }

        if (data?.query?.instructorId) {
            instructorCateQuery = await getFilterInstructorCategoryIds(data)
            query = {
                ...query,
                ...instructorCateQuery
            }
        }
        return await dbService.getAllDocuments(Category, { ...query }, options);
        
    } catch(error){
        logger.error("Error - getCategoryList", error);
        throw new Error(error);
    }
}

const getFilterInstructorCategoryIds = async (data) => {
    try {
        let allCategories = [], userCategory,  query = {}
        userCategory = await user.findOne({ _id: data?.query?.instructorId })
        if(userCategory?.allCat) {
            allCategories = await Category.find({ deletedAt : { $exists : false }, isActive: true })
        }
        if(allCategories.length) {
            query = getFilteredCatIds(data, allCategories)
        } else {
            query = getFilteredCatIds(data, userCategory?.agreement?.category)
        }
        return query
    } catch(error) {
        logger.error("Error - getFilterInstructorCategoryIds ", error)
        throw new Error(error)
    }
}

const getFilteredCatIds = (data, usrCatList) => {
    try {
        let query = {}, listaedCatIds = []
        if (data?.query?.id) {
            listaedCatIds = _.filter(usrCatList, (category) => {
                return category.toString() != data?.query?.id
            })
            query.$and = [{ _id: { $nin: [mongoose.Types.ObjectId(data?.query?.id)] } }, { _id: { $in : listaedCatIds } }]
        } else {
            query._id = { $in: usrCatList }
        }
        return query
    } catch (error) {
        logger.error("Error - getFilteredCatIds ", error)
        throw new Error(error)
    }
}

//soft-delete category
const softDeleteCategory = async (ids, data) => {

    try {
        const parentCat = await Category.findOne({ parentCategory: { $in: ids }, deletedAt: { $exists: false } })
        if (parentCat) {
            return { flag: false }
        }
        const seoEn = await seoEntity.find({ entityId: { $in: ids } }, { _id: 0, seoId: 1 });

        await dbService.bulkUpdate(seoEntity, { entityId: { $in: ids } }, data);
        await dbService.bulkUpdate(seoModel, { _id: seoEn[0]?.seoId }, data)
        return { flag: true };

    } catch (error) {
        logger.error("Error - deleteCategory", error);
        throw new Error(error)
    }
}

const categoryList = async (data) => {
    try {
        const offset = data.options.page > 1 ? (data.options.page - 1) * data.options.limit : 0;
        const limit = data.options.limit || 10;
        let aggregation = []
        aggregation.push(
            {
                $match: {
                    deletedAt: {
                        $exists: false
                    },
                    isActive: true,
                    $expr: {
                        $eq: [{ $size: "$parentCategory" }, 0]
                    }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$$id", "$parentCategory"]
                                },
                                deletedAt: { $exists: false },
                                isActive: true
                            }
                        },
                    ],
                    as: "subCategory"
                }
            },
            {
                $sort: data.options.sort ? data.options.sort : { createdAt: -1 }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    docs: data.options.pagination == false? [{ $skip: offset }]: [{ $skip: offset }, { $limit: limit },]
                }
            }
        )
        const resultAggregate = await Category.aggregate(aggregation)
        const result = convertPaginationResult(resultAggregate, {
            offset,
            limit
        });
        return result
    } catch (error) {
        logger.error('Error - categoryList', error)
        throw new Error(error)
    }
}

module.exports = {
    create,
    update,
    partialUpdate,
    softDeleteCategory,
    getList,
    categoryList
};
