/* eslint-disable no-useless-escape */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/better-regex */

const NUMBER_REGEX = /^\d+$/
const FLOAT_REGEX = /^\d+\.?\d{0,2}$/
const OTP_REGEX = /^[0-9]*$/

const REGEX = {
  ALPHANUMERIC: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/,
  FULLNAME: /^([a-zA-Z]+|[a-zA-Z]+\s{1}[a-zA-Z]{1,})+$/,
  ALPHANUMERIC_SPACE: /^([\w]+|([\w]+\s{1}[\w]{1,})+)/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!#$%&*?@])[\d!#$%&*?@A-Za-z]{8,}$/,
  EIGHTCHAR: /^.{8,}$/,
  UPPER_LOWER: /^(?=.*[A-Z])(?=.*[a-z]).*[A-Za-z].*$/,
  NUMBER_SPECIALCHAR: /^(?=.*\d)(?=.*[`~!"#$%&()*,.:<>?@^{|}]).*[\d`~!"#$%&()*,.:<>?@^{|}].*$/,
  NUMBER_SPECIALCHAR_AUTH: /^(?=.*\d)(?=.*[`$#@!*^&~]).*[\d`$#@!*^&~].*$/,
  BUSSINESS_NAME: /^([a-zA-Z0-9]+|[a-zA-Z0-9]+(\s[a-zA-Z0-9.]+){1,})+$/,
  LISCENSE_NUM: /^[a-zA-Z0-9]+$/,
  ONLY_NUM: /^([0-9])+$/,
  URL: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  SPACE_REMOVE_REGEX: / /g,
}

module.exports = {
  REGEX,
  NUMBER_REGEX,
  FLOAT_REGEX,
  OTP_REGEX,
}
