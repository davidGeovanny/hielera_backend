const { response, request } = require('express');
const Sales = require('../models/sales-with-detail');
const mcache = require('memory-cache');

const getSales = async ( req = request, res = response ) => {

  const { initDate, finalDate } = req.query;

  try {
    const key   = `__hielera-backend__${ req.originalUrl }`;
    const reply = mcache.get( key );

    let sales;

    if( reply ) {
      sales = reply;
    } else {
      const [ data, metadata ] = await Sales.getSales( initDate, finalDate );
      sales = data;

      mcache.put( key, data, 6000 * 1000 );
    }

    res.json({
      ok: true,
      // sales: sales.slice(0, 100)
      sales,
    });
  } catch ( err ) {
    console.log( err )
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