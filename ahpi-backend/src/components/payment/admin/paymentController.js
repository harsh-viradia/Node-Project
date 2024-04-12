const paymentService = require("../paymentService")

const listTransactions = catchAsync(async (req, res) => {
    const result = await paymentService.listTransactions(req);
    res.message = _localize("module.list", req, "Transactions");
    return utils.successResponse(result, res);
});

const exportTransactions = catchAsync(async (req, res) => {
    const {workbook, fileName} = await paymentService.exportTransactions(req);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    workbook.xlsx.write(res)
        .then(function () {
            res.end()
        });
});

module.exports ={
    listTransactions,
    exportTransactions
}