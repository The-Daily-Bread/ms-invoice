const mysql = require('mysql');

/**
 * @typedef {Object} FactoryConfig
 * @property {string} host
 * @property {string} user
 * @property {string} password
 * @property {string} database
 * @property {number} port
 */

class Factory {
  /** @type {mysql.Connection} */
  connection = null;

  constructor() {
    this.createConnection();
  }

  getConnection() {
    return this.connection;
  }

  close() {
    this.connection.end();
  }

  /**
   * @private
   * @returns {FactoryConfig}
   */
  getDBCredentials() {
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_NAME || !process.env.DB_PORT) {
      console.log(process.env);
      
      throw new Error('Missing DB credentials');
    }

    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT)
    }
  }

  createConnection() {
    const credentials = this.getDBCredentials();

    const connection = mysql.createConnection({
      host: credentials.host,
      user: credentials.user,
      password: credentials.password,
      database: credentials.database,
      port: credentials.port,
      insecureAuth: true
    });

    this.connection = connection;
  }
}

module.exports = Factory;