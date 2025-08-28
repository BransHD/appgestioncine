const { Sequelize, QueryTypes, Model, Op, DataTypes, Transaction, Deferrable } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const connectionDB = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_SERVER,
  dialect: 'mssql',
  port: process.env.PORT_DB,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  logging: true,
  /*logging: (msg) => {
    if (msg.startsWith('Executing')) {
      console.log(msg);
    }
  },*/
});

module.exports = connectionDB;
