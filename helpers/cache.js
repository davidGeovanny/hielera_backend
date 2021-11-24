const mcache = require('memory-cache');

const CACHE_TIME_DEFAULT = 300000;

/**
 * Gets the cache value.
 * @param   { string } key         Cache identified name.
 * @returns { string | undefined } Data in JSON.stringify format.
 */
const GET_CACHE = ( key ) => {
  try {
    const data = mcache.get( `__hielera-backend__${ key }` );

    return data;
  } catch ( err ) {
    console.log( err );
    return undefined;
  }
}

/**
 * Gets the cache value.
 * @param   { string } data Data to cache in JSON.stringify format.
 * @param   { string } key  Cache identified name.
 * @param   { number } time How long the information is cached ( ms ).
 * @returns { boolean }     How long the information is cached.
 */
const SET_CACHE = ( key, data, time = CACHE_TIME_DEFAULT ) => {
  try {
    mcache.put( `__hielera-backend__${ key }`, data, time );

    return true;
  } catch ( err ) {
    console.log( err );
    return false;
  }
}

module.exports = {
  GET_CACHE,
  SET_CACHE,
};