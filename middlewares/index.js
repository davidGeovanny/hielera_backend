const checkValidityFields = require('./check-validity-fields');
const validateKey         = require('./validate-key');
const cache               = require('./cache');

module.exports = {
  ...checkValidityFields,
  ...validateKey,
  ...cache,
};