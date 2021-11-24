const { request, response } = require('express');

const validateKey = ( req = request, res = response, next ) => {
  const key = req.header('x-auth');

  if( !key ) {
    return res.status(401).json({
      ok:  false,
      msg: 'Key not valid',
      errors: {
        name: 'ValidationKeyError',
        msg:  'There is no key in the request'
      }
    });
  }

  if( key !== process.env.SECRETAUTHKEY ) {
    return res.status(401).json({
      ok:   false,
      msg: 'Key not valid',
      errors: {
        name: 'ValidationKeyError',
        msg:  'The key is not valid'
      }
    });
  }
  
  next();
}

module.exports = {
  validateKey,
};