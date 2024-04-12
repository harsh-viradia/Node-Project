const NUMBER_REGEX = /^\d+$/
const FLOAT_REGEX = /^\d+\.?\d{0,2}$/
const OTP_REGEX = /^\d*$/

const REGEX = {
  ALPHANUMERIC: /^(?=.*[A-Za-z])(?=.*\d)[\dA-Za-z]+$/,
  FULLNAME: /^([A-Za-z]+|[A-Za-z]+\s[A-Za-z]+)+$/,
  ALPHANUMERIC_SPACE: /^(\w+|(\w+\s\w+)+)/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!#$%&*?@])[\d!#$%&*?@A-Za-z]{8,}$/,
  EIGHTCHAR: /^.{8,}$/,
  UPPER_LOWER: /^(?=.*[A-Z])(?=.*[a-z]).*[A-Za-z].*$/,
  NUMBER_SPECIALCHAR: /^(?=.*\d)(?=.*[!"#$%&()*,.:<>?@^`{|}~]).*[\d!"#$%&()*,.:<>?@^`{|}~].*$/,
  BUSSINESS_NAME: /^([\dA-Za-z]+|[\dA-Za-z]+(\s[\d.A-Za-z]+)+)+$/,
  LISCENSE_NUM: /^[\dA-Za-z]+$/,
  ONLY_NUM: /^(\d)+$/,
  URL: /[\w#%()+./:=?@~]{2,256}\.[a-z]{2,6}\b([\w#%&+./:=?@~-]*)/,
  SPACE_REMOVE_REGEX: / /g,
}

module.exports = {
  REGEX,
  NUMBER_REGEX,
  FLOAT_REGEX,
  OTP_REGEX,
}
