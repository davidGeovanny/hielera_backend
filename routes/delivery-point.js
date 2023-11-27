const { Router } = require('express');

const { validateKey, checkValidityFields } = require('../middlewares');

const { getDeliveryPointEmployees } = require('../controllers/delivery-point-employees');

const router = Router();

router.get('/', [
  validateKey,
  checkValidityFields
], getDeliveryPointEmployees);

module.exports = router;