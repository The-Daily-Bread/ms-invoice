const mysql = require('mysql');
const { v4: uuid } = require('uuid');

/**
 * @typedef {Object} Log
 * @property {string} id
 * @property {number} timestamp
 * @property {string} content
 * @property {string} message
 */

class LogDao {
  /** @type {mysql.Connection} */
  connection = null;

  constructor(connection) {
    this.connection = connection;
  }

  /**
   * 
   * @param {Log} log 
   */
  async put(log) {
    const sql = `
      INSERT INTO log
      (id, timestamp, content, message)
      VALUES
      (?, ?, ?, ?)
    `;

    const values = [
      uuid(),
      log.timestamp,
      log.content,
      log.message
    ];

    await new Promise((resolve, reject) => {
      this.connection.query(sql, values, (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });

    return log;
  }
}

module.exports = {
  LogDao
};