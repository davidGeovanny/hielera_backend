const { query } = require('express-validator');

const saleGetRules = [
  /** Query */
  query('initDate')
    .notEmpty()
    .withMessage('Need to provide an init date for search sales')
    .isDate()
    .withMessage('Need to provide a valid date'),
  query('finalDate')
    .notEmpty()
    .withMessage('Need to provide a final date for search sales')
    .isDate()
    .withMessage('Need to provide a valid date'),
  query('employees')
    .optional()
    .notEmpty()
    .withMessage('Value to include employees is not valid')
    .isBoolean()
    .withMessage('Value to include employees is not valid')
    .toBoolean()
];

module.exports = {
  saleGetRules,
};