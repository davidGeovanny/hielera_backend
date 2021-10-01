const checkValidityFields = require('./check-validity-fields');
const validateKey         = require('./validate-key');

module.exports = {
  ...checkValidityFields,
  ...validateKey,
};