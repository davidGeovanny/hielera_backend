const { Sequelize } = require('sequelize');

const db = new Sequelize( process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host		: '10.10.1.56',
  dialect	: 'mysql',
  // logging : false,
});

module.exports = db;