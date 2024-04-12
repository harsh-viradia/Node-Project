const POPULATE = [
  {
    path: "roles.roleId profileId designation.state",
    select: "name code uri",
  },
];

const COUNTRYCONST = {
  INDIA: "91",
}
const USER_MODEL ='user'

module.exports = {
  POPULATE,
  COUNTRYCONST,
  USER_MODEL
};
