const { response, request } = require('express');
const Sales = require('../models/sales-with-detail');

const { GET_CACHE, SET_CACHE } = require('../helpers/cache');

const getSales = async ( req = request, res = response ) => {
  const { initDate, finalDate, employees } = req.query;
  const key = req.originalUrl;

  try {
    let sales = JSON.parse( GET_CACHE( key ) );

    if( sales ) {
      return res.json({
        ok: true,
        sales,
      });
    }

    if( !!employees ) {
      const [ data, metadata ] = await Sales.getSalesWithEmployees( initDate, finalDate );
      sales = data;
    } else {
      const [ data, metadata ] = await Sales.getSales( initDate, finalDate );
      sales = data;
    }

    SET_CACHE( key, JSON.stringify( sales ) );
    
    return res.json({
      ok: true,
      sales,
    });
  } catch ( err ) {
    console.log( err );
    return res.status(400).json({
      ok:  false,
      msg: 'An error has ocurred',
      err
    });
  }
}

module.exports = {
  getSales,
};