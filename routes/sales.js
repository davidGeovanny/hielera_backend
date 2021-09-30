const { Router } = require('express');
const { getSales } = require('../controllers/sales');

const router = Router();

router.get('/', [

], getSales);

module.exports = router;