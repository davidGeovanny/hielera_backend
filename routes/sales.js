const { Router } = require('express');

const { validateKey, checkValidityFields, cache } = require('../middlewares');
const { saleGetRules } = require('../rules/sale-rules');

const { getSales } = require('../controllers/sales');

const router = Router();

router.get('/', [
  validateKey,
  // cache( 300 ),
  ...saleGetRules,
  checkValidityFields
], getSales);

module.exports = router;