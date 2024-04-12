const JWT = {
  ADMIN_SECRET: "myjwtadminsecret",
  USER_SECRET: "myjwtadminsecret",
  EXPIRES_IN: "24h",
  REFRESH_EXPIRES_IN: "30d",
  SECRET: "myjwtsecret",

};
const JWT_STRING = 'jwt '
const ROLE = {
  ADMIN: "ADMIN",
  SUB_ADMIN: "SUB_ADMIN",
  LEARNER: "LEARNER",
  INSTRUCTOR: "INSTRUCTOR",
};

const PLATFORM = {
  ADMIN: ["ADMIN"],
  WEB_AND_DEVICE: ["LEARNER", "INSTRUCTOR"],
};

const MODULE = {
  ADMIN: "admin",
  CLIENT: "client",
  DEVICE: "device",
};

const SYMBOLS = {
  ATRATE: "@"
}

const RANDOM_PASSWORD_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz1234567890"
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const SSO_REGISTER = 'ssoRegister'
module.exports = {
  JWT,
  ROLE,
  PLATFORM,
  MODULE,
  JWT_STRING,
  SSO_REGISTER,
  RANDOM_PASSWORD_CHAR,
  PASSWORD_REGEX,
  SYMBOLS
};
