const COLLECTION_REF = {
    USER: {
        order: { objectType: ["user"], modelFileNm : 'order.model', modelFolderNm: 'order' }
    }
}

const IGNORE_SELECTED_KEYS = ["_id", "id", "_v", "createdAt", "updatedAt", "createdBy", "updatedBy", "fcmToken", "deviceToken"]

module.exports = {
    COLLECTION_REF,
    IGNORE_SELECTED_KEYS
}