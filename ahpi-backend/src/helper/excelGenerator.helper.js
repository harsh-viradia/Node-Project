const excel = require("exceljs");

const exportToExcel = async (workSheetName, columns, data) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet(workSheetName);
    worksheet.columns = columns;
    worksheet.columns.forEach((column) => {
        column.width = column.header.length < 12 ? 12 : column.header.length;
    });
    worksheet.getRow(1).font = {bold: true};
    worksheet.addRows(data);
    return { worksheet, workbook };
};

module.exports = {
    exportToExcel
}