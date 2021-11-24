const express = require('express');
const cors    = require('cors');
const db      = require('../db/connection');

class Server {
  constructor() {
    this.app  = express();
    this.port = process.env.PORT || 8080;

    this.paths = {
      cache: '/api/cache',
      sale:  '/api/sales',
    };

    /** DB connection */
    this.dbConnection();

    this.middlewares();

    /** API Rest routes */
    this.routes();
  }

  async dbConnection() {
    try {
      await db.authenticate();
      console.log('DB online');
    } catch ( error ) {
      throw new Error( error );
    }
  }

  middlewares() {
    /** CORS */
    this.app.use( cors() );

    /** Read and parse body */
    this.app.use( express.json() );
  }
  
  routes() {
    this.app.use( this.paths.cache, require('../routes/cache') );
    this.app.use( this.paths.sale,  require('../routes/sales') );
  }
  
  listen() {
    this.app.listen( this.port, () => {
      console.log('Server running on PORT: ', this.port);
    });
  }
}

module.exports = Server;