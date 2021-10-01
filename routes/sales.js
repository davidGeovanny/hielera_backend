const { Router } = require('express');

const { validateKey, checkValidityFields } = require('../middlewares');

const { getSales } = require('../controllers/sales');
const { saleGetRules } = require('../rules/sale-rules');

const router = Router();

router.get('/', [
  validateKey,
  ...saleGetRules,
  checkValidityFields
], getSales);

module.exports = router;