const { FILE_STATUS, FILE_TYPE } = require("../../configuration/constants/fileConstants");

const fileData = async (userId, file) => {
  if (
    !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|webp|WEBP|png|PNG|pdf|PDF|docx|DOCX|mp4|MP4|doc|DOC|webm|WEBM|avi|AVI|svg|SVG|GIF|gif|TXT|txt|ppt|pptx|PPTX|pptm|PPTM|PPT|xlsx|XLSX|XLS|XLSM|xls|xlsm|MPV|mpv|OGG|M4V|M4P|m4v|m4p)$/)
  ) {
    return { flag: false, data: "file.fileType" };
  }
  const data = {
    nm: file.originalname,
    oriNm: file.originalname,
    type: file.mimetype,
    exten: file.originalname.split(".").pop(),
    mimeType: file.mimetype,
    size: file.size,
    sts: FILE_STATUS.UPLOADED,
    uri: file.location,
    createdBy: userId,
  };
  return { flag: true, data: data };
};

module.exports = fileData;
