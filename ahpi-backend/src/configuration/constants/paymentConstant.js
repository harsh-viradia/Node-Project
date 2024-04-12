const STATUS = {
    SUCCESS: "SUCCESS",
    PENDING: "PENDING",
    FAILED: "FAILED",
    CAPTURED: "captured",
    CAPTURE: "capture",
    SETTLEMENT: "settlement",
    DENY: "deny",
    CANCEL: "cancel",
    EXPIRE: "expire"
}

const PAYTM_STATUS = {
    TXN_SUCCESS: "TXN_SUCCESS",
    TXN_FAILURE:"TXN_FAILURE",
    TXN_PENDING: "TXN_PENDING"
}

const PAYMENT_STATUS = {
    "SUCCESS": "S",
    "FAILED": "F"
}

const PAYTM_CODE = {
    SYSTEM_ERROR : '00000900'
}

const CHANNEL_ID = {
    WEB: "WEB",
    WAP: "WAP"
}

const TYPE = {
    PYTM: "PAYTM",
    IN_APP_PURCHASE: "IN_APP_PURCHASE",
}

const APPROVAL_CODE = {
    AHPI_APPROVAL_CODE:1122
}

const ORDERSTATUS = {
    SUCCESS: 1,
    PENDING:2,
    FAILED:3
}

const ORDERSTS = {
    SUCCESS: "SUCCESS",
    PENDING:"PENDING",
    FAILED:"FAILED"
}

const SERIES = {
    ORDER: 1,
    TRANS: 2,
    INV: 3,
    CERTIFICATE: 4,
    CUST: 5
}

const CURRENCY = {
    INR: "INR"
}

module.exports = {
    STATUS,
    TYPE,
    ORDERSTATUS,
    SERIES,
    CURRENCY,
    APPROVAL_CODE,
    ORDERSTS,
    PAYMENT_STATUS,
    CHANNEL_ID,
    PAYTM_STATUS,
    PAYTM_CODE
}
