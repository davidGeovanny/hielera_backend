const { response, request } = require('express');
const DeliveryPointEmployees = require('../models/delivery-point-employees');

const { GET_CACHE, SET_CACHE } = require('../helpers/cache');

const getDeliveryPointEmployees = async ( req = request, res = response ) => {
  const key = req.originalUrl;

  try {
    let deliveryPointEmployees = JSON.parse( GET_CACHE( key ) );

    if( deliveryPointEmployees ) {
      return res.json({
        ok: true,
        deliveryPointEmployees,
      });
    }

    const [ data, metadata ] = await DeliveryPointEmployees.getDeliveryPointEmployees();
    deliveryPointEmployees = data;

    SET_CACHE( key, JSON.stringify( deliveryPointEmployees ) );
    
    return res.json({
      ok: true,
      deliveryPointEmployees,
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
    getDeliveryPointEmployees,
};