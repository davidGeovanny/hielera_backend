const { response, request } = require('express');
const Sales = require('../models/sales-with-detail');

const getSales = async ( req = request, res = response ) => {

  const { initDate, finalDate } = req.query;

  try {
    const [ sales, metadata ] = await Sales.getSales( initDate, finalDate );

    res.json({
      ok: true,
      // sales: sales.slice(0, 100)
      sales,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      err
    });
  }
}

module.exports = {
  getSales,
};