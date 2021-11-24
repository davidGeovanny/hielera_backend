const { Router } = require('express');

const { validateKey, checkValidityFields } = require('../middlewares');
const { saleGetRules } = require('../rules/sale-rules');

const { getSales } = require('../controllers/sales');

const router = Router();

router.get('/', [
  validateKey,
  ...saleGetRules,
  checkValidityFields
], getSales);

module.exports = router;