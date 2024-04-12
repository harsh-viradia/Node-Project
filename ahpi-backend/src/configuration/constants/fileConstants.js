const FILE_STATUS = {
    PROCESSING: 0,
    FAILED: 1,
    UPLOADED: 2,
};

const FILE_URI = {
    IMAGE: "images/",
    VIDEO: "videos/",
    DOCUMENTS: "documents/",
    INVOICES: "invoices/",
    CERTIFICATES: "certificates/"
};

const FILE_MODEL ='file'
module.exports = {
    FILE_STATUS,
    FILE_URI,
    FILE_MODEL
};
