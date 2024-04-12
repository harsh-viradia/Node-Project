const STATUS  = {
    DRAFT : 1,
    PUBLISH : 2,
    publish: "publish",
    draft: "draft"
}

const PROGRESS_STS = {
    INPROGRESS : 1,
    COMPLETED: 2
}

const QUIZ_STS = {
    NOT_ATTEMPTED: 1,
    ATTEMPTED: 2,
    ONGOING: 3  
}

const MATERIAL = {
    VIDEO: 1,
    QUIZ: 2,
    TEXT: 3,
    DOCUMENTS: 4,
    QUIZ_WITH_CERTIFICATE: 5,
}

const QUESTION_TYPES = {
    MCQ: "MCQ",
    MSQ: "MSQ",
    NUMERIC: "NUMERIC",
    TEXT: "TEXT"
}

module.exports = {
    STATUS,
    PROGRESS_STS,
    QUIZ_STS,
    MATERIAL,
    QUESTION_TYPES
}